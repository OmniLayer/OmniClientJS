/**
 * Omni Layer JSON-RPC client
 * Extends Bitcoin JSON-RPC client bitcoin by freewil,
 * requires Node.js 4.2 or later.
 *
 * @author Patrick Dugan
 * @author Sean Gilligan
 */
'use strict';

var BitcoinClient = require('bitcoin').Client;

/**
 * Extend the basic Bitcoin Client, 'bitcoin' by 'freewil' and add promises.
 * Code is based upon (copied from) the bitcoin-promise NPM module, but extensible so we can
 * subclass and add additional methods.
 */
class BitcoinPromisesClient extends BitcoinClient {

  /**
   * Use super-constructor
   * @param opts see super for format
   */
  constructor(opts) {
    super(opts);
  }

  /**
   * Call an RPC method
   * @param method method name
   * @param args arguments
   * @returns {*}
   */
  callRpc(method, args) {
    var client = this;
    var promise = null ;
    var fn = args[args.length-1];

//	If the last argument is a callback, pop it from the args list
    if (typeof fn === 'function') {
      args.pop();
      this.rpc.call(method, args, function(){
        var args = [].slice.call(arguments);
        args.unshift(null);
        fn.apply(this, args);
      }, function(err){
        fn(err);
      });
    } else {
//		.....................................................
//		if no callback function is passed - return a promise
//		.....................................................
      promise = new Promise(function(resolve, reject) {
        client.rpc.call(method, args, function(){
          var args = [].slice.call(arguments);
          args.unshift(null);
//				----------------------
//				args is err,data,hdrs
//				but we can only pass 1 thing back
//				rather than make a compound object - ignore the headers
//				errors are handled in the reject below
          resolve( args[1] );
        }, function(err){
          reject( err );
        });
      });
//		Return the promise here
      return promise ;
    }
  }
}

// The below code copied from bitcoin-promise and may be possible to optimize
// Find all methods that are actually RPC calls
(function() {
  let methods = Object.getOwnPropertyNames(BitcoinClient.prototype).filter(function(p) {
    return typeof BitcoinClient.prototype[p] === 'function' && p !== "cmd" && p!= "constructor";
  });
  // Augment them with callRPC
  for (let i = 0 ; i<methods.length ; i++ ) {
    let protoFn = methods[i] ;
    (function(protoFn) {
      BitcoinPromisesClient.prototype[protoFn] = function() {
        let args = [].slice.call(arguments);
        return this.callRpc(protoFn.toLowerCase(), args);
      };
    })(protoFn);
  }
})();

var OmniClientCommands = {
  //omniGetAllBalancesForAddress: 'omni_getallbalancesforaddress',
  omniGetBalance: 'omni_getbalance',
  //omniGetAllBalancesForId: 'omni_getallbalancesforid',
  omniGetTransaction: 'omni_gettransaction',
  omniGetOrderBook: 'omni_getorderbook',
  omniListTransactions: 'omni_listtransactions',
  omniListBlockTransactions: 'omni_listblocktransactions',
  omniGetProperty: 'omni_getproperty',
  omniListProperties: 'omni_listproperties',
  omniGetCrowdsale: 'omni_getcrowdsale',
  omniGetActiveCrowdsales: 'omni_getactivecrowdsales',
  omniGetActiveDexSells: 'omni_getactivedexsells',
  omniGetTrade: 'omni_gettrade',
  omniGetSto: 'omni_getsto',
  omniGetTradeHistoryForPair: 'omni_gettradehistoryforpair',
  omniGetTradeHistoryForAddress: 'omni_gettradehistoryforaddress',
  omniListPendingTransactions: 'omni_listpendingtransactions',
  omniSend: 'omni_send',
  omniSendDexSell: 'omni_senddexsell',
  omniSendCancelAllTrades: 'omni_sendcancelalltrades',
  omniSendCancelTradesByPrice: 'omni_sendcanceltradesbyprice',
  omniSendCancelTradesByPair: 'omni_sendcanceltradesbypair',
  omniSendChangeIssuer: 'omni_sendchangeissuer',
  omniSendTrade: 'omni_sendtrade',
  omniSendCloseCrowdsale: 'omni_sendclosecrowdsale',
  omniSendAll: 'omni_sendall',
  omniSendIssuanceCrowdsale: 'omni_sendissuancecrowdsale',
  omniSendIssuanceFixed: 'omni_sendissuancefixed',
  omniSendRevoke: 'omni_sendrevoke',
  omniSendGrant: 'omni_sendgrant',
  omniSendIssuanceManaged: 'omni_sendissuancemanaged'
};

/**
 * Omni JSON-RPC client that adds Omni methods to the existing Bitcoin methods
 * in bitcoin.Client.
 */
class OmniClient extends BitcoinPromisesClient {

  /**
   * Use super-constructor
   * @param opts see super
   */
  constructor(opts) {
    super(opts);
  }

  /**
   * Call omni_getallbalancesforaddress
   *
   * @param address Address to get balances for
   * @returns Promise<BalanceArray|Error> a promise for the balance info
   */
  omniGetAllBalancesForAddress(address) {
    return this.callRpc('omni_getallbalancesforaddress', [address]);
  }

  /**
   * Call omni_getallbalancesforid
   *
   * @param omni_getallbalancesforid Address to get balances for
   * @returns Promise<BalanceArray|Error> a promise for the balance info
   */
  omniGetAllBalancesForId(currencyId) {
    return this.callRpc('omni_getallbalancesforid', [currencyId]);
  }
}

OmniClient.mainNet = {
  exodusAddress: "1EXoDusjGwvnjZUyKkxZ4UHEf77z6A5S4P"
};
OmniClient.testNet = {
  exodusAddress: "mpexoDuSkGGqvqrkrjiFng38QPkJQVFyqv",
  moneyManAddress: "??"
};
OmniClient.regTestNet = {
  exodusAddress: "mpexoDuSkGGqvqrkrjiFng38QPkJQVFyqv",
  moneyManAddress: "moneyqMan7uh8FqdCA2BV5yZ8qVrc9ikLP"
};

(function () {
  for (let method in OmniClientCommands) {
    (function(methodName) {
      OmniClient.prototype[methodName] = function() {
      let args = [].slice.call(arguments);
      return this.callRpc(OmniClientCommands[methodName], args);
      };
    })(method);
  }
})();


/**
 * The `Omni` object is from an earlier version of the client and is deprecated and will be removed.
 * Although it is exported it should not be used in new code.
 * @deprecated
 */
var Omni = {};
/**
 * An instance of the Bitcoin JSON-RPC client. This is deprecated. When you create
 * an instance of OmniClient it now extends the Bitcoin client object.
 * @private
 * @deprecated
 */
var client;

Omni.init = function(user, pass, otherip, test){
  var host;
  if(otherip == null){host = 'localhost'}else{host=otherip}
  var port;
  if(test == false || test == null){port = 8332}else{port=18332}
  client = new BitcoinClient({
    host: host,
    port: port,
    user: user,
    pass: pass
  });

  return client
};

Omni.getnewaddress = function(account, cb){
  if(account == null|| account == undefined){
    client.cmd('getnewaddress',function(err,address,resHeaders){
      if (err) return console.log(err)
      console.log("created address:"+address)
      return cb(address)
    })}else{
    client.cmd('getnewaddress', account, function(err, address, resHeaders) {
      if (err) return console.log(err)
      console.log(address);
      return cb(address)
    })
  }
};

Omni.listaccounts = function(cb) {
  client.cmd('listaccounts',function(err,accounts,resHeaders) {
    if (err) return console.log(err)
//    console.log("listaccounts: %j", accounts)
    return cb(accounts)
  })
}

Omni.getaccountaddress = function(account, cb){
    if(account == null){
    client.cmd('getaccountaddress',function(err,data,resHeaders){
      if (err) return console.log(err)
  console.log("Account created"+data)
  return cb(data)
    })}else{
    client.cmd('getaccountaddress', account, function(err,data,resHeaders){
      if (err) return console.log(err)
    console.log("Account returned:"+data)
    return cb(data)
    })}
}

Omni.getaddressesbyaccount = function(cb){
    client.cmd('getaddressesbyaccount',function(err,addresses,resHeaders){
      if (err) return console.log(err)
  console.log(addresses)
  return cb(data)
    })
}

Omni.getaccount = function(address, cb){
     client.cmd('getaccount', address, function(err,account,resHeaders){
      if (err) return console.log(err)
  return cb(account)
    })
}

Omni.getbalance = function(account, confirmations, cb){
  client.cmd('getbalance', account, 1, function(err, balance, resHeaders){
  if (err) return console.log(err)
  console.log('Bitcoin balance:', balance)
  return cb(balance)
  })
}

Omni.getreceivedbyaddress = function(address, confirmations, cb){
     client.cmd('getreceivedbyaddress', address, confirmations, function(err, balance, resHeaders){
  if (err) return console.log(err)
  console.log('bitcoin received:', balance)
  return cb(balance)
  })
}

Omni.getinfo =function(cb){
    client.cmd("getinfo", function(err, data, resHeaders){
  if (err) return console.log(err);
 
  })
  return cb(data)
}

//all parameters must be text

Omni.getrawtransaction = function(txid, cb){
     client.cmd("getrawtransaction", txid , 1,function(err, data, resHeaders){
  if (err) return console.log(err);
 
  return cb(data)
  })
}

Omni.getblockhash = function(block, cb){
     client.cmd("getblockhash", block,function(err, data, resHeaders){
  if (err) return console.log(err);
 
  return cb(data)
         
     })
}
 
Omni.getblock = function(hash, cb){
     client.cmd("getblock", hash,function(err, data, resHeaders){
  if (err) return console.log(err);
 
  return cb(data)
  }) 
}

Omni.sendrawtransaction = function(tx, cb){
    try{
       client.cmd("sendrawtransaction", tx,function(err, data, resHeaders){
  if (err) return console.log(err);
 
  })
    }catch(e){
      return e
    }
    return cb(data)
}

Omni.validateaddress = function(addr, cb){
     client.cmd("validateaddress", addr,function(err, data, resHeaders){
  if (err) return console.log(err);
 
  return cb(data)
  })
}

Omni.sendtoaddress = function(addr, amt, cb){
    client.cmd("sendtoaddress",addr,amt,function(err, data, resHeaders){
        console.log(data)
        return cb(data)
    })
}

Omni.createrawtransaction = function(ins,outs, cb){
     client.cmd("createrawtransaction",ins,outs,function(err, data, resHeaders){
  if (err) return console.log(err);
 
  return cb(data)
    })
}

Omni.decoderawtransaction = function(rawtx, cb){
     client.cmd("decoderawtransaction", rawtx,function(err, data, resHeaders){
  if (err) return console.log(err)
 
  return cb(data)
  })
}

// Omnilayer Specific RPC calls
Omni.getomnibalance = function(addr, propertyid, cb){
     client.cmd("omni_getbalance", addr, propertyid,function(err, data, resHeaders){
  if (err) return console.log(err);
 
  return cb(data)
  })
}

Omni.getallbalancesforaddress = function(addr, cb){
     client.cmd("omni_getallbalancesforaddress", addr,function(err, data, resHeaders){
  if (err) return console.log(err);
 
  return cb(data)
  })
}
    
Omni.getallbalancesforid = function(propertyid, cb){
     client.cmd("omni_getallbalancesforid", propertyid,function(err, data, resHeaders){
  if (err) return console.log(err);
 
  return cb(data)
  })
}

Omni.gettransaction = function(tx, cb){
     client.cmd("omni_gettransaction", tx,function(err, data, resHeaders){
  if (err) return console.log(err);
 
  return cb(data)
  })
}

Omni.getorderbook = function(id1, id2, cb){
    if(id2 == null){
        client.cmd("omni_getorderbook", id1, function(err, data, resHeaders) {
            if(err) return console.log(err)
        return cb(data)
    })}else{client.cmd("omni_getorderbook", id1, id2, function(err, data, resHeaders) {
        if(err){console.log(err)}
        console.log('book'+data)
        //if(err) return console.log(err)
        return cb(data)
    })}
}

Omni.listtransactions = function(txid, count, skip, startblock, endblock, cb){
    if(txid == null){txid ='*'}
    if(count == null){count =1}
    if(skip == null){skip =0}
    if(startblock == null){startblock=0}
    if(endblock == null){endblock=9999999}
     client.cmd("omni_listtransactions",txid, count, skip, startblock, endblock, function(err, data, resHeaders){
        if (err) return console.log(err)
 
        return cb(data)
  })
}

Omni.listblocktransactions = function(height, cb){
     client.cmd("omni_listblocktransactions", height,function(err, data, resHeaders){
  if (err) return console.log(err);
 
  return cb(data)
  })
}

Omni.getproperty= function(propertyid, cb){
     client.cmd("omni_getproperty", propertyid,function(err, data, resHeaders){
  if (err) return console.log(err);
 
  return cb(data)
  })
}

Omni.listproperties=function(cb){
     client.cmd("omni_listproperties",function(err, data, resHeaders){
        if (err) return console.log(err)
        return cb(data)
  })
}

Omni.getcrowdsale=function(propertyid, cb){
     client.cmd("omni_getcrowdsale", propertyid,function(err, data, resHeaders){
        if (err) return console.log(err);
        return cb(data)
    })
}

Omni.getactivecrowdsales=function(cb){
     client.cmd("omni_getactivecrowdsales",function(err, data, resHeaders){
        if (err) return console.log(err);
        return cb(data)
        })
}

Omni.getactivedexsells=function(cb){
        client.cmd("omni_getactivedexsells",function(err, data, resHeaders){
            if (err) return console.log(err);
 
            return cb(data)
        })
}

Omni.gettrade = function(txid, cb){
    client.cmd("omni_gettrade", txid, function(err, da, resHeaders){
        return cb(data)
    })
}

Omni.getsto = function(txid, recipients, cb){
    if(recipients = null){recipients = "*"}
    client.cmd("omni_getsto", txid, recipients, function(err, data, resHeaders){
        return cb(data)
    })
}

Omni.getdivisibleproperty = function(propertyid){
     client.cmd("omni_getproperty",'result','divisible', propertyid,function(err, data, resHeaders){
  if (err) return console.log(err);
 
  return cb(data)
  })
}

Omni.getproperty = function(propertyid, cb){
     client.cmd("omni_getproperty", propertyid,function(err, data, resHeaders){
        if (err) return console.log(err);
 
        return cb(data)
    })
}

Omni.gettradehistory= function(id1, id2, trades, cb){
    client.cmd("omni_gettradehistoryforpair", id1, id2, trades, function(err, data, resHeaders){
        return cb(data)
    })
}

Omni.gettradehistoryaddress= function(address, trades, propertyfilter, cb){
    
        if(propertyfilter == null){
            client.cmd("omni_gettradehistoryforaddress", address, trades, function(err, data, resHeaders){
                return cb(data)
            })
        }else{client.cmd("omni_gettradehistoryforaddress", address, trades, propertyfilter, function(err, data, resHeaders){
        return cb(data)
        })}
}

Omni.listpendingtransactions= function(addressfilter, cb){
    if(addressfilter == null){addressfilter = ''}
    client.cmd("omni_listpendingtransactions", addressfilter, function(err, data, resHeaders) {
        return cb(data)
    })
}

Omni.send = function(address, address2, id, amount, cb){
    client.cmd('omni_send', address, address2, id, amount, function(err, data, resHeaders){
        return cb(data)
    })
}

Omni.senddexsell = function(address, id, amount1, amount2, paymentwindow, fee, action, cb){  //action = (1 for new offers, 2 to update, 3 to cancel)
    client.cmd('omni_senddexsell', address, id, amount1, amount2, paymentwindow, fee, action,function(err, data, resHeaders){
        return cb(data)
    })
}

Omni.senddexaccept = function(address, address2, id, amount, cb){  //action = (1 for new offers, 2 to update, 3 to cancel)
    client.cmd('omni_senddexsell', address, address2, id, amount, false,function(err, data, resHeaders){
        return cb(data)
    })
}
    
Omni.sendcancelalltrades = function(address, ecosystem, cb){
    client.cmd('omni_sendcancelalltrades', address, ecosystem,function(err, data, resHeaders){
        return cb(data)
    })
}

Omni.sendcanceltradesbyprice = function(address, id1, amount1, id2, amount2, cb){
    client.cmd('omni_sendcanceltradesbyprice', address, id1, amount1, id2, amount2, function(err, data, resHeaders){
        return cb(data)
    })
}

Omni.sendcanceltradesbypair = function(address, id1, id2, cb){
    client.cmd('omni_sendcanceltradesbypair', address,function(err, data, resHeaders){
        return cb(data)
    })
}

Omni.sendchangeissuer = function(address1, address2, propertyid, cb){
    client.cmd('omni_sendchangeissuer', address1, address2, propertyid, function(err, data, resHeaders){
        return cb(data)
    })
}

Omni.sendtrade = function(address, id1, amount, id2, amount2, cb){
    client.cmd('omni_sendtrade', address, id1, amount.toString(), id2, amount2.toString(), function(err, data, resHeaders){
        if(err){data=err}
        return cb(data)
    })
}

Omni.sendclosecrowdsale = function(address, id, cb){
    client.cmd('omni_sendclosecrowdsale', address, id, function(err, data, resHeaders){
        return cb(err, data)
    })
}

Omni.sendall = function(address1, address2, ecosystem, cb){
    client.cmd('omni_sendall', address1, address2, ecosystem, function(err, data, resHeaders){
        return cb(data)
    })
}

Omni.sendissuancecrowdsale = function(params, cb){
    var address = params.fromaddress
    var ecosystem = params.ecosystem
    var type = params.type
    var previousid = params.previousid

    var category = params.category
    var subcategory = params.subcategory

    var name = params.name
    var url = params.url

    var data = params.data

    var amount = params.amount

    var tokensperunit = params.tokensperunit

    var deadline = params.deadline

    var earlybonus  = params.earlybonus
    var issuerpercentage = params.issuerpercentage
    client.cmd('omni_sendissuancecrowdsale',address, ecosystem, type, previousid, category, subcategory, name, url, data, amount, tokensperunit, deadline, earlybonus, issuerpercentage, function(err, data){
        return cb(data)
    })
} 

Omni.sendissuancefixed = function(params, cb){
    var address = params.fromaddress
    var ecosystem = params.ecosystem
    var type = params.type
    var previousid = params.previousid

    var category = params.category

    var subcategory = params.subcategory

    var name = params.name
    var url = params.url

    var data = params.data

    var amount = params.amount

    var tokensperunit = params.tokensperunit

    var deadline = params.deadline

    var earlybonus  = params.earlybonus
    var issuerpercentage = params.issuerpercentage
    client.cmd('omni_sendissuancefixed',address, ecosystem, type, previousid, category, subcategory, name, url, data, amount, function(err, data, resHeaders){
        return cb(data)
    })
} 

Omni.sendrevoke = function(address, id, amount, note, cb){
    client.cmd('omni_sendrevoke', address, id, amount, note, function(err, data, resHeaders){
        return cb(data)
    })
}

Omni.sendgrant = function(address1, address2, id, amount, note, cb){
    client.cmd('omni_sendgrant', address1, address2, id, amount, note, function(err, data, resHeaders){
        return cb(data)
    })
};

Omni.sendissuancemanaged = function(params, cb){
    var address = params.fromaddress
    var ecosystem = params.ecosystem
    var type = params.type
    var previousid = params.previousid
    var category = params.category
    var subcategory = params.subcategory
    var name = params.name
    var url = params.url
    var data = params.data
    client.cmd('omni_sendissuancemanaged', address, ecosystem, type, previousid, category, subcategory, name, url, data, function(err, data, resHeaders){
        console.log(data)
        return cb(data)
    })
};

exports.OmniClient = OmniClient;
exports.Omni = Omni;

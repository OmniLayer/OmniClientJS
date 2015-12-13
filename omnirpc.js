//loads a decent RPC client and the file-system

var rpc = require('jrpc2') //https://www.npmjs.com/package/jrpc2
var fs = require('fs')

//init object to use for client
var omniRPC ={

init: function(){

        var RPCPORT='8332'
        var RPCHOST='localhost'
        var RPCSSL= false
        var http = new rpc.httpTransport({port: RPCPORT, hostname: RPCHOST}); //loads this local host set-up in a new RPC client connection
        var client = new rpc.Client(http); //inializes a member object to this general object, which contains our call and listen functions
        
            fs.readFile('/root/.bitcoin/bitcoin.conf', 'ascii', function(err, data){ //loads the local bitcoin config file, parses it, assigns values
                if(err){console.log("Error:"+err)}
            
                if(line.split('=')[0] == "rpcuser"){
                    var RPCUSER = line.split('=')[1] 
                }
                
                if(line.split('=')[2] == "rpcpassword"){
                    var RPCPASS = line.split('=')[3] 
                }
                
            
                if(line.split('=')[4] == "rpcconnect"){ //note this assumes a certain order in your config file, tx=1 and server=1 should come last
                        RPCHOST=line.split('=')[5]      //if you config has no such specifications i.e. you are just using localhost, this is optional
                }                                      
                
                if(line.split('=')[6] == "rpcport"){
                     RPCPORT=line.split('=')[7].strip()
                }
                       
                if(line.split('=')[8] == "rpcssl" && line.split('=')[9] == "1"){
                            RPCSSL=true
                }else{RPCSSL=false}

        if(RPCSSL == true){
            client._url = "https://"+RPCUSER+":"+RPCPASS+"@"+RPCHOST+":"+RPCPORT
        }else{
            client._url = "http://"+RPCUSER+":"+RPCPASS+"@"+RPCHOST+":"+RPCPORT
        }
        client._headers = {'content-type': 'application/json'}
        
        return client
                
            } 

function call(rpcMethod, params){
        var payload = JSON.parse(params)
        var tries = 10
        var hadConnectionFailures = False
        if(tries >0){
            
            try{
                response = host.invoke(rpcMethod, payload)
                if(response = err){throw err}
            }
            catch(err){
                console.log(err) //requests.exceptions.ConnectionError
                tries -= 1
            }
        }
                
        /*if(tries == 0){
            console.log('Failed to connect for remote procedure call.')
            hadFailedConnections = true
            console.log("Couldn't connect for remote procedure call, will sleep for ten seconds and then try again ({} more tries)".format(tries))
            setTimeout(function(){})
        
        }else if(hadConnectionFailures == true
                    console.log('Connected for remote procedure call after retry.')
        }
        if{response.status_code in (200, 500):
            raise Exception('RPC connection failure: ' + str(response.status_code) + ' ' + response.reason)
        responseJSON = response.json()
        if 'error' in responseJSON and responseJSON['error'] != None:
            raise Exception('Error in ' + rpcMethod + ' RPC call: ' + str(responseJSON['error']))
        #return responseJSON['result']
        return responseJSON*/ 
        //sophisticated error management code can be ported later
}

//Define / Create RPC connection
host=omniRPC.init

//Bitcoin Generic RPC calls
omniRPC.getinfo =function(){
    return host.call("getinfo")
}
omniRPC.getrawtransaction = function(txid){
    return host.call("getrawtransaction", txid , 1)
}

omniRPC.getblockhash = function(block){
    return host.call("getblockhash", block)
}
 
omniRPC.getblock = function(hash){
    return host.call("getblock", hash)   
}

omniRPC.getblock = function(tx){
    try{
      return host.call("sendrawtransaction", tx)
    }catch(e){
      return e
    }
}

omniRPC.validateaddress = function(addr){
    return host.call("validateaddress", addr)
}

omniRPC.createrawtransaction = function(ins,outs){
    return host.call("createrawtransaction",ins,outs)
}

omniRPC.decoderawtransaction = function(rawtx){
    return host.call("decoderawtransaction", rawtx)
}

// Omnilayer Specific RPC calls
omniRPC.getbalance_layer = function(addr, propertyid){
    return host.call("getbalance_MP", addr, propertid)
}

omniRPC.getallbalancesforaddress_layer = function(addr){
    return host.call("getallbalancesforaddress_MP", addr)
}
    
omniRPC.getallbalancesforid_layer = function(propertyid){
    return host.call("getallbalancesforid_MP", propertyid)
}

omniRPC.gettransaction_layer = function(tx){
    return host.call("gettransaction_MP", tx)
}

omniRPC.listblocktransactions_layer = function(height){
    return host.call("listblocktransactions_MP", height)
}

omniRPC.getproperty_layer= function(propertyid){
    return host.call("getproperty_MP", propertyid)
}

omniRPC.listproperties_MP=function(){
    return host.call("listproperties_MP")
}

omniRPC.getcrowdsale_MP=function(propertyid){
    return host.call("getcrowdsale_MP", propertyid)
}

omniRPC.getactivecrowdsales_layer=function(){
    return host.call("getactivecrowdsales_MP")
}

omniRPC.getactivedexsells_MP=function(){
    return host.call("getactivedexsells_MP")
}

omniRPC.getdivisible_layer = function(propertyid){
    return getproperty_layer(propertyid)['result']['divisible']
}

omniRPC.getgrants_layer = function(propertyid){
    return host.call("getgrants_MP", propertyid)
}
    
exports.omniRPC = omniRPC
var Omni = require('./lib/OmniRPC.js').Omni
var fs = require('fs')

var configurationFile = 'configuration.json';
var configuration = JSON.parse(
    fs.readFileSync(configurationFile)
);

var account;
var balances = [];

var address = "n4Po8andi3akpQBxzBWXbQBttF9LueXqyo";

var ids = [];

var account = 0;

var quickClient = Omni.init(configuration.rpcuser, configuration.rpcpassword, null, true);

Omni.listaccounts(function(accounts) {
    console.log("accounts: %j", accounts)
    account = accounts[0]
});

Omni.getallbalancesforaddress(address,function(data) {
  balances = data
  //console.log(balances)
  for (var i=2; i<data.length; i++)  {
    ids.push(balances[i]['propertyid'])
  }
  console.log("ids: %j", ids)
});

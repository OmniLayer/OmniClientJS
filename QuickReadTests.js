'use strict';

var OmniClient = require('./lib/OmniClient.js').OmniClient;
var fs = require('fs');

var configurationFile = 'configuration.json';
var configuration = JSON.parse(
    fs.readFileSync(configurationFile)
);

var address = OmniClient.testNet.exodusAddress;
var ids = [];
var account;

var client = new OmniClient({host:'localhost',
                          port:18332,
                          user: configuration.rpcuser,
                          pass: configuration.rpcpassword});


client.getBlockchainInfo()
  .then( () => {
    console.log("about to list accounts");
    return client.listAccounts();
  })
  .then( accounts => {
    console.log("== accounts:\n", accounts);
    account = accounts['']; // Default account
    console.log("== account %j",account);
    console.log("== address: %s", address);
    return client.omniGetAllBalancesForAddress(address);
  })
  .then( balances => {
    console.log("== balances for %s: %j\n", address, balances);
    for (var i=0; i<balances.length; i++)  {
      ids.push(balances[i]['propertyid'])
    }
    console.log("== ids:\n", ids);
  })
  .catch( err => {
    console.log( err ) ;
  });

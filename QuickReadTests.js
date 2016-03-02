'use strict';

var OmniClient = require('./lib/OmniClient.js').OmniClient;
var fs = require('fs');

var configurationFile = 'configuration.json';
var configuration = JSON.parse(
    fs.readFileSync(configurationFile)
);

//var balances = [];
var address = "n4Po8andi3akpQBxzBWXbQBttF9LueXqyo";
var ids = [];
var account;

var client = new OmniClient({host:'localhost',
                          port:18332,
                          user: configuration.rpcuser,
                          pass: configuration.rpcpassword});

client.listAccounts()
  .then(function(accounts) {
    console.log("== accounts:\n", accounts);
    account = accounts[0];
    return client.omniGetAllBalancesForAddress(address);
  })
  .then(function(balances) {
    console.log("== balances for %s:\n", address, balances);
    for (var i=2; i<balances.length; i++)  {
      ids.push(balances[i]['propertyid'])
    }
    console.log("== ids:\n", ids);
  })
  .catch( function(err){
    console.log( err ) ;
  });

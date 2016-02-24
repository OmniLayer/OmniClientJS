'use strict';

var OmniClient = require('./lib/OmniRPC.js').OmniClient;
var fs = require('fs');

var configurationFile = 'configuration.json';
var configuration = JSON.parse(
    fs.readFileSync(configurationFile)
);

//var balances = [];
var address = "n4Po8andi3akpQBxzBWXbQBttF9LueXqyo";
var ids = [];
var account = 0;

var omni = new OmniClient({host:'localhost',
                          port:18332,
                          user: configuration.rpcuser,
                          pass: configuration.rpcpassword});

omni.listAccounts()
  .then(function(accounts) {
    console.log("accounts %O:\n", accounts);
    account = accounts[0];
    return omni.omniGetAllBalancesForAddress(address);
  })
  .then(function(balances) {
    console.log("balances for %s %O:\n", address, balances);
    for (var i=2; i<balances.length; i++)  {
      ids.push(balances[i]['propertyid'])
    }
    console.log("ids %O:\n", ids);
  })
  .catch( function(err){
    console.log( err ) ;
  });

/**
 * RegTest demo script to be run from project root:
 * # node demos/RegTestDemo.js
 */
'use strict';

var OmniClient = require('../lib/OmniClient.js').OmniClient;
var OmniTestEnvironment = require('../lib/OmniTestEnvironment.js').OmniTestEnvironment;
var fs = require('fs');

var configurationFile = 'configuration.json';
var configuration = JSON.parse(
  fs.readFileSync(configurationFile)
);

console.log("Init client");
var client = new OmniClient({host:'localhost',
  port:18332,
  user: configuration.rpcuser,
  pass: configuration.rpcpassword});

console.log("Init test env");
var testEnv = new OmniTestEnvironment(client);
testEnv.initRegTest();


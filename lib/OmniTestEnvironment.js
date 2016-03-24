/**
 * Omni Layer preliminary Test Environment support
 * requires Node.js 4.2 or later.
 *
 * @author Sean Gilligan
 */
'use strict';
var OmniClient = require('./OmniClient.js').OmniClient;

class OmniTestEnvironment {

  /**
   * Create a test environment
   * @param client an OmniClient instance
   */
  constructor(client) {
    this.client = client;
  }

  /**
   * Setup for RegTest mode operation
   * Mine some BTC
   * Send BTC to moneyManAddress to get some Omni
   * @returns {Promise.<T>} A promise for getBlockchainInfo result
   */
  initRegTest() {
    // Create a chain of RPC calls to setup a regTest environment for testing
    // First getBlockchainInfo to make sure server is in RegTest mode
    return this.client.getBlockchainInfo()
      .then(chainInfo => {
        if (chainInfo.chain != "regtest") {
          throw new Error("Server not in RegTest mode");
        }
        let blocks = (chainInfo.blocks < 110) ? 110 - chainInfo.blocks : 1;
        return this.client.setGenerate(true, blocks);
      })
      .then(blocks => {
        console.log("== generated %d blocks\n", blocks.length);
        return this.client.sendToAddress(OmniClient.regTestNet.moneyManAddress, 10);
      })
      .then(txid => {
        console.log("== send to moneyMan txid: %j\n", txid);
        return this.client.setGenerate(true, 1);
      })
      .then(blocks => {
        console.log("== generated %d blocks\n", blocks.length);
        return this.client.omniGetAllBalancesForId(1);
      })
      .then(balances => {
        console.log("== Omni balances for id=1:\n");
        balances.forEach(balance => {
          console.log("%s: %d", balance.address, balance.balance);
        });
        return this.client.getBlockchainInfo();
      })
      .catch(error => {
        console.log("** Error: %j", error);
      })

  }

}

exports.OmniTestEnvironment = OmniTestEnvironment;

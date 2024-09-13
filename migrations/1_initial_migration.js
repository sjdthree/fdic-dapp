// migrations/1_initial_migration.js
const OnChainFDIC = artifacts.require("OnChainFDIC");

module.exports = function (deployer) {
  deployer.deploy(OnChainFDIC);
};
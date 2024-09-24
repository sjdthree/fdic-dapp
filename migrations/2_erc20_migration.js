// migrations/1_initial_migration.js
const USDCERC20 = artifacts.require("USDCERC20");

module.exports = function(deployer) {
  deployer.deploy(USDCERC20);
};

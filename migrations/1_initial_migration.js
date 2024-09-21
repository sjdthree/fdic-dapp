// migrations/1_initial_migration.js
const ERC20FDIC = artifacts.require("ERC20FDIC");

module.exports = function (deployer) {
  deployer.deploy(ERC20FDIC);
};

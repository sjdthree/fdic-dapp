const HDWalletProvider = require("@truffle/hdwallet-provider");
const Web3 = require("web3");

const provider = new HDWalletProvider({
  privateKeys: [
    "16c7e51c3b677265cb5795ef60ec1bab8460fb5df5d308f0147beafbbcb2d870",
  ], // Use an array if you want to use multiple private keys
  providerOrUrl: "https://rpc-amoy.polygon.technology/", // Replace with the RPC URL of the network
});

module.exports = {
  networks: {
    amoy: {
      provider: () => provider,
      network_id: "80002", // Replace with the Amoy network ID
      gas: 2000000,
      gasPrice: Web3.utils.toWei("30", "gwei"),
    },
  },
  compilers: {
    solc: {
      version: "0.8.20", // Specify your Solidity version
    },
  },
};

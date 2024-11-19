require('dotenv').config();
const HDWalletProvider = require("@truffle/hdwallet-provider");
const Web3 = require("web3");

const infuraID = process.env.VITE_INFURA_PROJECT_ID;

const provider = new HDWalletProvider({
  privateKeys: [
    "16c7e51c3b677265cb5795ef60ec1bab8460fb5df5d308f0147beafbbcb2d870",
  ],
  providerOrUrl: `https://sepolia.infura.io/v3/${infuraID}`,
});

module.exports = {
  networks: {
    amoy: {
      provider: () => provider,
      network_id: "11155111", // Sepolia network ID
      gas: 20000000,
      gasPrice: Web3.utils.toWei("35", "gwei"),
    },
  },
  compilers: {
    solc: {
      version: "0.8.20", // Specify your Solidity version
    },
  },
};

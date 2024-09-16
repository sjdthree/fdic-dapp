const infuraID = import.meta.env.VITE_INFURA_PROJECT_ID;

if (!infuraID) {
  console.error("Infura Project ID is not defined. Make sure VITE_INFURA_PROJECT_ID is set in your .env file.");
}

console.log("Infura ID:", infuraID);

export const chainConfig = {
  // EthereumMainnet: {
  //   chainNamespace: "eip155",
  //   chainId: "0x1", // Ethereum Mainnet
  //   rpcTarget: `https://mainnet.infura.io/v3/${infuraID}`, // Infura RPC
  //   displayName: "Ethereum Mainnet",
  //   blockExplorerUrl: "https://etherscan.io",
  //   ticker: "ETH",
  //   tickerName: "Ethereum",
  // },
  // EthereumGoerli: {
  //   chainNamespace: "eip155",
  //   chainId: "0x5", // Goerli Testnet
  //   rpcTarget: `https://goerli.infura.io/v3/${infuraID}`, // Infura RPC
  //   displayName: "Goerli Testnet",
  //   blockExplorerUrl: "https://goerli.etherscan.io",
  //   ticker: "ETH",
  //   tickerName: "Ethereum",
  // },
  EthereumSepolia: {
    chainNamespace: "eip155",
    chainId: "0xaa36a7", // Sepolia Testnet
    rpcTarget: "https://rpc.sepolia.org",
    displayName: "Sepolia Testnet",
    blockExplorerUrl: "https://sepolia.etherscan.io",
    ticker: "ETH",
    tickerName: "Ethereum",
  },
  PolygonMainnet: {
    chainNamespace: "eip155",
    chainId: "0x89", // Polygon Mainnet
    rpcTarget: "https://polygon-rpc.com/",
    displayName: "Polygon Mainnet",
    blockExplorerUrl: "https://polygonscan.com",
    ticker: "MATIC",
    tickerName: "Polygon",
  },
  PolygonMumbai: {
    chainNamespace: "eip155",
    chainId: "0x13881", // Polygon Mumbai Testnet
    rpcTarget: "https://rpc-mumbai.maticvigil.com/",
    displayName: "Polygon Mumbai Testnet",
    blockExplorerUrl: "https://mumbai.polygonscan.com",
    ticker: "MATIC",
    tickerName: "Polygon",
  },
  GanacheLocal: {
    chainNamespace: "eip155",
    chainId: "0x539", // Ganache (1337 in decimal)
    rpcTarget: "http://127.0.0.1:8545",
    displayName: "Ganache Local",
    blockExplorerUrl: "http://127.0.0.1:8545",
    ticker: "ETH",
    tickerName: "Ethereum",
  }
};
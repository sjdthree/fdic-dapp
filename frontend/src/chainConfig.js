const infuraID = import.meta.env.VITE_INFURA_PROJECT_ID;

if (!infuraID) {
  console.error("Infura Project ID is not defined. Make sure VITE_INFURA_PROJECT_ID is set in your .env file.");
}


export const chainConfig = {
  Ethereum: {
    chainNamespace: "eip155",
    chainId: "0x1", // Ethereum Mainnet
    rpcTarget: `https://mainnet.infura.io/v3/${infuraID}`, // Infura RPC
    displayName: "Ethereum Mainnet",
    blockExplorerUrl: "https://etherscan.io",
    ticker: "ETH",
    tickerName: "Ethereum",
  },
  // EthereumGoerli: {
  //   chainNamespace: "eip155",
  //   chainId: "0x5", // Goerli Testnet
  //   rpcTarget: `https://goerli.infura.io/v3/${infuraID}`, // Infura RPC
  //   displayName: "Goerli Testnet",
  //   blockExplorerUrl: "https://goerli.etherscan.io",
  //   ticker: "ETH",
  //   tickerName: "Ethereum",
  // },
  PolygonZKevm_test: {
    chainNamespace: "eip155",
    chainId: "0x5a2", // Polygon zkEVM Testnet Chain ID
    rpcTarget: "https://rpc.public.zkevm-test.net", // RPC URL 
    displayName: "Polygon zkEVM Testnet", // Display name for the network
    blockExplorer: "https://testnet-zkevm.polygonscan.com/", // Block Explorer URL
    ticker: "ETH", // Currency symbol
    tickerName: "Ethereum" // Currency name
  },
  PolygonAmoy: {
    chainNamespace: "eip155",
    chainId: "0x13882", // hex of 80002, polygon testnet
    rpcTarget: "https://rpc.ankr.com/polygon_amoy",
    // Avoid using public rpcTarget in production.
    // Use services like Infura, Quicknode etc
    displayName: "Polygon Amoy Testnet",
    blockExplorerUrl: "https://amoy.polygonscan.com/",
    ticker: "MATIC",
    tickerName: "MATIC",
    logo: "https://cryptologos.cc/logos/polygon-matic-logo.png",
  },
  Polygon: {
    chainNamespace: "eip155",
    chainId: "0x89", // hex of 137, polygon mainnet
    rpcTarget: "https://rpc.ankr.com/polygon",
    // Avoid using public rpcTarget in production.
    // Use services like Infura, Quicknode etc
    displayName: "Polygon Mainnet",
    blockExplorerUrl: "https://polygonscan.com",
    ticker: "MATIC",
    tickerName: "MATIC",
    logo: "https://cryptologos.cc/logos/polygon-matic-logo.png",
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
  Ganache: {
    chainNamespace: "eip155",
    chainId: "0x539", // Ganache (1337 in decimal)
    rpcTarget: "http://127.0.0.1:8545",
    displayName: "Ganache Local",
    blockExplorerUrl: "http://127.0.0.1:8545",
    ticker: "ETH",
    tickerName: "Ethereum",
  }
};
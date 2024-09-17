// src/BlockchainProvider.jsx
import React, { createContext, useState, useEffect } from "react";
import { CHAIN_NAMESPACES } from "@web3auth/base";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
import { Web3Auth } from "@web3auth/modal";
// import { chainConfig } from './chainConfig'; // Import the chainConfig
import { OpenloginAdapter } from "@web3auth/openlogin-adapter";
import { ethers } from "ethers";

export const BlockchainContext = createContext();

const clientId = import.meta.env.VITE_WEB3AUTH_CLIENT_ID; // Your Web3Auth Client ID from the dashboard
console.log("Client ID:", clientId);

const chainConfig = {
  chainNamespace: CHAIN_NAMESPACES.EIP155,
  chainId: "0x13882", // hex of 80002, polygon testnet
  rpcTarget: "https://rpc.ankr.com/polygon_amoy",
  // Avoid using public rpcTarget in production.
  // Use services like Infura, Quicknode etc
  displayName: "Polygon Amoy Testnet",
  blockExplorerUrl: "https://amoy.polygonscan.com/",
  ticker: "MATIC",
  tickerName: "MATIC",
  logo: "https://cryptologos.cc/logos/polygon-matic-logo.png",
};

export const BlockchainProvider = ({ children }) => {
  const [provider, setProvider] = useState(null);
  const [web3auth, setWeb3Auth] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const initWeb3Auth = async () => {
      try {
        const privateKeyProvider = new EthereumPrivateKeyProvider({
          config: { chainConfig: chainConfig },
        });

        const web3auth = new Web3Auth({
          clientId,
          web3AuthNetwork: "sapphire_devnet",
          privateKeyProvider,
        });

        const openloginAdapter = new OpenloginAdapter({
          adapterSettings: {
            uxMode: "popup",
            loginSettings: {
              mfaLevel: "optional",  // Modify this as necessary
           },
          },
        });

        web3auth.configureAdapter(openloginAdapter);
        await web3auth.initModal();

        if (web3auth.connected) {
          const ethersProvider = new ethers.BrowserProvider(web3auth.provider);
          setProvider(ethersProvider);
        }

        setWeb3Auth(web3auth);
        setIsLoading(false);
      } catch (error) {
        console.error("Error initializing Web3Auth:", error);
        setIsLoading(false);
      }
    };

    initWeb3Auth();
  }, []);

  const login = async () => {
    if (!web3auth) {
      console.log("Web3Auth not initialized");
      return;
    }

    try {
      const web3authProvider = await web3auth.connect(); // Initiates Web3Auth modal for login
      const ethersProvider = new ethers.BrowserProvider(web3auth.provider);
      setProvider(ethersProvider);
      setLoggedIn(true);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const logout = async () => {
    if (!web3auth) {
      console.log("Web3Auth not initialized");
      return;
    }

    try {
      await web3auth.logout();
      setProvider(null);
      setLoggedIn(false);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <BlockchainContext.Provider
      value={{
        provider,
        loggedIn,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </BlockchainContext.Provider>
  );
};
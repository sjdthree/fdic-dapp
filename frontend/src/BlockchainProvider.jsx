// src/BlockchainProvider.jsx
import React, { createContext, useState, useEffect } from "react";
import { CHAIN_NAMESPACES } from "@web3auth/base";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
import { Web3Auth } from "@web3auth/modal";
import { OpenloginAdapter } from "@web3auth/openlogin-adapter";
import { ethers } from "ethers";

export const BlockchainContext = createContext();

const clientId = import.meta.env.VITE_WEB3AUTH_CLIENT_ID; // Your Web3Auth Client ID from the dashboard
const infuraID = import.meta.env.VITE_INFURA_PROJECT_ID;

const chainConfig = {
  chainNamespace: CHAIN_NAMESPACES.EIP155,
  chainId: "0x13882", // hex of 80002, polygon testnet
  rpcTarget: `https://polygon-amoy.infura.io/v3/${infuraID}`,
  displayName: "Polygon Amoy Testnet",
  blockExplorerUrl: "https://amoy.polygonscan.com/",
  ticker: "MATIC",
  tickerName: "MATIC",
  logo: "https://cryptologos.cc/logos/polygon-matic-logo.png",
};

export const BlockchainProvider = ({ children }) => {
  const [provider, setProvider] = useState(null);
  const [account, setAccount] = useState(''); 
  const [web3auth, setWeb3Auth] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState(null); // State to store user info

  useEffect(() => {
    const initWeb3Auth = async () => {
      try {
        console.log("Initializing Web3Auth...");
        const privateKeyProvider = new EthereumPrivateKeyProvider({
          config: { chainConfig: chainConfig },
        });

        const web3auth = new Web3Auth({
          clientId,
          web3AuthNetwork: "sapphire_devnet",
          privateKeyProvider,
          uxMode: "popup",
          uiConfig: {
            theme: "dark", 
            loginMethodsOrder: ["google", "reddit", "facebook"],
          },
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
        setWeb3Auth(web3auth);

        if (web3auth.connected) {
          console.log("Web3Auth is connected");
          const ethersProvider = new ethers.BrowserProvider(web3auth.provider);
          setProvider(ethersProvider);
          const signer = await ethersProvider.getSigner();
          const address = await signer.getAddress();  // Fetch the account address
          setAccount(address);  // Set the account in state

          const user = await web3auth.getUserInfo(); // Get user info after login
          setUserInfo(user); // Store user info in state
          setLoggedIn(true);
          console.log("User info:", user);
        } else {
          console.log("Web3Auth not connected");
        }

        setIsLoading(false);
      } catch (error) {
        console.error("Error initializing Web3Auth:", error);
        setIsLoading(false);
      }
    };

    initWeb3Auth();
  }, []);

  const login = async () => {
    try {
      console.log("Attempting to login...");
      const web3authProvider = await web3auth.connect(); // Initiates Web3Auth modal for login
      const ethersProvider = new ethers.BrowserProvider(web3auth.provider);
      setProvider(ethersProvider);
      const signer = await ethersProvider.getSigner();
      const address = await signer.getAddress();  // Fetch the account address
      setAccount(address);  // Set the account
      setLoggedIn(true);
      const user = await web3auth.getUserInfo();
      setUserInfo(user);
      console.log("Login successful. User info:", user);
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
      console.log("Logging out...");
      await web3auth.logout();
      setProvider(null);
      setAccount('');  // Reset the account
      setLoggedIn(false);
      console.log("Logout successful.");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <BlockchainContext.Provider
      value={{
        provider,
        account,
        loggedIn,
        userInfo,
        isLoading,
        login,
        logout,
      }}
    >
      {!isLoading ? children : <p>Loading blockchain info...</p>}
    </BlockchainContext.Provider>
  );
};
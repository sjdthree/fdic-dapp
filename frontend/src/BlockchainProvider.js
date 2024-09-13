// src/BlockchainProvider.js
import React, { createContext, useState, useEffect } from 'react';
import { BrowserProvider } from 'ethers';



export const BlockchainContext = createContext();

export const BlockchainProvider = ({ children }) => {
  const [provider, setProvider] = useState(null);

  useEffect(() => {
    const initProvider = async () => {
      if (window.ethereum) {
        const ethProvider = new BrowserProvider(window.ethereum);
        try {
          await window.ethereum.request({ method: 'eth_requestAccounts' });
          setProvider(ethProvider);
        } catch (error) {
          console.error('User denied account access');
        }
      } else {
        console.error('Please install MetaMask!');
      }
    };
    initProvider();
  }, []);

  return (
    <BlockchainContext.Provider value={{ provider }}>
      {children}
    </BlockchainContext.Provider>
  );
};
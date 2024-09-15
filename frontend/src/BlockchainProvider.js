// src/BlockchainProvider.js
import React, { createContext, useState, useEffect } from 'react';
import { Web3Auth } from '@web3auth/modal';
import { OpenloginAdapter } from '@web3auth/openlogin-adapter';
import { CHAIN_NAMESPACES } from '@web3auth/base';
import { ethers } from 'ethers';

export const BlockchainContext = createContext();

// src/BlockchainProvider.js

// const clientId = process.env.REACT_APP_WEB3AUTH_CLIENT_ID;
const infuraProjectId = process.env.REACT_APP_INFURA_PROJECT_ID;

// Use these variables where needed

export const BlockchainProvider = ({ children }) => {
  const [provider, setProvider] = useState(null);
  const [web3auth, setWeb3auth] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedChain, setSelectedChain] = useState('Ethereum');

  const chainConfigs = {
    Ethereum: {
      chainNamespace: CHAIN_NAMESPACES.EIP155,
      chainId: '0x1',
      rpcTarget:`https://mainnet.infura.io/v3/${infuraProjectId}`,
      displayName: 'Ethereum Mainnet',
    },
    Polygon: {
      chainNamespace: CHAIN_NAMESPACES.EIP155,
      chainId: '0x89',
      rpcTarget: 'https://polygon-rpc.com/',
      displayName: 'Polygon (Matic)',
    },
    BinanceSmartChain: {
      chainNamespace: CHAIN_NAMESPACES.EIP155,
      chainId: '0x38',
      rpcTarget: 'https://bsc-dataseed.binance.org/',
      displayName: 'Binance Smart Chain',
    },
    Ganache: {
      chainNamespace: CHAIN_NAMESPACES.EIP155,
      chainId: '0x539', // 1337 in decimal
      rpcTarget: 'http://127.0.0.1:8545',
      displayName: 'Localhost 8545 (Ganache)',
    },
    // Add more chains as needed
  };

  const handleChainChange = (event) => {
    setSelectedChain(event.target.value);
  };

  useEffect(() => {
    const initProvider = async () => {
      setIsLoading(true);
      if (selectedChain === 'Ganache') {
        // Directly connect to Ganache
        try {
          const ethersProvider = new ethers.JsonRpcProvider('http://127.0.0.1:8545');
          setProvider(ethersProvider);
        } catch (error) {
          console.error('Error connecting to Ganache:', error);
        } finally {
          setIsLoading(false);
        }
      } else {
        // Initialize Web3Auth
        try {
          const clientId = process.env.REACT_APP_WEB3AUTH_CLIENT_ID;

          const chainConfig = chainConfigs[selectedChain];

          const web3auth = new Web3Auth({
            clientId,
            chainConfig,
            uiConfig: {
              theme: 'dark',
              loginMethodsOrder: [
                'google',
                'facebook',
                'twitter',
                'discord',
                'github',
                'email_passwordless',
              ],
            },
          });

          // Initialize Openlogin Adapter
          const openloginAdapter = new OpenloginAdapter({
            adapterSettings: {
              network: 'testnet', // Use 'mainnet' in production
            },
          });

          web3auth.configureAdapter(openloginAdapter);

          setWeb3auth(web3auth);

          await web3auth.initModal();

          if (web3auth.provider) {
            const ethersProvider = new ethers.BrowserProvider(web3auth.provider);
            setProvider(ethersProvider);
          } else {
            setProvider(null);
          }
        } catch (error) {
          console.error('Error initializing Web3Auth:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    initProvider();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedChain]);

  const login = async () => {
    if (selectedChain === 'Ganache') {
      // No login required for Ganache
      return;
    }
    if (!web3auth) {
      console.log('Web3Auth not initialized yet');
      return;
    }
    try {
      const web3authProvider = await web3auth.connect();
      const ethersProvider = new ethers.BrowserProvider(web3authProvider);
      setProvider(ethersProvider);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const logout = async () => {
    if (selectedChain === 'Ganache') {
      setProvider(null);
      return;
    }
    if (!web3auth) {
      console.log('Web3Auth not initialized yet');
      return;
    }
    try {
      await web3auth.logout();
      setProvider(null);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <BlockchainContext.Provider
      value={{
        provider,
        login,
        logout,
        isLoading,
        selectedChain,
        handleChainChange,
      }}
    >
      {children}
    </BlockchainContext.Provider>
  );
};
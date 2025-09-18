import React, { createContext, useState, useEffect } from "react";
import { DynamicContextProvider } from "@dynamic-labs/sdk-react-core";
import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";
import { ethers } from "ethers";
import { toast } from "react-toastify";

export const BlockchainContext = createContext();

const DYNAMIC_ENV_ID = import.meta.env.VITE_DYNAMIC_ID;
const INFURA_PROJECT_ID = import.meta.env.VITE_INFURA_PROJECT_ID;

if (!DYNAMIC_ENV_ID) {
  throw new Error('VITE_DYNAMIC_ID environment variable is not set');
}

if (!INFURA_PROJECT_ID) {
  throw new Error('VITE_INFURA_PROJECT_ID environment variable is not set');
}

const SEPOLIA_CHAIN_ID = 11155111;

export const BlockchainProvider = ({ children }) => {
  const [account, setAccount] = useState(''); 
  const [isLoading, setIsLoading] = useState(true);
  const [chainId, setChainId] = useState(SEPOLIA_CHAIN_ID);

  // Set initial loading state to false after a short delay
  useEffect(() => {
    console.log("BlockchainProvider initialized");
    const timer = setTimeout(() => {
      setIsLoading(false);
      console.log("Initial loading complete");
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleWalletDisconnected = () => {
    console.log("Disconnecting wallet");
    setAccount('');
    setChainId(SEPOLIA_CHAIN_ID);
    toast.info('Wallet disconnected');
    console.log("Wallet disconnected");
  };

  return (
    <DynamicContextProvider
      settings={{
        environmentId: DYNAMIC_ENV_ID,
        walletConnectors: [EthereumWalletConnectors],
        evmNetworks: [{
          chainId: SEPOLIA_CHAIN_ID,
          name: 'Sepolia',
          networkId: SEPOLIA_CHAIN_ID,
          nativeCurrency: {
            name: 'ETH',
            symbol: 'ETH',
            decimals: 18,
          },
          rpcUrls: [`https://sepolia.infura.io/v3/${INFURA_PROJECT_ID}`],
          blockExplorerUrls: ['https://sepolia.etherscan.io'],
        }],
        handlers: {
          handleConnectedWallet: async ({ user, wallets, primaryWallet }) => {
            console.log("handleConnectedWallet called with:", { user, wallets, primaryWallet });

            if (!primaryWallet) {
              // If no primary wallet, prompt the user to connect
              toast.warning('Please connect your wallet.');
              return;
            }

            // Ensure we are on the correct chain (Sepolia)
            if (primaryWallet.chainId !== SEPOLIA_CHAIN_ID) {
              try {
                await primaryWallet.evmSwitchChain(SEPOLIA_CHAIN_ID);
              } catch (error) {
                console.error("Failed to switch to Sepolia:", error);
                toast.warning('Please switch to the Sepolia network in your wallet.');
                return;
              }
            }

            // Get provider and signer
            const ethersProvider = new ethers.BrowserProvider(primaryWallet.connector);
            const signer = await ethersProvider.getSigner();
            const address = await signer.getAddress();

            setAccount(address);
            setChainId(primaryWallet.chainId || SEPOLIA_CHAIN_ID);
            toast.success('Wallet connected successfully');
            console.log("Wallet setup complete. Address:", address, "Chain ID:", primaryWallet.chainId);
          },
        },
        eventsCallbacks: {
          onAuthFlowOpen: () => {
            console.log("Auth flow opened");
          },
          onAuthFlowClose: () => {
            console.log("Auth flow closed");
          },
          onUserDisconnect: handleWalletDisconnected,
          onError: (error) => {
            console.error("Dynamic SDK Error:", error);
            toast.error(error.message || 'An error occurred with the wallet connection');
          }
        }
      }}
    >
      <BlockchainContext.Provider
        value={{
          account,
          isLoading,
          chainId,
        }}
      >
        {!isLoading ? children : <p>Loading blockchain info...</p>}
      </BlockchainContext.Provider>
    </DynamicContextProvider>
  );
};
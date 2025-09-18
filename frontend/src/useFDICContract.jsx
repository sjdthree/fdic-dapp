// src/useFDICContract.js
import { useEffect, useState, useMemo } from 'react';
import { ethers } from 'ethers';
import ERC20FDIC from './abis/ERC20FDIC.json';
import { useDynamicContext, useIsLoggedIn } from '@dynamic-labs/sdk-react-core';

const fdicContractAddress = import.meta.env.VITE_FDIC_CONTRACT_ADDRESS;

export const useFDICContract = () => {
  const { primaryWallet } = useDynamicContext();
  const isLoggedIn = useIsLoggedIn();
  const [fdicContract, setFdicContract] = useState(null);

  const contractAddresses = useMemo(
    () => ({
      Ethereum: '0xYourEthereumContractAddress',
      Polygon: '0xYourPolygonContractAddress',
      Sepolia: fdicContractAddress,
      Ganache: '0x596a58959872f44d4ad96CAa9443BB7217ba73A1',
    }),
    []
  );

  useEffect(() => {
    const initContract = async () => {
      if (primaryWallet && isLoggedIn) {
        try {
          // Get the wallet client 
          const walletClient = await primaryWallet.getWalletClient();
          console.log('Wallet Client:', walletClient);
          const signer = await walletClient.getSigner;

          // For now, we're defaulting to Sepolia
          const activeChain = 'Sepolia';
          const contractAddress = contractAddresses[activeChain];

          if (!contractAddress) {
            console.error(`Contract address not found for ${activeChain}`);
            return;
          }

          // Check if we're on the correct network
          const network = await primaryWallet.getNetwork();
          const SEPOLIA_CHAIN_ID = 11155111;
          
          if (network.chainId !== SEPOLIA_CHAIN_ID) {
            if (primaryWallet.connector.supportsNetworkSwitching) {
              await primaryWallet.switchNetwork(SEPOLIA_CHAIN_ID);
              // Re-initialize after network switch
              const updatedSigner = await primaryWallet.getSigner;
              const contract = new ethers.Contract(contractAddress, ERC20FDIC.abi, updatedSigner);
              setFdicContract(contract);
            } else {
              console.error('Network switching not supported');
              return;
            }
          } else {
            const contract = new ethers.Contract(contractAddress, ERC20FDIC.abi, signer);
            setFdicContract(contract);
          }

          console.log(`Using contract address: ${contractAddress} for chain: ${activeChain}`);
        } catch (error) {
          console.error('Error initializing contract:', error);
          setFdicContract(null);
        }
      } else {
        setFdicContract(null);
      }
    };
    initContract();
  }, [primaryWallet, isLoggedIn, contractAddresses]);

  return fdicContract;
};

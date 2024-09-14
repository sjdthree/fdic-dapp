// src/useFDICContract.js
import { useContext, useEffect, useState, useMemo } from 'react';
import { BlockchainContext } from './BlockchainProvider';
import OnChainFDIC from './abis/OnChainFDIC.json';
import { Contract } from 'ethers';

export const useFDICContract = () => {
  const { provider, selectedChain } = useContext(BlockchainContext);
  const [fdicContract, setFdicContract] = useState(null);

  const contractAddresses = useMemo (
    () => ({
    Ethereum: '0xYourEthereumContractAddress', // Replace with your contract address on Ethereum
    Polygon: '0xYourPolygonContractAddress',   // Replace with your contract address on Polygon
    BinanceSmartChain: '0xYourBSCContractAddress', // Replace with your contract address on BSC
    Ganache: '0x596a58959872f44d4ad96CAa9443BB7217ba73A1',   // Replace with your Ganache contract address
    // Add more as needed
    }),
    []
  );

  useEffect(() => {
    const initContract = async () => {
      if (provider) {
        try {
          const signer = await provider.getSigner();
          const contractAddress = contractAddresses[selectedChain];
          if (!contractAddress) {
            console.error(`Contract address not found for ${selectedChain}`);
            return;
          }
          const contract = new Contract(contractAddress, OnChainFDIC.abi, signer);
          setFdicContract(contract);
        } catch (error) {
          console.error('Error initializing contract:', error);
        }
      } else {
        setFdicContract(null);
      }
    };
    initContract();
  }, [provider, selectedChain, contractAddresses]);

  return fdicContract;
};
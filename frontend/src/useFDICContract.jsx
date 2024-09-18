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
    PolygonAmoy: '0xe97c2190996c7661657a07bD114844b36A9882c2',
    PolygonZKevm_test: '0xe97c2190996c7661657a07bD114844b36A9882c2',
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
          // Set default chain to "PolygonAmoy" if selectedChain is null or undefined
          const activeChain = selectedChain || 'PolygonAmoy';
          const contractAddress = contractAddresses[activeChain];

          if (!contractAddress) {
            console.error(`Contract address not found for ${activeChain}`);
            return;
          }
          console.log(`Using contract address: ${contractAddress} for chain: ${activeChain}`);
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
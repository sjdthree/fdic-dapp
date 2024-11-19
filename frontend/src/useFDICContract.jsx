// src/useFDICContract.js
import { useContext, useEffect, useState, useMemo } from 'react';
import { BlockchainContext } from './BlockchainProvider';
import ERC20FDIC from './abis/ERC20FDIC.json';
import { Contract } from 'ethers';

const fdicContractAddress = import.meta.env.VITE_FDIC_CONTRACT_ADDRESS;


export const useFDICContract = () => {
  const { provider, selectedChain } = useContext(BlockchainContext);
  const [fdicContract, setFdicContract] = useState(null);

  const contractAddresses = useMemo (
    () => ({
    Ethereum: '0xYourEthereumContractAddress', // Replace with your contract address on Ethereum
    Polygon: '0xYourPolygonContractAddress',   // Replace with your contract address on Polygon
    // PolygonAmoy: fdicContractAddress,
    Sepolia: fdicContractAddress,
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
          const activeChain = selectedChain || 'Sepolia';
          const contractAddress = contractAddresses[activeChain];

          if (!contractAddress) {
            console.error(`Contract address not found for ${activeChain}`);
            return;
          }
          console.log(`Using contract address: ${contractAddress} for chain: ${activeChain}`);
          const contract = new Contract(contractAddress, ERC20FDIC.abi, signer);
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
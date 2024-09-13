import { useContext, useEffect, useState } from 'react';
import { BlockchainContext } from './BlockchainProvider';
import OnChainFDIC from './abis/OnChainFDIC.json';
import { Contract } from 'ethers';

export const useFDICContract = () => {
  const { provider } = useContext(BlockchainContext);
  const [fdicContract, setFdicContract] = useState(null);

  useEffect(() => {
    const initContract = async () => {
      if (provider) {
        try {
          const signer = await provider.getSigner();

          // Replace with your deployed contract address
          const contractAddress = '0x4beA5733707BD460D23ca1065c3065bD4D2EfAEF';

          const contract = new Contract(contractAddress, OnChainFDIC.abi, signer);
          setFdicContract(contract);
        } catch (error) {
          console.error('Error initializing contract:', error);
        }
      }
    };
    initContract();
  }, [provider]);

  return fdicContract;
};
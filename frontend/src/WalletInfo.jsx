import React, { useContext, useState, useEffect } from 'react';
import { BlockchainContext } from './BlockchainProvider';
import { ethers } from 'ethers';
import './WalletInfo.css';

const WalletInfo = () => {
  const { provider } = useContext(BlockchainContext);
  const [account, setAccount] = useState('');
  const [balance, setBalance] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const fetchWalletInfo = async () => {
      if (provider) {
        try {
          const signer = await provider.getSigner();
          const address = await signer.getAddress();
   
          const balanceInWei = await provider.getBalance(address); // Balance in wei

          // Convert balance from wei to Ether
          const balanceInEther = ethers.formatEther(balanceInWei);

          setAccount(address);
          setBalance(parseFloat(balanceInEther).toFixed(4)); // Display up to 4 decimal places

        } catch (error) {
          console.error('Error fetching wallet info:', error);
        }
      }
    };

    fetchWalletInfo();
  }, [provider]);

  return (
    <div className="wallet-dropdown">
      <button onClick={toggleDropdown} className="wallet-dropdown-btn">
        {account ? 'Wallet Info' : 'No Wallet Connected'}
      </button>
      {isOpen && account && (
        <div className="wallet-info-box">
          <p className="wallet-address"><strong>Address:</strong> {account}</p>
          <p className="wallet-balance"><strong>Balance:</strong> {balance} ETH</p>
        </div>
      )}
    </div>
  );
};

export default WalletInfo;
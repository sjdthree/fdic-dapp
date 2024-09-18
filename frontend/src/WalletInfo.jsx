// src/WalletInfo.jsx
import React, { useContext, useEffect, useState } from "react";
import { BlockchainContext } from "./BlockchainProvider";
import { getAccounts, getBalance } from "./web3tools";
import './WalletInfo.css';

const WalletInfo = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { provider, loggedIn, userInfo } = useContext(BlockchainContext);
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  const fetchWalletInfo = async () => {
    if (loggedIn && provider) {
      setIsRefreshing(true);
      const userAccount = await getAccounts(provider);
      const userBalance = await getBalance(provider);
      setAccount(userAccount);
      setBalance(userBalance);
      setIsRefreshing(false);
    }
  };

  // Fetch wallet info when the component mounts
  useEffect(() => {
    fetchWalletInfo();
  }, [provider, loggedIn]);

  if (!loggedIn) {
    return <div>Please log in to view wallet info.</div>;
  }

  return (
    <div className="wallet-info-container">
      <h3>Wallet Information</h3>

      <div className="wallet-info-header" onClick={toggleOpen}>
        <button className="toggle-button">
          {isOpen ? 'Hide User Details' : 'Show User Details'}
        </button>
      </div>

      <div className={`wallet-info-box ${isOpen ? 'open' : 'closed'}`}>
        <pre>{JSON.stringify(userInfo, null, 2)}</pre>

      </div>
      <p>Account: {account} </p>
      <p>Balance: {balance} ETH</p>
      {/* Refresh button to manually fetch updated account and balance */}
      <button onClick={fetchWalletInfo} disabled={isRefreshing}>
        {isRefreshing ? "Refreshing..." : "Refresh Wallet Info"}
      </button>
    </div>
  );
};

export default WalletInfo;
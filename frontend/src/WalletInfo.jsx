// src/WalletInfo.jsx
import React, { useContext, useEffect, useState } from "react";
import { BlockchainContext } from "./BlockchainProvider";
import { getAccounts, getBalance } from "./web3tools";

const WalletInfo = () => {
  const { provider, loggedIn, userInfo } = useContext(BlockchainContext);
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

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
    <div className="wallet-info">
      <h2>User Info</h2>
      <div className="user-info-container">
        <pre>{JSON.stringify(userInfo, null, 2)}</pre>
      </div>
      <p><strong>Account:</strong> {account || "Fetching account..."}</p>
      <p><strong>Balance:</strong> {balance || "Fetching balance..."}</p>

      {/* Refresh button to manually fetch updated account and balance */}
      <button onClick={fetchWalletInfo} disabled={isRefreshing}>
        {isRefreshing ? "Refreshing..." : "Refresh Wallet Info"}
      </button>
    </div>
  );
};

export default WalletInfo;
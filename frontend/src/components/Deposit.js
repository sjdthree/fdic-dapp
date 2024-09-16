// src/components/Deposit.js
import React, { useState } from 'react';
import { useFDICContract } from '../useFDICContract';
import { parseEther, isAddress } from 'ethers';

const Deposit = () => {
  const fdicContract = useFDICContract();
  const [bankAddress, setBankAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!fdicContract) {
    return <div>Please log in to make a deposit.</div>;
  }

  const handleDeposit = async () => {
    if (!bankAddress.trim()) {
      alert('Please enter the bank address.');
      return;
    }
    if (!isAddress(bankAddress)) {
      alert('Please enter a valid Ethereum address for the bank.');
      return;
    }
    if (!amount.trim() || isNaN(amount) || parseFloat(amount) <= 0) {
      alert('Please enter a valid amount.');
      return;
    }
    try {
      setIsLoading(true);
      const tx = await fdicContract.deposit(bankAddress, {
        value: parseEther(amount),
      });
      await tx.wait();
      setIsLoading(false);
      alert('Deposit successful!');
    } catch (error) {
      setIsLoading(false);
      console.error(error);
      alert('An error occurred during the deposit.');
    }
  };

  return (
    <div>
      <h2>Make a Deposit</h2>
      <label>
        Bank Address:
        <input
          type="text"
          placeholder="Bank Address"
          value={bankAddress}
          onChange={(e) => setBankAddress(e.target.value)}
        />
      </label>
      <label>
        Amount in ETH:
        <input
          type="text"
          placeholder="Amount in ETH"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </label>
      <button onClick={handleDeposit} disabled={isLoading}>
        {isLoading ? 'Processing...' : 'Deposit'}
      </button>
    </div>
  );
};

export default Deposit;
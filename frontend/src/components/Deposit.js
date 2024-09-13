// src/components/Deposit.js
import React, { useState } from 'react';
import { useFDICContract } from '../useFDICContract';
import { parseEther } from 'ethers';


const Deposit = () => {
  const fdicContract = useFDICContract();
  const [bankAddress, setBankAddress] = useState('');
  const [amount, setAmount] = useState('');

  const handleDeposit = async () => {
    try {
      const tx = await fdicContract.deposit(bankAddress, { value: parseEther(amount) });
      await tx.wait();
      alert('Deposit successful!');
    } catch (error) {
      console.error(error);
      alert('An error occurred during the deposit.');
    }
  };

  if (!fdicContract) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Make a Deposit</h2>
      <input
        type="text"
        placeholder="Bank Address"
        value={bankAddress}
        onChange={(e) => setBankAddress(e.target.value)}
      />
      <input
        type="text"
        placeholder="Amount in ETH"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <button onClick={handleDeposit}>Deposit</button>
    </div>
  );
};

export default Deposit;
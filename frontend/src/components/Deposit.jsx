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
    <div className="deposit-section">
      <h2>Make a Deposit</h2>
      <p>
        In this section, you can deposit funds into a blockchain bank. Just like 
        depositing money into a real bank account, the amount you enter will be 
        stored in the bank’s smart contract.
      </p>
      <label>
        <strong>Bank Address:</strong>
        <input
          type="text"
          value={bankAddress}
          onChange={(e) => setBankAddress(e.target.value)}
          placeholder="Enter the bank's blockchain address"
        />
        <p>
          The blockchain address of the bank where you want to deposit your 
          funds. Think of this as the bank’s unique identifier on the blockchain.
        </p>
      </label>
      <label>
        <strong>Amount in ETH:</strong>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter amount in ETH"
        />
        <p>
          The amount of Ether (ETH) you wish to deposit. This is equivalent to 
          depositing cash in a traditional bank.
        </p>
      </label>
      <button onClick={handleDeposit}>
        Deposit
      </button>
      <p>
        By clicking "Deposit," the smart contract will securely store the amount 
        in the selected bank.
      </p>
    </div>
  );
}

export default Deposit;
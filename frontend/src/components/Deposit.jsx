// src/components/Deposit.js
import React, { useState } from 'react';
import './Deposit.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoneyCheckAlt } from '@fortawesome/free-solid-svg-icons';

import { useFDICContract } from '../useFDICContract';
import { parseEther, isAddress } from 'ethers';

const Deposit = () => {
  const fdicContract = useFDICContract();
  const [bankAddress, setBankAddress] = useState('');
  const [depositAmount, setDepositAmount] = useState('');

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
    const numericAmount = parseFloat(depositAmount); // Convert to a number

    if (!depositAmount.trim() || isNaN(numericAmount) || numericAmount <= 0) {
      alert('Please enter a valid amount.' + depositAmount);
      return;
    }
    try {
      setIsLoading(true);
      const tx = await fdicContract.deposit(bankAddress, {
        value: parseEther(depositAmount),
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
    <div className="deposit-container">
      <h2><FontAwesomeIcon icon={faMoneyCheckAlt} /> Make a Deposit</h2>
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
      <div className="form-group">
        <label htmlFor="deposit-amount">Deposit Amount (ETH):</label>
        <input
          type="number"
          id="deposit-amount"
          value={depositAmount}
          onChange={(e) => setDepositAmount(e.target.value)}
          placeholder="Enter deposit amount"
        />
      </div>
      <button className="deposit-button" onClick={handleDeposit}>
        Deposit Funds
      </button>
      <p>
        By clicking "Deposit," the smart contract will securely store the amount 
        in the selected bank.
      </p>
    </div>
  );

}

export default Deposit;
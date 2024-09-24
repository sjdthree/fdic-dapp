// src/components/Deposit.js
import React, { useState, useContext } from 'react';
import './Deposit.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoneyCheckAlt } from '@fortawesome/free-solid-svg-icons';

import { useFDICContract } from '../useFDICContract';
import { parseEther, isAddress, ethers } from 'ethers';
import { BlockchainContext } from '../BlockchainProvider';
import ERC20FDIC from '../abis/ERC20FDIC.json';
import USDCERC20 from '../abis/USDCERC20.json';

const defaultBankAddress = import.meta.env.VITE_DEFAULT_BANK_ADDRESS;
const defaultTokenAddress = import.meta.env.VITE_DEFAULT_TOKEN_ADDRESS;

const Deposit = () => {
  const fdicContract = useFDICContract();
  const { provider } = useContext(BlockchainContext);
  const [bankAddress, setBankAddress] = useState('');
  const [depositAmount, setDepositAmount] = useState('');
  const [tokenAddress, setTokenAddress] = useState('');
  const [error, setError] = useState(null); // Error state

  const INSURANCE_LIMIT = 250000; // 250,000 ETH insurance limit

  const [isLoading, setIsLoading] = useState(false);

  const handleDeposit = async () => {
    setError(null); // Clear previous errors

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
      setError('Please enter a valid deposit amount.');
      return;
    }
    if (depositAmount > INSURANCE_LIMIT) {
      setError(`Deposit exceeds the insurance limit of ${INSURANCE_LIMIT}. Only ${INSURANCE_LIMIT} will be insured.`);
    }
    if (!fdicContract) {
      setError('FDIC Contract is not initialized. Please try again.');
      return;
    }
    try {
      setIsLoading(true);
      const amountInWei = ethers.parseUnits(depositAmount, 18); // Assuming the token has 18 decimals
      // Approve FDIC contract to spend tokens
      const signer = await provider.getSigner();
      const tokenContract = new ethers.Contract(tokenAddress, USDCERC20.abi, signer);
      
      const approvalTx = await tokenContract.approve(fdicContract.address, ethers.parseUnits(depositAmount, 18));
      await approvalTx.wait();
      const tx = await fdicContract.deposit(bankAddress, tokenAddress, amountInWei);
      await tx.wait();
      alert(`Deposit successful: ${depositAmount} tokens to ${bankAddress}`);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error(error);
      handleDepositError(error);
    }
  };

  const handleDepositError = (error) => {
    // Smart Contract specific errors
    if (error.message.includes('Bank is not registered')) {
      setError('The selected bank is not registered. Please select a valid bank.');
    } else if (error.message.includes('Bank has failed')) {
      setError('The selected bank has failed. You cannot deposit funds into a failed bank.');
    }
    // Ethereum transaction errors
    else if (error.code === 'INSUFFICIENT_FUNDS') {
      setError('You do not have enough funds in your wallet to complete this transaction.');
    } else if (error.code === 'INVALID_ARGUMENT') {
      setError('Invalid input. Please ensure the amount is a valid number.');
    } else if (error.code === 'NETWORK_ERROR') {
      setError('Network error. Please check your internet connection or switch to a valid network.');
    } else {
      setError(`An unexpected error occurred: ${error.message}`);
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
          placeholder={defaultBankAddress}
        />
        <p>
          The blockchain address of the bank where you want to deposit your 
          funds. Think of this as the bank’s unique identifier on the blockchain.
        </p>
      </label>
      <label>
        <strong>Token Address:</strong>
        <input
          type="text"
          value={tokenAddress}
          // disabled
          onChange={(e) => setTokenAddress(e.target.value)}
          placeholder={defaultTokenAddress}
        />
        <p>
          The address of the token to deposit your 
          funds. Think of this as the currency you want to deposit.
        </p>
      </label>
      <div className="form-group">
        <label htmlFor="deposit-amount">Deposit Amount:</label>
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
      {error && <div className="error-message">{error}</div>}
      <p>
        By clicking "Deposit," the smart contract will securely store the amount 
        in the selected bank.
      </p>
    </div>
  );

}

export default Deposit;
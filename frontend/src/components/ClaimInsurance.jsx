// src/components/ClaimInsurance.js
import React, { useState } from 'react';
import { useFDICContract } from '../useFDICContract';
import { isAddress } from 'ethers';
import './ClaimInsurance.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShieldAlt } from '@fortawesome/free-solid-svg-icons';

const defaultBankAddress = import.meta.env.VITE_DEFAULT_BANK_ADDRESS;
const defaultTokenAddress = import.meta.env.VITE_DEFAULT_TOKEN_ADDRESS;

const ClaimInsurance = () => {
  const fdicContract = useFDICContract();
  const [bankAddress, setBankAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [claimAmount, setClaimAmount] = useState('');
  const [error, setError] = useState(null); // Error state
  const [tokenAddress, setTokenAddress] = useState('');

  if (!fdicContract) {
    return <div>Please log in to claim insurance.</div>;
  }

  const handleClaim = async () => {
    setError(null); // Clear previous errors
    if (!fdicContract) {
      setError('FDIC Contract is not initialized. Please try again.');
      return;
    }

    if (!bankAddress.trim()) {
      alert('Please enter the bank address.');
      return;
    }
    if (!isAddress(bankAddress)) {
      alert('Please enter a valid Ethereum address for the bank.');
      return;
    }
    try {
      setIsLoading(true);
      const tx = await fdicContract.claimInsurance(bankAddress, tokenAddress);
      await tx.wait();
      setIsLoading(false);
      alert('Insurance claimed!');
    } catch (error) {
      setIsLoading(false);
      console.error('Claim failed:', error);
      handleClaimError(error);
    }
  };

  const handleClaimError = (error) => {
    // Smart Contract specific errors
    if (error.message.includes('Bank has not failed')) {
      setError('You cannot claim insurance from a bank that has not failed.');
    } else if (error.message.includes('No insured amount to claim')) {
      setError('You do not have any insured amount to claim.');
    }
    // Ethereum transaction errors
    else if (error.code === 'INSUFFICIENT_FUNDS') {
      setError('The contract does not have enough funds to pay out this claim.');
    } else if (error.code === 'NETWORK_ERROR') {
      setError('Network error. Please check your internet connection or switch to a valid network.');
    } else {
      setError(`An unexpected error occurred: ${error.message}`);
    }
  };

  return (
    <div className="claim-insurance-container">
    <h2><FontAwesomeIcon icon={faShieldAlt} /> Claim Insurance</h2>
    <p>To claim your insured amount, enter the claim details below.</p>
    <div className="form-group">
      <label htmlFor="claim-amount">Claim Amount (ETH):</label>
      <input
        type="number"
        id="claim-amount"
        value={claimAmount}
        onChange={(e) => setClaimAmount(e.target.value)}
        placeholder="Enter claim amount"
      />
    </div>


    <div className="claim-insurance-section">
      <h2>Claim Insurance</h2>
      <p>
        If the bank where your funds are deposited has failed, you can claim 
        insurance. The blockchain will verify the bank’s failure and reimburse 
        you for the insured amount.
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
          This is the blockchain address of the failed bank. If the bank has 
          failed, you will be able to claim the insurance amount.
        </p>
        <strong>Token Address:</strong>
        <input
          type="text"
          value={tokenAddress}
          onChange={(e) => setTokenAddress(e.target.value)}
          // disabled
          placeholder={defaultTokenAddress}
        />
        <p>
          This is the blockchain address of the failed bank. If the bank has 
          failed, you will be able to claim the insurance amount.
        </p>
      <button className="claim-button" onClick={handleClaim}>
      Claim Insurance
      </button>
      {error && <div className="error-message">{error}</div>}
      <p>
        When you click "Claim Insurance," the smart contract will check the 
        bank’s status and release your insured deposit if the bank has failed.
      </p>
      </label>
    </div>
    </div>
  );
}

export default ClaimInsurance;
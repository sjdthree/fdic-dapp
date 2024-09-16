// src/components/ClaimInsurance.js
import React, { useState } from 'react';
import { useFDICContract } from '../useFDICContract';
import { isAddress } from 'ethers';

const ClaimInsurance = () => {
  const fdicContract = useFDICContract();
  const [bankAddress, setBankAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!fdicContract) {
    return <div>Please log in to claim insurance.</div>;
  }

  const handleClaim = async () => {
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
      const tx = await fdicContract.claimInsurance(bankAddress);
      await tx.wait();
      setIsLoading(false);
      alert('Insurance claimed!');
    } catch (error) {
      setIsLoading(false);
      console.error(error);
      alert('An error occurred during the claim.');
    }
  };

  return (
    <div>
      <h2>Claim Insurance</h2>
      <label>
        Bank Address:
        <input
          type="text"
          placeholder="Bank Address"
          value={bankAddress}
          onChange={(e) => setBankAddress(e.target.value)}
        />
      </label>
      <button onClick={handleClaim} disabled={isLoading}>
        {isLoading ? 'Processing...' : 'Claim'}
      </button>
    </div>
  );
};

export default ClaimInsurance;
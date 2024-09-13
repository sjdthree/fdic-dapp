// src/components/ClaimInsurance.js
import React, { useState } from 'react';
import { useFDICContract } from '../useFDICContract';

const ClaimInsurance = () => {
  const fdicContract = useFDICContract();
  const [bankAddress, setBankAddress] = useState('');

  const handleClaim = async () => {
    try {
      const tx = await fdicContract.claimInsurance(bankAddress);
      await tx.wait();
      alert('Insurance claimed!');
    } catch (error) {
      console.error(error);
      alert('An error occurred during the claim.');
    }
  };

  if (!fdicContract) {
    return <div>Loading...</div>;
  }
  
  return (
    <div>
      <h2>Claim Insurance</h2>
      <input
        type="text"
        placeholder="Bank Address"
        value={bankAddress}
        onChange={(e) => setBankAddress(e.target.value)}
      />
      <button onClick={handleClaim}>Claim</button>
    </div>
  );
};

export default ClaimInsurance;
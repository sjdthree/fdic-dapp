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
          placeholder="Enter the bank's blockchain address"
        />
        <p>
          This is the blockchain address of the failed bank. If the bank has 
          failed, you will be able to claim the insurance amount.
        </p>
      </label>
      <button onClick={handleClaim}>
        Claim Insurance
      </button>
      <p>
        When you click "Claim Insurance," the smart contract will check the 
        bank’s status and release your insured deposit if the bank has failed.
      </p>
    </div>
  );
}

export default ClaimInsurance;
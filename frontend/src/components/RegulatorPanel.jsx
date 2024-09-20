import React, { useState, useContext, useEffect } from 'react';
import { BlockchainContext } from '../BlockchainProvider';
import { ethers } from 'ethers';
import OnChainFDIC from '../abis/OnChainFDIC.json';
import './RegulatorPanel.css';

const correctRegulatorWallet = '0xYourRegulatorWalletAddress'; // Replace with actual wallet address

const RegulatorPanel = () => {
  const { provider, account } = useContext(BlockchainContext);
  const [contract, setContract] = useState(null);
  const [newBankAddress, setNewBankAddress] = useState('');
  const [bankToFail, setBankToFail] = useState('');
  const [insurancePoolBalance, setInsurancePoolBalance] = useState('');
  const [error, setError] = useState('');
  const [isCorrectWallet, setIsCorrectWallet] = useState(false);

  useEffect(() => {
    if (account && account.toLowerCase() === correctRegulatorWallet.toLowerCase()) {
      setIsCorrectWallet(true);
    } else {
      setIsCorrectWallet(false);
    }
  }, [account]);

  // Initialize contract and check for correct wallet
  useEffect(() => {
    const initContract = async () => {
      if (provider && account) {
        const signer = provider.getSigner();
        const fdicContract = new ethers.Contract(OnChainFDIC.address, OnChainFDIC.abi, signer);
        setContract(fdicContract);
      }
    };

    initContract();
  }, [provider, account]);

  // Register a new bank
  const registerBank = async () => {
    if (!newBankAddress) {
      alert('Please enter a valid bank address.');
      return;
    }

    try {
      const tx = await contract.registerBank(newBankAddress);
      await tx.wait();
      alert(`Bank ${newBankAddress} registered successfully.`);
      setNewBankAddress('');
    } catch (error) {
      console.error('Error registering bank:', error);
      alert('Bank registration failed.');
    }
  };

  // Mark a bank as failed
  const failBank = async () => {
    if (!bankToFail) {
      alert('Please enter a valid bank address.');
      return;
    }

    try {
      const tx = await contract.failBank(bankToFail);
      await tx.wait();
      alert(`Bank ${bankToFail} marked as failed.`);
      setBankToFail('');
    } catch (error) {
      console.error('Error failing bank:', error);
      alert('Failing bank failed.');
    }
  };

  // Fetch the insurance pool balance
  const fetchInsurancePoolBalance = async () => {
    try {
      const balance = await contract.getInsurancePoolBalance();
      setInsurancePoolBalance(ethers.formatEther(balance));
    } catch (error) {
      console.error('Error fetching insurance pool balance:', error);
    }
  };

  // Fetch the pool balance on load
  useEffect(() => {
    if (contract) {
      fetchInsurancePoolBalance();
    }
  }, [contract]);



  if (error) {
    return <p className="error-message">{error}</p>;
  }

  return (
    <div className="regulator-panel">
      <h2>Regulator Panel</h2>

      {/* Insurance Pool Balance */}
      <div className="pool-balance">
        <h3>Insurance Pool Balance</h3>
        <p>{insurancePoolBalance} ETH</p>
      </div>

      {/* Register Bank */}
      <div className="register-bank">
        <h3>Register a Bank</h3>
        <input
          type="text"
          placeholder="Enter Bank Address"
          value={newBankAddress}
          onChange={(e) => setNewBankAddress(e.target.value)}
          disabled={!isCorrectWallet}
        />
        <button onClick={registerBank}>Register Bank</button>
      </div>

      {/* Fail Bank */}
      <div className="fail-bank">
        <h3>Mark Bank as Failed</h3>
        <input
          type="text"
          placeholder="Enter Bank Address"
          value={bankToFail}
          onChange={(e) => setBankToFail(e.target.value)}
          disabled={!isCorrectWallet}
        />
        <button onClick={failBank}>Fail Bank</button>
      </div>
      {!isCorrectWallet && (
      <div className="warning-message">
      <p>You are connected with the wrong wallet. Please connect with the regulator's wallet: {correctRegulatorWallet}</p>
            </div>
        )}
    </div>
  );
};

export default RegulatorPanel;
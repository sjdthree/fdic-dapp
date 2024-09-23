import React, { useState, useContext, useEffect } from "react";
import { BlockchainContext } from "../BlockchainProvider";
import { ethers } from "ethers";
import OnChainFDIC from "../abis/OnChainFDIC.json";
import Navbar from "../NavBar";
import "./RegulatorPanel.css";

const correctRegulatorWallet = "0x3c565c6bc265ce063bf793f4260918165f598d31"; // Replace with actual wallet address

const RegulatorPanel = () => {
  const { provider, account } = useContext(BlockchainContext);
  const [contract, setContract] = useState(null);
  const [creator, setCreator] = useState("");
  const [newBankAddress, setNewBankAddress] = useState("");
  const [bankToFail, setBankToFail] = useState("");
  const [insurancePoolBalance, setInsurancePoolBalance] = useState("");
  const [error, setError] = useState("");
  const [isCorrectWallet, setIsCorrectWallet] = useState(false);

  // Function to get contract creator (regulator)
  const getContractCreator = async (contractAddress) => {
    try {
      const txHash = await provider.getTransactionReceipt(contractAddress);
      const txDetails = await provider.getTransaction(txHash.transactionHash);
      return txDetails.from; // Creator address
    } catch (error) {
      console.error("Error fetching contract creator:", error);
      return null;
    }
  };

  useEffect(() => {
    if (
      account &&
      account.toLowerCase() === correctRegulatorWallet.toLowerCase()
    ) {
      setIsCorrectWallet(true);
    } else {
      setIsCorrectWallet(false);
    }
  }, [account]);

  useEffect(() => {
    const initContract = async () => {
      if (provider && account) {
        const signer = provider.getSigner();
        const fdicContract = new ethers.Contract(
          OnChainFDIC.address,
          OnChainFDIC.abi,
          signer
        );
        setContract(fdicContract);

        // Fetch the contract creator (regulator's wallet)
        const contractCreator = await getContractCreator(OnChainFDIC.address);
        setCreator(contractCreator);

        // Check if the current account matches the contract creator (regulator)
        if (account.toLowerCase() === contractCreator.toLowerCase()) {
          setIsCorrectWallet(true);
        } else {
          setIsCorrectWallet(false);
        }
      }
    };

    initContract();
  }, [provider, account]);

  // Register a new bank
  const registerBank = async () => {
    if (!newBankAddress) {
      alert("Please enter a valid bank address.");
      return;
    }

    try {
      const tx = await contract.registerBank(newBankAddress);
      await tx.wait();
      alert(`Bank ${newBankAddress} registered successfully.`);
      setNewBankAddress("");
    } catch (error) {
      console.error("Error registering bank:", error);
      alert("Bank registration failed.");
    }
  };

  // Mark a bank as failed
  const failBank = async () => {
    if (!bankToFail) {
      alert("Please enter a valid bank address.");
      return;
    }

    try {
      const tx = await contract.failBank(bankToFail);
      await tx.wait();
      alert(`Bank ${bankToFail} marked as failed.`);
      setBankToFail("");
    } catch (error) {
      console.error("Error failing bank:", error);
      alert("Failing bank failed.");
    }
  };

  // Fetch the insurance pool balance
  const fetchInsurancePoolBalance = async () => {
    try {
      const balance = await contract.getInsurancePoolBalance();
      setInsurancePoolBalance(ethers.formatEther(balance));
    } catch (error) {
      console.error("Error fetching insurance pool balance:", error);
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
    <>
      <Navbar creator={creator} />
      <div className="regulator-panel">
        <h2>Regulator Panel</h2>

        <div className="wallet-info">
          <p>Contract Creator (Regulator): {creator}</p>
        </div>

        {/* Insurance Pool Balance */}
        <div className="pool-balance">
          <h3>Insurance Pool Balance</h3>
          <p>{insurancePoolBalance} ETH</p>
        </div>

        <div className="wallet-info">
          <p>Contract Creator (Regulator): {creator}</p>
        </div>
        {/* Register Bank */}
        <div
          className={
            isCorrectWallet ? "register-bank" : "register-bank disabled"
          }
        >
          <h3>Register a Bank</h3>
          <input
            type="text"
            placeholder="Enter Bank Address"
            value={newBankAddress}
            onChange={(e) => setNewBankAddress(e.target.value)}
            disabled={!isCorrectWallet}
          />
          <button onClick={registerBank} disabled={!isCorrectWallet}>
            Register Bank
          </button>
        </div>

        {/* Fail Bank */}
        <div className={isCorrectWallet ? "fail-bank" : "fail-bank disabled"}>
          <h3>Mark Bank as Failed</h3>
          <input
            type="text"
            placeholder="Enter Bank Address"
            value={bankToFail}
            onChange={(e) => setBankToFail(e.target.value)}
            disabled={!isCorrectWallet}
          />
          <button onClick={failBank} disabled={!isCorrectWallet}>
            Fail Bank
          </button>
        </div>
      </div>
    </>
  );
};

export default RegulatorPanel;

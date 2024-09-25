import React, { useState, useContext, useEffect } from "react";
import { BlockchainContext } from "../BlockchainProvider";
import { ethers } from "ethers";
import ERC20FDIC from "../abis/ERC20FDIC.json";
import {
  TextField,
  Button,
  Typography,
  Box,
  Grid2,
  Paper,
} from "@mui/material";
import { useLoading } from '../LoadingContext';
import { notify } from './ToastNotifications';
import LoadingOverlay from './LoadingOverlay';

const fdicContractAddress = import.meta.env.VITE_FDIC_CONTRACT_ADDRESS;
const regulatorWallet = import.meta.env.VITE_REGULATOR_WALLET;
const defaultBankAddress = import.meta.env.VITE_DEFAULT_BANK_ADDRESS;
const defaultTokenAddress = import.meta.env.VITE_DEFAULT_TOKEN_ADDRESS;
const steps = ['Initializing', 'Processing', 'Finalizing'];

const RegulatorPanel = () => {
  const { provider, account } = useContext(BlockchainContext);
  const [contract, setContract] = useState(null);
  const [creator, setCreator] = useState(regulatorWallet);
  const [newBankAddress, setNewBankAddress] = useState(defaultBankAddress);
  const [bankToFail, setBankToFail] = useState("");
  const [insurancePoolBalance, setInsurancePoolBalance] = useState("0");
  const [newRegulatorAddress, setNewRegulatorAddress] = useState("");
  const [isCorrectWallet, setIsCorrectWallet] = useState(false);
  const { isLoading, setIsLoading } = useLoading();
  const [activeStep, setActiveStep] = useState(0);

  // Check if the connected account is the correct regulator wallet
  useEffect(() => {
    if (contract) {
      const regCheck = async () => {
        await contract.isRegulator(account);
      };
      console.log(regCheck);
      if (regCheck) {
        setIsCorrectWallet(true);
      } else {
        setIsCorrectWallet(false);
      }
    }
  }, [contract, account]);

  // Initialize contract
  useEffect(() => {
    const initContract = async () => {
      if (provider && account) {
        setActiveStep(1); 
        try {
          console.log("Initializing contract...");
          setIsLoading(true); // Show loading spinner
          const signer = await provider.getSigner(); // Use a signer for writing transactions

          const fdicContract = new ethers.Contract(
            fdicContractAddress,
            ERC20FDIC.abi,
            signer
          );
          setActiveStep(2); 
          setContract(fdicContract);
          console.log("Contract initialized:", fdicContract);
          setIsLoading(false); // Show loading spinner
          setActiveStep(3); 
        } catch (error) {
          setIsLoading(false);
          setActiveStep(0); 
          console.error("Error initializing contract:", error);
        }
      } else {
        console.log("No provider or account found in initContract");
        setIsLoading(false);
      }
    };

    initContract();
  }, [provider, account]);

  // Fetch the insurance pool balance from the contract
  const fetchInsurancePoolBalance = async () => {
    if (!contract) return;

    try {
      setIsLoading(true);
      setActiveStep(1); 
      const balance = await contract.getInsurancePoolBalance(); // Reading data from the smart contract
      setInsurancePoolBalance(ethers.formatEther(balance)); // Format balance in ether
      setIsLoading(false);
      setActiveStep(0); 
    } catch (error) {
      console.error("Error fetching insurance pool balance:", error);
    }
  };

  // Call fetchInsurancePoolBalance when the contract is initialized
  useEffect(() => {
    if (contract) {
      fetchInsurancePoolBalance();
    }
  }, [contract]);

  // Register a new bank
  const registerBank = async () => {
    if (!newBankAddress) {
      notify("Please enter a valid bank address.");
      return;
    }

    try {
      setIsLoading(true);
      setActiveStep(1); 
      const tx = await contract.registerBank(newBankAddress);
      setActiveStep(2); 
      await tx.wait();
      setActiveStep(3); 
      notify(`Bank ${newBankAddress} registered successfully.`);
      setNewBankAddress(""); // Reset the input field
      setIsLoading(false);
      setActiveStep(0); 
    } catch (error) {
      setIsLoading(false);
      setActiveStep(0); 
      console.error("Error registering bank:", error);
      notify("Bank registration failed.");
    }
  };
  // Add a new regulator
  const handleAddRegulator = async () => {
    try {
      setIsLoading(true);
      setActiveStep(1); 
      const tx = await contract.addRegulator(newRegulatorAddress);
      setActiveStep(2); 
      await tx.wait();
      setActiveStep(3); 
      notify(`Regulator ${newRegulatorAddress} added successfully.`);
      setIsLoading(false);
      setActiveStep(0); 
    } catch (error) {
      setIsLoading(false);
      setActiveStep(0); 
      console.error("Error adding regulator:", error);
      notify("Adding regulator failed.");
    }
  };
  // Mark a bank as failed
  const failBank = async () => {
    if (!bankToFail) {
      notify("Please enter a valid bank address.");
      return;
    }

    try {
      setIsLoading(true);
      setActiveStep(1);
      const tx = await contract.failBank(bankToFail);
      setActiveStep(2);
      await tx.wait();
      setActiveStep(3);
      notify(`Bank ${bankToFail} marked as failed.`);
      setBankToFail(""); // Reset the input field
      setActiveStep(0);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      setActiveStep(0);
      console.error("Error failing bank:", error);
      notify("Failing bank failed.");
    }
  };

  return (
    <Box p={3}>
      <Paper elevation={3} sx={{ padding: 3 }}>
        <Typography variant="h4" gutterBottom>
          Regulator Panel
        </Typography>

        <Typography variant="body1" gutterBottom>
          Contract Creator (Regulator): {creator || "Not available"}
        </Typography>

        <Typography variant="body1" gutterBottom>
          Insurance Pool Balance: {insurancePoolBalance} ETH
        </Typography>

        {!isCorrectWallet && (
          <Grid2 severity="error" sx={{ marginBottom: 3 }}>
            You are not the regulator. Please switch to the correct wallet to
            perform actions.
          </Grid2>
        )}

        {/* Register Bank Section */}
        <Grid2 container spacing={2} sx={{ marginBottom: 3 }}>
          <Grid2 xs={12}>
            <Typography variant="h5">Register a Bank</Typography>
          </Grid2>
          <Grid2 xs={12} md={8}>
            <TextField
              label="Enter Bank Address"
              fullWidth
              value={newBankAddress}
              onChange={(e) => setNewBankAddress(e.target.value)}
              disabled={!isCorrectWallet}
            />
          </Grid2>
          <Grid2 xs={12} md={4}>
          <LoadingOverlay open={isLoading} currentStep={activeStep} steps={steps} />
            <Button
              variant="contained"
              color="primary"
              onClick={registerBank}
              disabled={!isCorrectWallet}
              fullWidth
            >
              Register Bank
            </Button>
          </Grid2>
        </Grid2>

        {/* Fail Bank Section */}
        <Grid2 container spacing={2}>
          <Grid2 xs={12}>
            <Typography variant="h5">Mark Bank as Failed</Typography>
          </Grid2>
          <Grid2 xs={12} md={8}>
            <TextField
              label="Enter Bank Address"
              fullWidth
              value={bankToFail}
              onChange={(e) => setBankToFail(e.target.value)}
              disabled={!isCorrectWallet}
            />
          </Grid2>
          <Grid2 xs={12} md={4}>
          <LoadingOverlay open={isLoading} currentStep={activeStep} steps={steps} />
            <Button
              variant="contained"
              color="secondary"
              onClick={failBank}
              disabled={!isCorrectWallet}
              fullWidth
            >
              Fail Bank
            </Button>
          </Grid2>
        </Grid2>
        <Grid2 xs={12} md={6}>
          <TextField
            label="New Regulator Address"
            value={newRegulatorAddress}
            onChange={(e) => setNewRegulatorAddress(e.target.value)}
            disabled={!isCorrectWallet}
          />
        </Grid2>
        <Grid2 xs={12} md={6}>
        <LoadingOverlay open={isLoading} currentStep={activeStep} steps={steps} />
          <Button
            variant="contained"
            onClick={handleAddRegulator}
            disabled={!isCorrectWallet}
          >
            Add Regulator
          </Button>
        </Grid2>
      </Paper>
    </Box>
  );
};

export default RegulatorPanel;

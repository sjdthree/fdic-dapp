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
      console.log("Insurance pool balance:", balance);
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
    <Box p={4}>
      <Paper elevation={3} sx={{ padding: 4 }}>
        {/* Page Header */}
        <Typography variant="h4" gutterBottom>
          Regulator Panel
        </Typography>

        {/* Contract Creator and Insurance Pool Balance */}
        <Box mb={4}>
          <Typography variant="body1" gutterBottom>
            Contract Creator (Regulator): {creator || "Not available"}
          </Typography>
          <Typography variant="body1" gutterBottom>
            Insurance Pool Balance: {insurancePoolBalance} ETH
          </Typography>
        </Box>

        {/* Register Bank Section */}
        <Box mb={4}>
          <Typography variant="h5" gutterBottom>
            Register a Bank
          </Typography>
          <Grid2 container spacing={2}>
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
        </Box>

        {/* Fail Bank Section */}
        <Box mb={4}>
          <Typography variant="h5" gutterBottom>
            Mark Bank as Failed
          </Typography>
          <Grid2 container spacing={2}>
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
        </Box>

        {/* Add Regulator Section */}
        <Box mb={4}>
          <Typography variant="h5" gutterBottom>
            Add New Regulator
          </Typography>
          <Grid2 container spacing={2}>
            <Grid2 xs={12} md={8}>
              <TextField
                label="New Regulator Address"
                fullWidth
                value={newRegulatorAddress}
                onChange={(e) => setNewRegulatorAddress(e.target.value)}
                disabled={!isCorrectWallet}
              />
            </Grid2>
            <Grid2 xs={12} md={4}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleAddRegulator}
                disabled={!isCorrectWallet}
                fullWidth
              >
                Add Regulator
              </Button>
            </Grid2>
          </Grid2>
        </Box>

        {/* Loading Overlay */}
        <LoadingOverlay open={isLoading} currentStep={activeStep} steps={steps} />
      </Paper>
    </Box>
  );
};

export default RegulatorPanel;

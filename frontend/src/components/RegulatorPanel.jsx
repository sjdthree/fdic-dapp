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
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { useLoading } from "../LoadingContext";
import { notify } from "./ToastNotifications";
import LoadingOverlay from "./LoadingOverlay";

const fdicContractAddress = import.meta.env.VITE_FDIC_CONTRACT_ADDRESS;
const regulatorWallet = import.meta.env.VITE_REGULATOR_WALLET;
const defaultBankAddress = import.meta.env.VITE_DEFAULT_BANK_ADDRESS;
const defaultTokenAddress = import.meta.env.VITE_DEFAULT_TOKEN_ADDRESS;
const steps = ["Initializing", "Processing", "Finalizing"];

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
  const [banks, setBanks] = useState([]); // State to hold all banks
  const [failedBanks, setFailedBanks] = useState([]); // State for failed banks
  const [regulators, setRegulators] = useState([]); // State for regulators

  // Check if the connected account is the correct regulator wallet
  useEffect(() => {
    if (contract) {
      const regCheck = async () => {
        const result = await contract.isRegulator(account);
        setIsCorrectWallet(result);
      };
      regCheck().catch((error) => {
        console.error("Error checking regulator status:", error);
        setIsCorrectWallet(false);
      });
    }
  }, [contract, account]);

  // Initialize contract
  useEffect(() => {
    const initContract = async () => {
      if (provider && account) {
        setActiveStep(1);
        try {
          console.log("Initializing contract...");
          setIsLoading(true);
          const signer = await provider.getSigner();

          const fdicContract = new ethers.Contract(
            fdicContractAddress,
            ERC20FDIC.abi,
            signer
          );
          setContract(fdicContract);
          console.log("Contract initialized:", fdicContract);
          fetchInitialData(); // Fetch data after initialization
          setIsLoading(false);
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

  const fetchInitialData = async () => {
    if (!contract) return;

    // Fetch data in parallel
    await Promise.all([
      fetchInsurancePoolBalance(),
      fetchBanks(),
      fetchFailedBanks(),
      fetchRegulators(),
    ]);
  };

  // Fetch the insurance pool balance from the contract
  const fetchInsurancePoolBalance = async () => {
    if (!contract) return;

    try {
      setIsLoading(true);
      setActiveStep(1);
      const balance = await contract.getInsurancePoolBalance();
      console.log("Insurance pool balance:", balance.toString());
      setInsurancePoolBalance(ethers.formatEther(balance));
      setIsLoading(false);
      setActiveStep(0);
    } catch (error) {
      console.error("Error fetching insurance pool balance:", error);
    }
  };

  // Fetch all banks
  const fetchBanks = async () => {
    if (!contract) return;

    try {
      const allBanks = await contract.getBanks();
      console.log("All Banks:", allBanks);
      setBanks(allBanks);
    } catch (error) {
      console.error("Error fetching banks:", error);
    }
  };

  // Fetch all failed banks
  const fetchFailedBanks = async () => {
    if (!contract) return;

    try {
      const allFailedBanks = await contract.getFailedBanks();
      console.log("All Failed Banks:", allFailedBanks);
      setFailedBanks(allFailedBanks);
    } catch (error) {
      console.error("Error fetching failed banks:", error);
    }
  };

  // Fetch all regulators
  const fetchRegulators = async () => {
    if (!contract) return;

    try {
      const allRegulators = await contract.getRegulators();
      console.log("All Regulators:", allRegulators);
      setRegulators(allRegulators);
    } catch (error) {
      console.error("Error fetching regulators:", error);
    }
  };

  // Register a new bank
  const registerBank = async () => {
    if (!newBankAddress) {
      notify("Please enter a valid bank address.");
      return;
    }

    // Check if the bank is already registered
    if (banks.includes(newBankAddress)) {
      notify("This bank is already registered.");
      return;
    }

    try {
      setIsLoading(true);
      setActiveStep(1);
      const tx = await contract.registerBank(newBankAddress);
      await tx.wait();
      notify(`Bank ${newBankAddress} registered successfully.`);
      setNewBankAddress(""); // Reset the input field
      setIsLoading(false);
      fetchBanks(); // Refresh bank list
    } catch (error) {
      setIsLoading(false);
      console.error("Error registering bank:", error);
      notify("Bank registration failed.");
    }
  };

  // Add new regulator
  const handleAddRegulator = async () => {
    if (!newRegulatorAddress) {
      notify("Please enter a new regulator address.");
      return;
    }

    try {
      setIsLoading(true);
      setActiveStep(1);
      const tx = await contract.addRegulator(newRegulatorAddress);
      await tx.wait();
      notify(`Regulator ${newRegulatorAddress} added successfully.`);
      setIsLoading(false);
      fetchRegulators(); // Refresh regulator list
    } catch (error) {
      setIsLoading(false);
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
      await tx.wait();
      notify(`Bank ${bankToFail} marked as failed.`);
      setBankToFail(""); // Reset the input field
      setIsLoading(false);
      fetchFailedBanks(); // Refresh failed bank list
    } catch (error) {
      setIsLoading(false);
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

        {/* Display All Banks */}
        <Box mb={4}>
          <Typography variant="h5" gutterBottom>
            Registered Banks
          </Typography>
          {banks.length === 0 ? (
            <Typography>No banks registered.</Typography>
          ) : (
            <List>
              {banks.map((bank) => (
                <ListItem key={bank}>
                  <ListItemText primary={bank} />
                </ListItem>
              ))}
            </List>
          )}
        </Box>

        {/* Display Failed Banks */}
        <Box mb={4}>
          <Typography variant="h5" gutterBottom>
            Failed Banks
          </Typography>
          {failedBanks.length === 0 ? (
            <Typography>No failed banks.</Typography>
          ) : (
            <List>
              {failedBanks.map((bank) => (
                <ListItem key={bank}>
                  <ListItemText primary={bank} />
                </ListItem>
              ))}
            </List>
          )}
        </Box>

        {/* Display Regulators */}
        <Box mb={4}>
          <Typography variant="h5" gutterBottom>
            Current Regulators
          </Typography>
          {regulators.length === 0 ? (
            <Typography>No regulators found.</Typography>
          ) : (
            <List>
              {regulators.map((regulator) => (
                <ListItem key={regulator}>
                  <ListItemText primary={regulator} />
                </ListItem>
              ))}
            </List>
          )}
        </Box>

        {/* Loading Overlay */}
        <LoadingOverlay
          open={isLoading}
          currentStep={activeStep}
          steps={steps}
        />
      </Paper>
    </Box>
  );
};

export default RegulatorPanel;

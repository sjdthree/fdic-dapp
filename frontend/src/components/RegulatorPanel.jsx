import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import ERC20FDIC from "../abis/ERC20FDIC.json";
import USDCERC20 from "../abis/USDCERC20.json";
import {
  TextField,
  Button,
  Typography,
  Box,
  Grid2,
  Paper,
  Popover,
  IconButton,
} from "@mui/material";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { useLoading } from "../LoadingContext";
import { notify } from "./ToastNotifications";
import LoadingOverlay from "./LoadingOverlay";
import BankStatusGrid from "./BankStatusGrid";
import { useDynamicContext, useIsLoggedIn } from '@dynamic-labs/sdk-react-core';

const fdicContractAddress = import.meta.env.VITE_FDIC_CONTRACT_ADDRESS;
const regulatorWallet = import.meta.env.VITE_REGULATOR_WALLET;
const defaultBankAddress = import.meta.env.VITE_DEFAULT_BANK_ADDRESS;
const defaultTokenAddress = import.meta.env.VITE_DEFAULT_TOKEN_ADDRESS;
const steps = ["Initializing", "Processing", "Finalizing"];

const RegulatorPanel = () => {
  const { primaryWallet } = useDynamicContext();
  const isLoggedIn = useIsLoggedIn();
  const [contract, setContract] = useState(null);
  const [creator, setCreator] = useState(regulatorWallet);
  const [newBankAddress, setNewBankAddress] = useState(defaultBankAddress);
  const [bankToFail, setBankToFail] = useState("");
  const [bankToUnFail, setBankToUnFail] = useState("");
  const [insurancePoolBalance, setInsurancePoolBalance] = useState("0");
  const [newRegulatorAddress, setNewRegulatorAddress] = useState("");
  const [isCorrectWallet, setIsCorrectWallet] = useState(false);
  const { isLoading, setIsLoading } = useLoading();
  const [activeStep, setActiveStep] = useState(0);
  const [banks, setBanks] = useState([]);
  const [failedBanks, setFailedBanks] = useState([]);
  const [regulators, setRegulators] = useState([]);
  const [bankStatus, setbankStatus] = useState([]);
  const [tokenSymbol, setTokenSymbol] = useState("");

  // State for Popovers
  const [anchorEl, setAnchorEl] = useState(null);
  const [popoverContent, setPopoverContent] = useState("");

  const open = Boolean(anchorEl);

  const getContractWithSigner = async () => {
    if (!primaryWallet) return null;
    const walletClient = await primaryWallet.getWalletClient();
    const ethersProvider = new ethers.BrowserProvider(walletClient.provider);
    const signer = await ethersProvider.getSigner();
    return new ethers.Contract(fdicContractAddress, ERC20FDIC.abi, signer);
  };

  // Check if the connected account is the correct regulator wallet
  useEffect(() => {
    const checkRegulator = async () => {
      if (primaryWallet && isLoggedIn) {
        try {
          const contract = await getContractWithSigner();
          if (!contract) return;

          const walletClient = await primaryWallet.getWalletClient();
          const address = await walletClient.getAddress();
          const result = await contract.isRegulator(address);
          setIsCorrectWallet(result);
        } catch (error) {
          console.error("Error checking regulator status:", error);
          setIsCorrectWallet(false);
        }
      }
    };
    checkRegulator();
  }, [primaryWallet, isLoggedIn]);

  // Initialize contract
  useEffect(() => {
    const initContract = async () => {
      if (primaryWallet && isLoggedIn) {
        setActiveStep(1);
        try {
          console.log("Initializing contract...");
          setIsLoading(true);

          const contract = await getContractWithSigner();
          if (!contract) return;

          setContract(contract);
          console.log("Contract initialized:", contract);
          await fetchInitialData(contract);
          setIsLoading(false);
          setActiveStep(3);
        } catch (error) {
          setIsLoading(false);
          setActiveStep(0);
          console.error("Error initializing contract:", error);
        }
      }
    };

    initContract();
  }, [primaryWallet, isLoggedIn]);

  const fetchInitialData = async (contract) => {
    if (!contract) return;
    await Promise.all([
      fetchInsurancePoolBalance(contract),
      fetchBanks(contract),
      fetchFailedBanks(contract),
      fetchRegulators(contract),
      getBankStatus(),
      fetchTokenSymbol(),
    ]);
  };

  const fetchInsurancePoolBalance = async (contractToUse) => {
    try {
      setIsLoading(true);
      setActiveStep(1);
      const balance = await contractToUse.getInsurancePoolBalance();
      const formattedBalance = parseFloat(ethers.formatEther(balance)).toFixed(2);
      setInsurancePoolBalance(formattedBalance);
      setIsLoading(false);
      setActiveStep(0);
    } catch (error) {
      console.error("Error fetching insurance pool balance:", error);
    }
  };

  const fetchTokenSymbol = async () => {
    try {
      const walletClient = await primaryWallet.getWalletClient();
      const ethersProvider = new ethers.BrowserProvider(walletClient.provider);
      const signer = await ethersProvider.getSigner();
      const tokenContract = new ethers.Contract(defaultTokenAddress, USDCERC20.abi, signer);
      const symbol = await tokenContract.symbol();
      setTokenSymbol(symbol);
    } catch (error) {
      console.error("Error fetching token symbol:", error);
      setTokenSymbol("Token");
    }
  };

  const fetchBanks = async (contractToUse) => {
    try {
      const allBanks = await contractToUse.getBanks();
      console.log("All Banks:", allBanks);
      setBanks(allBanks);
    } catch (error) {
      console.error("Error fetching banks:", error);
    }
  };

  const fetchFailedBanks = async (contractToUse) => {
    try {
      const allFailedBanks = await contractToUse.getFailedBanks();
      console.log("All Failed Banks:", allFailedBanks);
      setFailedBanks(allFailedBanks);
    } catch (error) {
      console.error("Error fetching failed banks:", error);
    }
  };

  const fetchRegulators = async (contractToUse) => {
    try {
      const allRegulators = await contractToUse.getRegulators();
      console.log("All Regulators:", allRegulators);
      setRegulators(allRegulators);
    } catch (error) {
      console.error("Error fetching regulators:", error);
    }
  };

  const getBankStatus = () => {
    const bankStatus = [];
    for (let i = 0; i < banks.length; i++) {
      bankStatus.push(failedBanks.includes(banks[i]) ? "Failed" : "Good");
    }
    setbankStatus(bankStatus);
    console.log("bankStatus", bankStatus);
  };

  const registerBank = async () => {
    if (!newBankAddress) {
      notify("Please enter a valid bank address.");
      return;
    }

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
      setNewBankAddress("");
      setIsLoading(false);
      await fetchBanks(contract);
    } catch (error) {
      setIsLoading(false);
      console.error("Error registering bank:", error);
      notify("Bank registration failed.");
    }
  };

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
      await fetchRegulators(contract);
    } catch (error) {
      setIsLoading(false);
      console.error("Error adding regulator:", error);
      notify("Adding regulator failed.");
    }
  };

  const failBank = async (bankToFail) => {
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
      setBankToFail("");
      setIsLoading(false);
      await fetchFailedBanks(contract);
    } catch (error) {
      setIsLoading(false);
      console.error("Error failing bank:", error);
      notify("Failing bank failed.");
    }
  };

  const unfailBank = async (bankToUnFail) => {
    if (!bankToUnFail) {
      notify("Please enter a valid bank address.");
      return;
    }

    try {
      setIsLoading(true);
      setActiveStep(1);
      const tx = await contract.unfailBank(bankToUnFail);
      await tx.wait();
      notify(`Bank ${bankToUnFail} marked as Good.`);
      setBankToUnFail("");
      setIsLoading(false);
      await fetchFailedBanks(contract);
    } catch (error) {
      setIsLoading(false);
      console.error("Error unfailing bank:", error);
      notify("UnFailing bank failed.");
    }
  };

  const handlePopoverOpen = (event, content) => {
    setAnchorEl(event.currentTarget);
    setPopoverContent(content);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
    setPopoverContent("");
  };

  if (!primaryWallet || !isLoggedIn) {
    return (
      <Box p={4}>
        <Typography variant="h6">Please connect your wallet to access the Regulator Panel.</Typography>
      </Box>
    );
  }

  return (
    <Box p={4}>
      <Paper elevation={3} sx={{ padding: 4 }}>
        <Typography variant="h4" gutterBottom>
          Regulator Control Panel
          <IconButton
            onClick={(e) =>
              handlePopoverOpen(
                e,
                "This is an overview of all the registered banks and their real-time status."
              )
            }
          >
            <HelpOutlineIcon fontSize="small" />
          </IconButton>
        </Typography>

        <Box mb={4}>
          <Typography variant="body1" gutterBottom>
            Main Regulator Address: {creator || "Not available"}
            <IconButton
              onClick={(e) =>
                handlePopoverOpen(
                  e,
                  "This is the address of the main regulator who established this system. Reach out to them for any access questions"
                )
              }
            >
              <HelpOutlineIcon fontSize="small" />
            </IconButton>
          </Typography>
        </Box>

        <BankStatusGrid
          banks={banks}
          failedBanks={failedBanks}
          isCorrectWallet={isCorrectWallet}
          failBank={failBank}
          unfailBank={unfailBank}
          regulators={regulators}
          insurancePoolBalance={insurancePoolBalance}
          tokenSymbol={tokenSymbol}
        />

        <Box mb={4}>
          <Typography variant="h5" gutterBottom>
            Register a New Bank Address
            <IconButton
              onClick={(e) =>
                handlePopoverOpen(
                  e,
                  "Register a new bank with the given address."
                )
              }
            >
              <HelpOutlineIcon fontSize="small" />
            </IconButton>
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

        <Box mb={4}>
          <Typography variant="h5" gutterBottom>
            Add New Regulator
            <IconButton
              onClick={(e) =>
                handlePopoverOpen(
                  e,
                  "Add a new regulator using their wallet address."
                )
              }
            >
              <HelpOutlineIcon fontSize="small" />
            </IconButton>
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

        <Popover
          open={open}
          anchorEl={anchorEl}
          onClose={handlePopoverClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <Typography sx={{ p: 2 }}>{popoverContent}</Typography>
        </Popover>

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

import React, { useState, useEffect, useContext } from "react";
import { BlockchainContext } from "../BlockchainProvider";
import { ethers } from "ethers";
import {
  Button,
  Modal,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  Divider,
  Paper,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
} from "@mui/material";
import ERC20FDIC from "../abis/ERC20FDIC.json"; // Your contract ABI
import USDCERC20 from "../abis/USDCERC20.json"; // Your contract ABI
import { toast } from "react-toastify";
import BankStatusGrid from "./BankStatusGrid"; // Import the BankStatusGrid component

const FDICContractAddress = import.meta.env.VITE_FDIC_CONTRACT_ADDRESS;
const USDCTokenAddress = import.meta.env.VITE_DEFAULT_TOKEN_ADDRESS;

const CurrentBankingMarket = () => {
  const { provider } = useContext(BlockchainContext);
  const [banks, setBanks] = useState([]);
  const [failedBanks, setFailedBanks] = useState([]);
  const [regulators, setRegulators] = useState([]);
  const [insurancePoolBalance, setInsurancePoolBalance] = useState("");
  const [tokenSymbol, setTokenSymbol] = useState("");
  const [isModalOpen, setModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (provider) {
      fetchContractData();
    } else {
      console.log("Provider is not initialized.");
    }
  }, [provider]);

  const fetchTokenSymbol = async (tokenAddress) => {
    try {
      const signer = await provider.getSigner();
      const tokenContract = new ethers.Contract(
        tokenAddress,
        USDCERC20.abi,
        signer
      );
      const tokenSymbol = await tokenContract.symbol(); // Fetch token symbol via ERC20 standard `symbol` function
      return tokenSymbol;
    } catch (error) {
      console.error("Error fetching token symbol:", error);
      toast.error("Failed to fetch token symbol");
      return "Token"; // Fallback in case of error
    }
  };

  const fetchContractData = async () => {
    setIsLoading(true);
    try {
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(
        FDICContractAddress,
        ERC20FDIC.abi,
        signer
      );

      // Fetch banks
      const bankList = await contract.getBanks();
      setBanks(bankList);

      // Fetch failed banks
      const failedBankList = await contract.getFailedBanks();
      setFailedBanks(failedBankList);

      // Fetch regulators
      const regulatorList = await contract.getRegulators();
      setRegulators(regulatorList);

      // Fetch token symbol dynamically
      const symbol = await fetchTokenSymbol(USDCTokenAddress);
      setTokenSymbol(symbol); // Set token symbol in state

      // Fetch insurance pool balance
      const balance = await contract.getInsurancePoolBalance();
      setInsurancePoolBalance(ethers.formatEther(balance));
    } catch (error) {
      console.error("Error fetching contract data:", error);
      toast.error("Failed to fetch contract data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);

  return (
    <div>
      <Button onClick={handleOpenModal} variant="outlined">
      Current Regulator and Bank Status
      </Button>
      <Modal open={isModalOpen} onClose={handleCloseModal}>
        <Paper
          sx={{
            width: "80%",
            margin: "auto",
            marginTop: "5%",
            padding: "20px",
            maxHeight: "90vh",
            overflowY: "auto",
          }}
        >
          <Typography variant="h5" gutterBottom>
            Regulator and Insurance Pool Status
          </Typography>
          <Divider />

          {isLoading ? (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              sx={{ minHeight: "200px" }}
            >
              <CircularProgress />
            </Box>
          ) : (
            <>
              <Typography variant="h6">
                FDIC Contract Address: {FDICContractAddress}
              </Typography>
              <Typography variant="h6">
                Token Address: {USDCTokenAddress}
              </Typography>
              <Divider />



              <BankStatusGrid
                banks={banks}
                failedBanks={failedBanks}
                isCorrectWallet={false}
                insurancePoolBalance={insurancePoolBalance}
                regulators={regulators}
                tokenSymbol={tokenSymbol}
              />
            </>
          )}

          <Button
            onClick={handleCloseModal}
            variant="contained"
            color="primary"
            sx={{ marginTop: 2 }}
          >
            Close
          </Button>
        </Paper>
      </Modal>
    </div>
  );
};

export default CurrentBankingMarket;

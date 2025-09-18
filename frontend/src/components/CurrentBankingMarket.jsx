import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import {
  Button,
  Modal,
  Typography,
  Box,
  Divider,
  Paper,
  CircularProgress,
} from "@mui/material";
import ERC20FDIC from "../abis/ERC20FDIC.json";
import USDCERC20 from "../abis/USDCERC20.json";
import { toast } from "react-toastify";
import BankStatusGrid from "./BankStatusGrid";
import { useDynamicContext, useIsLoggedIn } from '@dynamic-labs/sdk-react-core';

const FDICContractAddress = import.meta.env.VITE_FDIC_CONTRACT_ADDRESS;
const USDCTokenAddress = import.meta.env.VITE_DEFAULT_TOKEN_ADDRESS;

const SEPOLIA_CHAIN_ID = 11155111;

const CurrentBankingMarket = () => {
  const { primaryWallet } = useDynamicContext();
  const isLoggedIn = useIsLoggedIn();

  const [banks, setBanks] = useState([]);
  const [failedBanks, setFailedBanks] = useState([]);
  const [regulators, setRegulators] = useState([]);
  const [insurancePoolBalance, setInsurancePoolBalance] = useState("");
  const [tokenSymbol, setTokenSymbol] = useState("");
  const [isModalOpen, setModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (primaryWallet && isLoggedIn) {
      fetchContractData();
    } else {
      console.log("Wallet is not connected.");
    }
  }, [primaryWallet, isLoggedIn]);

  const getContractWithSigner = async (address, abi) => {
    if (!primaryWallet) {
      throw new Error("No wallet connected");
    }
    const signer = await primaryWallet.getSigner;
    return new ethers.Contract(address, abi, signer);
  };

  const fetchTokenSymbol = async (tokenAddress) => {
    try {
      const tokenContract = await getContractWithSigner(tokenAddress, USDCERC20.abi);
      const symbol = await tokenContract.symbol();
      return symbol;
    } catch (error) {
      console.error("Error fetching token symbol:", error);
      toast.error("Failed to fetch token symbol");
      return "Token";
    }
  };

  const fetchContractData = async () => {
    setIsLoading(true);
    try {
      const contract = await getContractWithSigner(FDICContractAddress, ERC20FDIC.abi);

      // Fetch all data in parallel
      const [bankList, failedBankList, regulatorList, balance, symbol] = await Promise.all([
        contract.getBanks(),
        contract.getFailedBanks(),
        contract.getRegulators(),
        contract.getInsurancePoolBalance(),
        fetchTokenSymbol(USDCTokenAddress)
      ]);

      setBanks(bankList);
      setFailedBanks(failedBankList);
      setRegulators(regulatorList);
      setTokenSymbol(symbol);

      // Format and round balance to 2 decimal places
      const formattedBalance = parseFloat(ethers.formatEther(balance)).toFixed(2);
      setInsurancePoolBalance(formattedBalance);
    } catch (error) {
      console.error("Error fetching contract data:", error);
      toast.error("Failed to fetch contract data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);

  if (!primaryWallet || !isLoggedIn) {
    return null;
  }

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
import React, { useContext, useState, useEffect } from 'react';
import { BlockchainContext } from './BlockchainProvider';
import { Box, Typography, Card, Button, IconButton, Tooltip } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ERC20FDIC from './abis/ERC20FDIC.json';
import USDCERC20 from './abis/USDCERC20.json';

import { ethers } from 'ethers';

const fdicContractAddress = import.meta.env.VITE_FDIC_CONTRACT_ADDRESS;
const regulatorWallet = import.meta.env.VITE_REGULATOR_WALLET;
const defaultBankAddress = import.meta.env.VITE_DEFAULT_BANK_ADDRESS;
const defaultTokenAddress = import.meta.env.VITE_DEFAULT_TOKEN_ADDRESS;

const WalletInfo = () => {
  const { provider, account } = useContext(BlockchainContext);
  const [balance, setBalance] = useState('');
  const [tokenBalance, setTokenBalance] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);  // Track copy success

  useEffect(() => {
    const fetchWalletInfo = async () => {
      if (provider && account) {
        try {
          const balanceInWei = await provider.getBalance(account);  // Fetch balance in wei
          const balanceInEther = ethers.formatEther(balanceInWei);  // Convert balance to ether
          setBalance(parseFloat(balanceInEther).toFixed(4));  // Display up to 4 decimal places

          // Fetch ERC-20 token balance
          const tokenContract = new ethers.Contract(defaultTokenAddress, USDCERC20.abi, provider);
          const tokenBalanceRaw = await tokenContract.balanceOf(account);
          
          // Fetch token decimals to convert the token balance to a readable format
          const decimals = await tokenContract.decimals();
          const formattedTokenBalance = ethers.formatUnits(tokenBalanceRaw, decimals);

          setTokenBalance(parseFloat(formattedTokenBalance).toFixed(4));  // Display up to 4 decimal places
          
        } catch (error) {
          console.error('Error fetching wallet info:', error);
        }
      }
    };

    fetchWalletInfo();
  }, [provider, account, defaultTokenAddress]);  // Run effect when provider or account changes

  const handleCopy = async () => {
    if (account) {
      try {
        await navigator.clipboard.writeText(account);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);  // Reset after 2 seconds
      } catch (err) {
        console.error('Failed to copy address:', err);
      }
    }
  };

  return (
    <Card sx={{ padding: 2, backgroundColor: '#f5f5f5', borderRadius: 2, boxShadow: 3 }}>
      {account ? (
        <Box>
          <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
            Wallet Information
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', marginTop: 1 }}>
            <Typography variant="body1" component="div">
              <strong>Address:</strong> {account}
            </Typography>
            <Tooltip title={copySuccess ? 'Copied!' : 'Copy Address'} sx={{ marginLeft: 1 }}>
              <IconButton onClick={handleCopy}>
                <ContentCopyIcon />
              </IconButton>
            </Tooltip>
          </Box>
          <Typography variant="body1" component="div" sx={{ marginTop: 1 }}>
            <strong>Balance:</strong> {balance} ETH
          </Typography>
          <Typography variant="body1" component="div" sx={{ marginTop: 1 }}>
            <strong>Balance:</strong> {tokenBalance} USDC
          </Typography>
          <Button 
            variant="outlined" 
            sx={{ marginTop: 2 }} 
            onClick={() => window.location.reload()}  // Reload for refreshing wallet info
          >
            Refresh
          </Button>
        </Box>
      ) : (
        <Typography variant="body2" color="textSecondary">
          No Wallet Connected
        </Typography>
      )}
    </Card>
  );
};


export default WalletInfo;
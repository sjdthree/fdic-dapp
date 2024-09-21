import React, { useContext, useState, useEffect } from 'react';
import { BlockchainContext } from './BlockchainProvider';
import { Box, Typography, Card, Button } from '@mui/material';
import { ethers } from 'ethers';


const WalletInfo = () => {
  const { provider, account } = useContext(BlockchainContext);
  const [balance, setBalance] = useState('');


  useEffect(() => {
    const fetchWalletInfo = async () => {
      if (provider && account) {
        try {
          const balanceInWei = await provider.getBalance(account);  // Fetch balance in wei
          const balanceInEther = ethers.formatEther(balanceInWei);  // Convert balance to ether
          setBalance(parseFloat(balanceInEther).toFixed(4));  // Display up to 4 decimal places
        } catch (error) {
          console.error('Error fetching wallet info:', error);
        }
      }
    };

    fetchWalletInfo();
  }, [provider, account]);  // Run effect when provider or account changes

  return (
    <Card sx={{ padding: 2, backgroundColor: '#f5f5f5', borderRadius: 2, boxShadow: 3 }}>
      {account ? (
        <Box>
          <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
            Wallet Information
          </Typography>
          <Typography variant="body1" component="div">
            <strong>Address:</strong> {account}
          </Typography>
          <Typography variant="body1" component="div">
            <strong>Balance:</strong> {balance} ETH
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
import React, { useContext, useState } from 'react';
import { BlockchainContext } from './BlockchainProvider';
import { chainConfig } from './chainConfig';
import WalletInfo from './WalletInfo';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import CurrentBankingMarket from './components/CurrentBankingMarket';
import ThreeDButton from './components/ThreeDButton';
import { DynamicWidget, useDynamicContext, useWalletOptions } from '@dynamic-labs/sdk-react-core';

const NavBar = () => {
  const defaultNetwork = "Sepolia";
  const { account , handleConnectedWallet} = useContext(BlockchainContext);
  const { handleLogOut, user, primaryWallet } = useDynamicContext();
  const [anchorEl, setAnchorEl] = useState(null);
  const [networkEl, setNetworkEl] = useState(null);
  const [selectedValue, setSelectedChain] = useState(defaultNetwork);
  const { openWalletSelector } = useWalletOptions();

  const theme = useTheme();

  // Account menu handler
  const handleAccountClick = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  // Network dropdown handlers
  const handleNetworkClick = (event) => setNetworkEl(event.currentTarget);
  const handleNetworkClose = () => setNetworkEl(null);

  const handleNetworkChange = (value) => {
    setSelectedChain(value);
    handleNetworkClose();
  };

  const handleConnectWallet = async () => {
    try {
      if (!primaryWallet) {
        // If no wallet is connected, show the Dynamic auth modal
        await openWalletSelector();
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
    }
    handleMenuClose();
  };

  const handleDisconnect = () => {
    handleLogOut();
    handleMenuClose();
  };

  // Dynamically create chainOptions from chainConfig
  const chainOptions = Object.entries(chainConfig).map(([key, config]) => ({
    value: key,
    label: config.displayName,
    disabled: key !== defaultNetwork, // Disable options that are not "Sepolia"
  }));

  return (
    <AppBar position="static" color="primary">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          On-Chain FDIC Insurance DApp
        </Typography>
        
        {/* Add the Current Banking Market Popup Link */}
        {user ? (<CurrentBankingMarket />) : null}
        {console.log("user:", user)}

        <ThreeDButton
          label={selectedValue ? `Network: ${selectedValue}` : 'Select Network'}
          onClick={handleNetworkClick}
        />
        <Menu
          id="network-menu"
          anchorEl={networkEl}
          open={Boolean(networkEl)}
          onClose={handleNetworkClose}
        >
          {chainOptions.map((chain) => (
            <MenuItem
              key={chain.value}
              disabled={chain.disabled}
              onClick={() => handleNetworkChange(chain.value)}
            >
              {chain.label}
            </MenuItem>
          ))}
        </Menu>
        <Box flexGrow={.01} />
        {/* Account & Wallet Info */}
        {user ? (
          <ThreeDButton
            label={account ? `${account.slice(0, 6)}...${account.slice(-4)}` : 'Connected'}
            onClick={handleAccountClick}
          />
        ) : (
          // <ThreeDButton
          //   label="Connect Wallet"
          //   onClick={handleConnectWallet}
          // />
          <DynamicWidget />
        )}

        <Menu
          id="account-menu"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          {user ? (
            <div>
              <MenuItem>
                <WalletInfo />
              </MenuItem>
              <MenuItem onClick={handleDisconnect}>Disconnect</MenuItem>
            </div>
          ) : (
            <MenuItem onClick={handleConnectWallet}>Connect Wallet</MenuItem>
          )}
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;

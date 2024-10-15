import React, { useContext, useState } from 'react';
import { BlockchainContext } from './BlockchainProvider';
import { chainConfig } from './chainConfig';
import WalletInfo from './WalletInfo';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import ThreeDButton from './components/ThreeDButton';
import { Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import CurrentBankingMarket from './components/CurrentBankingMarket';

const NavBar = () => {
  const defaultNetwork = "PolygonAmoy";
  const { account, loggedIn, login, logout, selectedChain } = useContext(BlockchainContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const [networkEl, setNetworkEl] = useState(null);
  const [selectedValue, setSelectedChain] = useState(defaultNetwork);

  const theme = useTheme();

  // Account menu handler
  const handleAccountClick = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  // Network dropdown handlers
  const handleNetworkClick = (event) => setNetworkEl(event.currentTarget);
  const handleNetworkClose = () => setNetworkEl(null);

  const handleNetworkChange = (value) => {
    setSelectedChain(value);
    // handleChainChange({ target: { value } });
    handleNetworkClose();
  };

  // Dynamically create chainOptions from chainConfig
  const chainOptions = Object.entries(chainConfig).map(([key, config]) => ({
    value: key,
    label: config.displayName,
    disabled: key !== defaultNetwork, // Disable options that are not "Amoy"
  }));

  return (
    <AppBar position="static" color="primary">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          On-Chain FDIC Insurance DApp
        </Typography>
        
        {/* Add the Current Banking Market Popup Link */}
        {loggedIn ? (<CurrentBankingMarket /> ) : null}

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
        {loggedIn ? (
            <ThreeDButton
            label={account ? `${account.slice(0, 6)}...${account.slice(-4)}` : 'Logged In'}
            onClick={handleAccountClick}
            />
        ) : (
          <ThreeDButton
          label="Login"
          onClick={login}
          />
          )}

        <Menu
          id="account-menu"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          {loggedIn ? (
            <div>
              <MenuItem>
                <WalletInfo />
              </MenuItem>
              <MenuItem onClick={logout}>Logout</MenuItem>
            </div>
          ) : (
            <MenuItem onClick={login}>Login</MenuItem>
          )}
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
import React, { useContext, useState, useEffect } from 'react';
import { BlockchainContext } from './BlockchainProvider';
import { chainConfig } from './chainConfig'; // Import the chainConfig
import WalletInfo from './WalletInfo';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';
import './NavBar.css';

const NavBar = ({ creator }) => {
  const { account, loggedIn, login, logout, selectedChain, handleChainChange } = useContext(BlockchainContext);
  const [isNetworkOpen, setNetworkOpen] = useState(false);

  const toggleNetworkDropdown = () => setNetworkOpen(!isNetworkOpen);


  const defaultNetwork = "PolygonAmoy";

    // Dynamically create chainOptions from chainConfig
    const chainOptions = Object.entries(chainConfig).map(([key, config]) => ({
        value: key,
        label: config.displayName,
        disabled: key !== defaultNetwork, // Disable options that are not "Amoy"
        }));

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <h2>On-Chain FDIC Insurance DApp</h2>
      </div>
        {/* Network Selector */}
        <div className="network-dropdown">
          <button onClick={toggleNetworkDropdown} className="network-dropdown-btn">
            {selectedChain ? `Network: ${selectedChain}` : 'Select Network'}
          </button>
          {isNetworkOpen && (
            <div className="dropdown-menu">
                <select
                    id="network-select"
                    value={selectedChain}
                    onChange={handleChainChange}
                    className="network-dropdown"
                >
                    {chainOptions.map((chain) => (
                    <option key={chain.value} value={chain.value} disabled={chain.disabled}>
                        {chain.label}
                    </option>
                    ))}
                </select>
            </div>
          )}
        </div>


        {/* Wallet Info */}
        <div className="wallet-dropdown">
        {loggedIn  ? <WalletInfo /> : 'No Wallet Connected'}
          {loggedIn && (
            <div className="dropdown-menu">
              {account === creator ? (
                <p className="regulator-info"><strong>Regulator</strong> (Contract Creator)</p>
              ) : (
                <p className="regulator-info">Not the Regulator</p>
              )}
              <button className="logout-btn" onClick={logout}>Logout</button>
            </div>
          )}
          {!loggedIn && (
            <button className="login-btn" onClick={login}>Login</button>
          )}
        </div>
 
    </nav>
  );
};

export default NavBar;
import React, { useContext, useState, useEffect } from 'react';
import { BlockchainContext } from './BlockchainProvider';
import { chainConfig } from './chainConfig'; // Import the chainConfig
import WalletInfo from './WalletInfo';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';
import './NavBar.css';

const NavBar = () => {
  const { provider, loggedIn, login, logout, selectedChain, handleChainChange } = useContext(BlockchainContext);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

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
        {/* Network Selector in Navbar */}
        <div className="network-selector">
          <label htmlFor="network-select" className="network-label">Network:</label>
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

      <div className="navbar-links">
        {loggedIn && provider ? (
          <div className="navbar-wallet">
            <div className="profile-container" onClick={toggleDropdown}>
              <FontAwesomeIcon icon={faUserCircle} className="profile-icon" />
              <span className="profile-text">Wallet</span>
              <div className={`wallet-dropdown ${isDropdownOpen ? 'show' : ''}`}>
                <WalletInfo />
                <button className="logout-button" onClick={logout}>Logout</button>
              </div>
            </div>
          </div>
        ) : (
          <button className="login-button" onClick={login}>
            Login
          </button>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
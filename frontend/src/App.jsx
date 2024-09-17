// src/App.js
import React, { useContext } from 'react';
import { BlockchainProvider, BlockchainContext } from './BlockchainProvider';
import { chainConfig } from './chainConfig'; // Import the chainConfig
import Deposit from './components/Deposit';
import ClaimInsurance from './components/ClaimInsurance';
import './App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faNetworkWired, faMoneyCheckAlt, faShieldAlt } from '@fortawesome/free-solid-svg-icons';

function App() {
  return (
    <BlockchainProvider>
      <MainApp />
    </BlockchainProvider>
  );
}

function MainApp() {
  const {
    provider,
    login,
    logout,
    isLoading,
    selectedChain,
    handleChainChange,
  } = useContext(BlockchainContext);

  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

  // Dynamically create chainOptions from chainConfig
  const chainOptions = Object.entries(chainConfig).map(([key, config]) => ({
    value: key,
    label: config.displayName,
  }));


  const needsLogin = selectedChain !== 'Ganache';

  return (
    <div className="app-container">
    {/* Header Section */}
    <header className="app-header">
      <h1>On-Chain FDIC Insurance DApp</h1>
      <p className="app-description">
        Protect your digital assets with decentralized FDIC-like insurance. Choose a network, deposit funds, and
        claim insurance when needed.
      </p>
      <img className="header-image" src="/assets/insurance.png" alt="Insurance Security" />
    </header>
      
      <section className="info-section">
        <p>
          Welcome to the On-Chain FDIC Insurance DApp. This decentralized application simulates 
          the process of FDIC insurance on the blockchain. FDIC insurance ensures that your bank 
          deposits are protected in case of bank failure, up to a certain amount.
        </p>
        <p>
          This app allows you to interact with blockchain-based banks by depositing funds and 
          claiming insurance in case of failure. Use this app to explore how decentralized 
          finance (DeFi) can provide transparency and trust in banking.
        </p>
      </section>

      {/* Network Selector */}
      <div className="network-section">
        <h2><FontAwesomeIcon icon={faNetworkWired} /> Select Network</h2>
        <div className="network-selector">
          <label htmlFor="network-select">Network:</label>
          <select id="network-select" value={selectedChain} onChange={handleChainChange}>
            {chainOptions.map((chain) => (
              <option key={chain.value} value={chain.value}>
                {chain.label}
              </option>
            ))}
          </select>
          <p>This simulates the environment in which your bank operates.</p>
        </div>
      </div>

      {/* Action Section */}
      <div className="action-section">
        <div className="deposit-claim-container">
      {provider ? (
        <>
          {needsLogin && <button onClick={logout}>Logout</button>}
          <div className="actions">
                <Deposit />
                <ClaimInsurance />
          </div>
        </>
      ) : (
        <>
          <button onClick={login}>
            {needsLogin ? 'Login' : 'Connect to Ganache'}
          </button>
        </>
      )}
    </div>
    </div>
    </div>
  );
}

export default App;
import React, { useContext } from 'react';
import { BlockchainProvider, BlockchainContext } from './BlockchainProvider';
import Deposit from './components/Deposit';
import ClaimInsurance from './components/ClaimInsurance';
import NavBar from './NavBar'; // Import the new NavBar component
import './App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faNetworkWired } from '@fortawesome/free-solid-svg-icons';

function App() {
  return (
    <BlockchainProvider>
      <MainApp />
    </BlockchainProvider>
  );
}

function MainApp() {
  const { isLoading } = useContext(BlockchainContext);


  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }



  return (
    <div className="app-container">
      {/* Top Navigation Bar */}
      <NavBar />

      {/* Header Section */}
      <header className="app-header">
        <h1>On-Chain FDIC Insurance DApp</h1>
        <p className="app-description">
          Protect your digital assets with decentralized FDIC-like insurance. Choose a network, deposit funds, and
          claim insurance when needed.
        </p>
        <img className="header-image" src="/assets/insurance.png" alt="Insurance Security" />
      </header>
      
      {/* Intro Section */}
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


      {/* Action Section */}
      <div className="action-section">
        <div className="actions">
          <Deposit />
          <ClaimInsurance />
        </div>
      </div>
    </div>
  );
}

export default App;
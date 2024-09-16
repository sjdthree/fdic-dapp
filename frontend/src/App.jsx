// src/App.js
import React, { useContext } from 'react';
import { BlockchainProvider, BlockchainContext } from './BlockchainProvider';
import { chainConfig } from './chainConfig'; // Import the chainConfig
import Deposit from './components/Deposit';
import ClaimInsurance from './components/ClaimInsurance';

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
    return <div>Loading...</div>;
  }

  // Dynamically create chainOptions from chainConfig
  const chainOptions = Object.entries(chainConfig).map(([key, config]) => ({
    value: key,
    label: config.displayName,
  }));


  const needsLogin = selectedChain !== 'Ganache';

  return (
    <div className="App">
      <h1>On-Chain FDIC Insurance DApp</h1>
      
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

      <label>
        <strong>Select Network:</strong>
        <select value={selectedChain} onChange={handleChainChange}>
          {chainOptions.map((chain) => (
            <option key={chain.value} value={chain.value}>
              {chain.label}
            </option>
          ))}
        </select>
        <p>This simulates the environment in which your bank operates.</p>
      </label>

      {provider ? (
        <>
          {needsLogin && <button onClick={logout}>Logout</button>}
          <Deposit />
          <ClaimInsurance />
        </>
      ) : (
        <>
          <button onClick={login}>
            {needsLogin ? 'Login' : 'Connect to Ganache'}
          </button>
        </>
      )}
    </div>
  );
}

export default App;
// src/App.js
import React, { useContext } from 'react';
import { BlockchainProvider, BlockchainContext } from './BlockchainProvider';
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

  const chainOptions = [
    { value: 'Ethereum', label: 'Ethereum Mainnet' },
    { value: 'Polygon', label: 'Polygon (Matic)' },
    { value: 'BinanceSmartChain', label: 'Binance Smart Chain' },
    { value: 'Ganache', label: 'Localhost 8545 (Ganache)' },
    // Add more options as needed
  ];

  const needsLogin = selectedChain !== 'Ganache';

  return (
    <div className="App">
      <h1>On-Chain FDIC Insurance DApp</h1>
      <label>
        Select Network:
        <select value={selectedChain} onChange={handleChainChange}>
          {chainOptions.map((chain) => (
            <option key={chain.value} value={chain.value}>
              {chain.label}
            </option>
          ))}
        </select>
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
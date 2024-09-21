# INSTALL.md

# Installation and Deployment Instructions

This document provides detailed instructions to set up, deploy, and run the On-Chain FDIC Insurance DApp on your machine and the Polygon Amoy Testnet.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation Steps](#installation-steps)
  - [1. Clone the Repository](#1-clone-the-repository)
  - [2. Initialize the Git Repository](#2-initialize-the-git-repository)
  - [3. Set Up the Smart Contract](#3-set-up-the-smart-contract)
  - [4. Set Up the Frontend DApp](#4-set-up-the-frontend-dapp)
- [Deployment Instructions](#deployment-instructions)
  - [1. Deploy to Local Blockchain (Ganache)](#1-deploy-to-local-blockchain-ganache)
  - [2. Deploy to Polygon Amoy Testnet](#2-deploy-to-polygon-amoy-testnet)
  - [3. Update Frontend Configuration](#3-update-frontend-configuration)
  - [4. Run the Frontend DApp](#4-run-the-frontend-dapp)
- [MetaMask Configuration](#metamask-configuration)
- [Regulator Actions](#regulator-actions)
- [Troubleshooting](#troubleshooting)
- [Conclusion](#conclusion)

---

## Prerequisites

Ensure you have the following installed:

- **Node.js** (v14 or later)
- **npm** (v6 or later)
- **Truffle** (v5 or later)
- **Ganache CLI** or **Ganache GUI** (for local testing)
- **MetaMask** browser extension
- **Git**

---

## Installation Steps

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/fdic-dapp.git
cd fdic-dapp
```


### 2. Set Up the Smart Contract

#### a. Initialize npm and Install Truffle

```bash
npm init -y
npm install truffle --save-dev
```


### 4. Set Up the Frontend DApp

#### b. Install Dependencies

Navigate to the frontend directory:

```bash
cd frontend
yarn install
```

---

## Deployment Instructions

### 1. Deploy to Local Blockchain (Ganache)

#### a. Start Local Blockchain

If using **Ganache CLI**:

```bash
npm install -g ganache-cli
ganache-cli
```

If using **Ganache GUI**:

- Start a new workspace.

#### b. Compile and Deploy Smart Contract

In the root directory:

```bash
npx truffle compile
npx truffle migrate --network development
```

### 2. Deploy to Polygon Amoy Testnet

#### a. Set Up Environment Variables

Create a `.env` file in the root directory:

```bash
MNEMONIC="your_mnemonic_here"
```

Ensure you replace `your_mnemonic_here` with the mnemonic of your MetaMask wallet that has access to the Polygon Amoy Testnet.

#### b. Compile and Deploy

```bash
npx truffle compile
npx truffle migrate --network polygon_amoy
```

Once deployed, copy the contract address.

### 3. Update Frontend Configuration

#### a. Copy ABI to Frontend

Copy the compiled contract's ABI to the frontend:

```bash
mkdir -p frontend/src/abis
cp build/contracts/OnChainFDIC.json frontend/src/abis/
```

#### b. Update Contract Address in Frontend

In `frontend/src/RegulatorPanel.jsx` and `frontend/src/useFDICContract.js`, update the contract address:

```javascript
const fdicContractAddress = '0xYourDeployedContractAddress'; // Replace with the contract address deployed on Polygon Amoy
```

### 4. Run the Frontend DApp

In the `frontend` directory:

```bash
cd frontend
yarn start
```

Open `http://localhost:5174` in your browser.

---

## MetaMask Configuration

To interact with the deployed contract on **Polygon Amoy Testnet**:

- **Network Name:** Polygon Amoy Testnet
- **RPC URL:** `https://rpc.ankr.com/polygon_amoy`
- **Chain ID:** `80001`
- **Currency Symbol:** MATIC
- **Block Explorer URL:** `https://amoy.polygonscan.com/`

---

## Regulator Actions

Once the contract is deployed and the frontend is set up, the regulator (contract creator) can perform actions via the **Regulator Panel** in the UI.

Alternatively, use the Truffle Console to register banks and mark them as failed:

```bash
npx truffle console --network polygon_amoy
```

In the console:

```javascript
let fdic = await OnChainFDIC.deployed();

// Register a bank
await fdic.registerBank('0xBankAddress', { from: '0xYourRegulatorWalletAddress' });

// Mark a bank as failed
await fdic.failBank('0xBankAddress', { from: '0xYourRegulatorWalletAddress' });
```

---

## Troubleshooting

- **Contract Address Not Found:** Retrieve it from the Truffle console using `fdic.address`.

  ```javascript
  let fdic = await OnChainFDIC.deployed();
  fdic.address;
  ```

- **MetaMask Not Connecting:** Ensure MetaMask is connected to the Polygon Amoy Testnet and has access to the correct wallet.

- **Frontend Issues:** Check the browser console for errors, ensure the correct contract address is used, and verify the network configuration.

---


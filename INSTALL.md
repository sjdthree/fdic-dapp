

# INSTALL.md

# Installation and Deployment Instructions

This document provides detailed instructions to set up and run the On-Chain FDIC Insurance DApp locally on your machine.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation Steps](#installation-steps)
  - [1. Clone the Repository](#1-clone-the-repository)
  - [2. Initialize the Git Repository](#2-initialize-the-git-repository)
  - [3. Set Up the Smart Contract](#3-set-up-the-smart-contract)
  - [4. Set Up the Frontend DApp](#4-set-up-the-frontend-dapp)
- [Deployment Instructions](#deployment-instructions)
  - [1. Start the Local Blockchain](#1-start-the-local-blockchain)
  - [2. Compile and Deploy the Smart Contract](#2-compile-and-deploy-the-smart-contract)
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
- **Ganache CLI** or **Ganache GUI**
- **MetaMask** browser extension
- **Git**

---

## Installation Steps

### 1. Clone the Repository

If you have a remote repository:

```bash
git clone https://github.com/yourusername/fdic-dapp.git
cd fdic-dapp
```

If you don't have a remote repository, create the project directory manually:

```bash
mkdir fdic-dapp
cd fdic-dapp
```

### 2. Initialize the Git Repository

If you created the directory manually:

```bash
git init
git add .
git commit -m "Initial commit of On-Chain FDIC Insurance DApp"
```

### 3. Set Up the Smart Contract

#### a. Initialize npm and Install Truffle

```bash
npm init -y
npm install truffle --save-dev
```

#### b. Initialize Truffle Project

```bash
npx truffle init
```

#### c. Add the Smart Contract

- Create a file named `OnChainFDIC.sol` inside the `contracts` directory:

  ```bash
  touch contracts/OnChainFDIC.sol
  ```

- Copy and paste the smart contract code into `OnChainFDIC.sol`.

#### d. Update Migration Script

In `migrations/1_initial_migration.js`:

```javascript
const OnChainFDIC = artifacts.require("OnChainFDIC");

module.exports = function (deployer) {
  deployer.deploy(OnChainFDIC);
};
```

#### e. Configure Truffle

In `truffle-config.js`:

```javascript
module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545, // Make sure this matches your Ganache port
      network_id: "*",
    },
  },
  compilers: {
    solc: {
      version: "0.8.0",
    },
  },
};
```

### 4. Set Up the Frontend DApp

#### a. Create the React App

```bash
npx create-react-app frontend
```

#### b. Install Dependencies

Navigate to the frontend directory:

```bash
cd frontend
npm install ethers@^6.0.0
```

---

## Deployment Instructions

### 1. Start the Local Blockchain

#### Using Ganache CLI

```bash
npm install -g ganache-cli
ganache-cli
```

#### Using Ganache GUI

- Download and install [Ganache GUI](https://trufflesuite.com/ganache/).
- Start a new workspace.

### 2. Compile and Deploy the Smart Contract

Back in the project root:

```bash
cd ../ # Ensure you're in the root directory
npx truffle compile
npx truffle migrate --network development
```

### 3. Update Frontend Configuration

Copy the compiled contract's ABI to the frontend:

```bash
mkdir -p frontend/src/abis
cp build/contracts/OnChainFDIC.json frontend/src/abis/
```

In `frontend/src/useFDICContract.js`, update the contract address:

```javascript
const contractAddress = '0xYourDeployedContractAddress'; // Replace with actual address
```

### 4. Run the Frontend DApp

Navigate to the frontend directory and start the React app:

```bash
cd frontend
npm start
```

Open `http://localhost:3000` in your browser.

---

## MetaMask Configuration

- **Network Name:** Localhost 8545
- **RPC URL:** `http://127.0.0.1:8545`
- **Chain ID:** `1337` (or as specified by Ganache)
- **Currency Symbol:** ETH (optional)
- **Block Explorer URL:** Leave blank

Import accounts from Ganache into MetaMask using the private keys provided by Ganache.

---

## Regulator Actions

Use Truffle Console to register banks and mark them as failed.

```bash
npx truffle console --network development
```

In the console:

```javascript
// Get the deployed contract instance
let fdic = await OnChainFDIC.deployed();

// Get accounts from Ganache
let accounts = await web3.eth.getAccounts();

// Register a bank (e.g., accounts[1])
await fdic.registerBank(accounts[1], { from: accounts[0] });

// Fail a bank
await fdic.failBank(accounts[1], { from: accounts[0] });
```

---

## Troubleshooting

- **Contract Address Not Found:** Retrieve it from the Truffle console using `fdic.address`.

  ```javascript
  let fdic = await OnChainFDIC.deployed();
  fdic.address;
  ```

- **MetaMask Not Connecting:** Ensure MetaMask is connected to `Localhost 8545` and accounts are imported.

- **Compilation Errors:** Ensure dependencies are installed and versions are compatible.

- **Frontend Not Displaying Correctly:** Check the browser console for errors and ensure all components are correctly imported and rendered.

---

## Conclusion

You have successfully installed and deployed the On-Chain FDIC Insurance DApp. You can now interact with the smart contract using the frontend interface. Remember, this project is for educational purposes and should not be used in production environments.

If you encounter any issues, feel free to refer back to this guide or reach out for assistance.

---

**Happy Coding!**
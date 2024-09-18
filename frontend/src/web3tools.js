// src/web3Tools.js
import { ethers } from "ethers";
import Web3 from "web3";

// Function to get user accounts using ethers.js
export const getAccounts = async (provider) => {
  if (!provider) {
    console.log("Provider not initialized yet");
    return;
  }

  try {
    const ethersProvider = provider;
    const signer = await ethersProvider.getSigner();
    const address = await signer.getAddress();
    console.log("User Account:", address);
    return address;
  } catch (error) {
    console.error("Error getting account:", error);
  }
};

// Function to get user's balance in ether using ethers.js
export const getBalance = async (provider) => {
  if (!provider) {
    console.log("Provider not initialized yet");
    return;
  }

  try {
    const ethersProvider = provider;
    const signer = await ethersProvider.getSigner();
    const address = await signer.getAddress();
    const balance = ethers.formatEther(await ethersProvider.getBalance(address)); // Balance in ether
    console.log("User Balance:", balance);
    return balance;
  } catch (error) {
    console.error("Error getting balance:", error);
  }
};

// Function to sign a message using ethers.js
export const signMessage = async (provider, message = "YOUR_MESSAGE") => {
  if (!provider) {
    console.log("Provider not initialized yet");
    return;
  }

  try {
    const ethersProvider = new ethers.BrowserProvider(provider);
    const signer = await ethersProvider.getSigner();
    const signedMessage = await signer.signMessage(message);
    console.log("Signed Message:", signedMessage);
    return signedMessage;
  } catch (error) {
    console.error("Error signing message:", error);
  }
};

// Function to sign a transaction using Web3.js
export const signTransaction = async (provider) => {
  if (!provider) {
    console.log("Provider not initialized yet");
    return;
  }

  try {
    const web3 = new Web3(provider);
    const accounts = await web3.eth.getAccounts();
    const txRes = await web3.eth.signTransaction({
      from: accounts[0],
      to: accounts[0],
      value: web3.utils.toWei("0.0001", "ether"),
      chainId: 1, // Change this to your specific chain ID
    });
    console.log("Transaction Hash:", txRes.transactionHash);
    return txRes;
  } catch (error) {
    console.error("Error signing transaction:", error);
  }
};

// Function to send a transaction using ethers.js
export const sendTransaction = async (provider) => {
  if (!provider) {
    console.log("Provider not initialized yet");
    return;
  }

  try {
    const ethersProvider = new ethers.BrowserProvider(provider);
    const signer = await ethersProvider.getSigner();
    const destination = "0x40e1c367Eca34250cAF1bc8330E9EddfD403fC56"; // Example destination address
    const amount = ethers.parseEther("0.001"); // Convert 0.001 ether to wei

    const tx = await signer.sendTransaction({
      to: destination,
      value: amount,
      maxPriorityFeePerGas: "5000000000", // Max priority fee per gas
      maxFeePerGas: "6000000000000", // Max fee per gas
    });

    const receipt = await tx.wait(); // Wait for transaction to be mined
    console.log("Transaction Hash:", receipt.transactionHash);
    return receipt;
  } catch (error) {
    console.error("Error sending transaction:", error);
  }
};
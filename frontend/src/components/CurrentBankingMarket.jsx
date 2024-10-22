import React, { useState, useEffect, useContext } from 'react';
import { BlockchainContext } from '../BlockchainProvider';
import { ethers } from 'ethers';
import { Button, Modal, Typography, Box, List, ListItem, ListItemText, Divider, Paper, CircularProgress, Table, TableBody, TableCell, TableHead, TableRow, TableContainer } from '@mui/material';
import ERC20FDIC from '../abis/ERC20FDIC.json'; // Your contract ABI
import { toast } from 'react-toastify';

const FDICContractAddress = import.meta.env.VITE_FDIC_CONTRACT_ADDRESS;
const USDCTokenAddress = import.meta.env.VITE_DEFAULT_TOKEN_ADDRESS;

const CurrentBankingMarket = () => {
  const { provider } = useContext(BlockchainContext);
  const [banks, setBanks] = useState([]);
  const [failedBanks, setFailedBanks] = useState([]);
  const [regulators, setRegulators] = useState([]);
  const [insurancePoolBalance, setInsurancePoolBalance] = useState('');
  const [isModalOpen, setModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    if (provider) {
      fetchContractData();
    } else {
      console.log('Provider is not initialized.');
    }
  }, [provider]);
  
  const fetchContractData = async () => {
    setIsLoading(true);
    try {
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(FDICContractAddress, ERC20FDIC.abi, signer);

      // Fetch banks
      const bankList = await contract.getBanks();
      setBanks(bankList);

      // Fetch failed banks
      const failedBankList = await contract.getFailedBanks();
      setFailedBanks(failedBankList);

      // Fetch regulators
      const regulatorList = await contract.getRegulators();
      setRegulators(regulatorList);

      // Fetch insurance pool balance
      const balance = await contract.getInsurancePoolBalance();
      setInsurancePoolBalance(ethers.formatEther(balance));
    } catch (error) {
      console.error('Error fetching contract data:', error);
      toast.error('Failed to fetch contract data');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);

  return (
    <div>
      <Button onClick={handleOpenModal} variant="outlined">
        Current Banking Market
      </Button>
      <Modal open={isModalOpen} onClose={handleCloseModal}>
        <Paper sx={{ width: '80%', margin: 'auto', marginTop: '5%', padding: '20px', maxHeight: '90vh', overflowY: 'auto' }}>
          <Typography variant="h4" gutterBottom>
            Current Banking Market
          </Typography>
          <Divider />

          {isLoading ? (
            <Box display="flex" justifyContent="center" alignItems="center" sx={{ minHeight: '200px' }}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              <Typography variant="h6">FDIC Contract Address: {FDICContractAddress}</Typography>
              <Typography variant="h6">USDC Token Address: {USDCTokenAddress}</Typography>
              <Divider />

              {/* Insurance Pool Balance */}
              <Typography variant="h5" gutterBottom>
                Total Insured Pool Balance: {insurancePoolBalance} USDC
              </Typography>

              {/* Banks */}
              <Typography variant="h6" gutterBottom>
                Registered Banks
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Bank Address</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {banks.length > 0 ? (
                      banks.map((bank, index) => (
                        <TableRow key={index}>
                          <TableCell>{bank}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell>No registered banks found.</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>

              <Divider />

              {/* Failed Banks */}
              <Typography variant="h6" gutterBottom>
                Failed Banks
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Failed Bank Address</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {failedBanks.length > 0 ? (
                      failedBanks.map((bank, index) => (
                        <TableRow key={index}>
                          <TableCell>{bank}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell>No failed banks currently.</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>

              <Divider />

              {/* Regulators */}
              <Typography variant="h6" gutterBottom>
                Regulators
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Regulator Address</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {regulators.map((regulator, index) => (
                      <TableRow key={index}>
                        <TableCell>{regulator}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          )}

          <Button onClick={handleCloseModal} variant="contained" color="primary" sx={{ marginTop: 2 }}>
            Close
          </Button>
        </Paper>
      </Modal>
    </div>
  );
};

export default CurrentBankingMarket;
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import { Block, CheckCircle } from '@mui/icons-material';

function BankStatusGrid({ banks, failedBanks, isCorrectWallet, failBank, unfailBank }) {
  const [bankStatus, setBankStatus] = useState([]);

  useEffect(() => {
    const statuses = banks.map((bank) =>
        failedBanks.includes(bank) ? 'Failed' : 'Good'
      );
      setBankStatus(statuses);
  }, [banks, failedBanks]);


  const handleStatusChange = async (bankAddress, index) => {
    console.log(" inside handlestatuschange: ", bankStatus)
    try {
      if (bankStatus[index] === 'Good') {
        // Call your function to fail the bank
        await failBank(bankAddress);
        // Update the failedBanks array
        setBankStatus((prevStatus) =>
          prevStatus.map((status, idx) =>
            idx === index ? 'Failed' : status
          )
        );
      } else {
        // Call your function to unfail the bank
        await unfailBank(bankAddress);
        // Update the failedBanks array
        setBankStatus((prevStatus) =>
          prevStatus.map((status, idx) =>
            idx === index ? 'Good': status
          )
        );
      }
    } catch (error) {
      console.error('Error updating bank status:', error);
    }
  };

  return (
    <Box mb={4}>
      <Typography variant="h5" gutterBottom>
        Bank Status Overview
      </Typography>
      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="center"><strong>Bank Address</strong></TableCell>
              <TableCell align="center"><strong>Status</strong></TableCell>
              <TableCell align="center"><strong>Action</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {banks.length > 0 ? (
              banks.map((bank, index) => {
                const status = bankStatus[index];
                return (
                  <TableRow key={bank}>
                    <TableCell align="center">{bank}</TableCell>
                    <TableCell align="center">
                      <Chip
                        icon={
                          status === 'Good' ? (
                            <CheckCircle />
                          ) : (
                            <Block />
                          )
                        }
                        label={status}
                        color={status === 'Good' ? 'success' : 'error'}
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Button
                        variant="contained"
                        color={status === 'Good' ? 'error' : 'success'}
                        onClick={() => {
                            if (status !== 'Good') {
                              unfailBank(bank);
                            } else {
                              failBank(bank);
                            }
                          }}
                        disabled={!isCorrectWallet}
                        startIcon={
                          status === 'Good' ? (
                            <Block />
                          ) : (
                            <CheckCircle />
                          )
                        }
                      >
                        {status === 'Good' ? 'Fail Bank' : 'Unfail Bank'}
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell align="center" colSpan={3}>
                  No banks found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default BankStatusGrid;
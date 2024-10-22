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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TableRow,
  Paper,
  Popover,
  IconButton,
} from '@mui/material';
import HelpOutlineIcon from "@mui/icons-material/HelpOutline"; // Icon for help
import { Block, CheckCircle } from '@mui/icons-material';

function BankStatusGrid({ banks, failedBanks, isCorrectWallet, failBank, unfailBank, regulators, insurancePoolBalance }) {
  const [bankStatus, setBankStatus] = useState([]);

  // State for Popovers
  const [anchorEl, setAnchorEl] = useState(null);
  const [popoverContent, setPopoverContent] = useState("");

  const open = Boolean(anchorEl);
  
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

    // Function to open the popover
    const handlePopoverOpen = (event, content) => {
      setAnchorEl(event.currentTarget);
      setPopoverContent(content);
    };
  
    // Function to close the popover
    const handlePopoverClose = () => {
      setAnchorEl(null);
      setPopoverContent("");
    };
  
  return (
    <Box mb={4}>
      <Typography variant="h5" gutterBottom>
        Bank Status Overview
      </Typography>
      <Typography variant="body1" gutterBottom>
            Total Insured Pool Balance: {insurancePoolBalance} USDC
            <IconButton
              onClick={(e) =>
                handlePopoverOpen(
                  e,
                  "This is the current balance of the insurance pool."
                )
              }
            >
              <HelpOutlineIcon fontSize="small" />
            </IconButton>
          </Typography>
        All Current Regulators
        <Box mb={4} display="flex" alignItems="center" justifyContent="center">
          {regulators && regulators.length > 0 ? (
            <FormControl variant="outlined" fullWidth>
              <InputLabel id="regulator-label">
                All Current Regulators
              </InputLabel>
              <Select
                labelId="regulator-label"
                value={regulators[0] || ""}
                label="Other Current Regulators"
                // disabled
                sx={{
                  backgroundColor: "#f5f5f5",
                  borderRadius: "8px",
                }}
              >
                {regulators.map((regulator) => (
                  <MenuItem key={regulator} value={regulator}>
                    {regulator}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          ) : (
            <Typography variant="h6" color="textSecondary">
              No regulators found.
            </Typography>
          )}
        </Box>
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

        {/* Popover for Help */}
        <Popover
          open={open}
          anchorEl={anchorEl}
          onClose={handlePopoverClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <Typography sx={{ p: 2 }}>{popoverContent}</Typography>
        </Popover>
    </Box>
  );
}

export default BankStatusGrid;
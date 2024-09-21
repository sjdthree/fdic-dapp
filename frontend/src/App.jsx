import React, { useContext } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { BlockchainProvider, BlockchainContext } from './BlockchainProvider';
import Deposit from './components/Deposit';
import ClaimInsurance from './components/ClaimInsurance';
import RegulatorPanel from './components/RegulatorPanel';
import NavBar from './NavBar'; // Import the new NavBar component
import './App.css';
const theme = createTheme({
  palette: {
    primary: {
      main: '#1a237e',  // Dark blue for the top bar and other primary elements
    },
    secondary: {
      main: '#03a9f4',  // Light blue for buttons and highlights
    },
    background: {
      default: '#f5f5f5',  // Soft gray background for the entire app
      paper: '#ffffff',  // White background for form elements
    },
    text: {
      primary: '#212121',  // Dark text for contrast in light sections
      secondary: '#ffffff',  // White text for buttons and dark background elements
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    fontSize: 14,
    button: {
      textTransform: 'none',  // No uppercase for buttons for a modern look
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          color: '#ffffff',  // White text for buttons
          backgroundColor: '#0d47a1',  // Light blue button background
          '&:hover': {
            backgroundColor: '#0288d1',  // Slightly darker blue on hover
          },
          borderRadius: '8px',  // Rounded buttons
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#1a237e',  // Dark blue top bar
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        select: {
          color: '#212121',  // Dark text for dropdown options to contrast white background
          backgroundColor: '#ffffff',  // White background for dropdowns
        },
        icon: {
          color: '#212121',  // Dark icon for the dropdown arrow
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff',  // White background for input fields
          color: '#212121',  // Dark text for contrast
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          color: '#212121',  // Dark text for dropdown menu items
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff',  // White background for dropdowns and menus
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <BlockchainProvider>
        <Router>
          <NavBar /> {/* Add NavBar here to be available on all routes */}
          <Routes>
            <Route path="/" element={<MainApp />} />
            <Route path="/regulator" element={<RegulatorPanel />} />
          </Routes>
        </Router>
      </BlockchainProvider>
    </ThemeProvider>
  );
}

function MainApp() {
  const { isLoading } = useContext(BlockchainContext);


  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }



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
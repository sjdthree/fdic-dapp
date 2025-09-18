import React, { useContext } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { BlockchainProvider, BlockchainContext } from './BlockchainProvider';
import Deposit from './components/Deposit';
import ClaimInsurance from './components/ClaimInsurance';
import RegulatorPanel from './components/RegulatorPanel';
import NavBar from './NavBar';
import './App.css';
import { LoadingProvider } from './LoadingContext';
import LoadingOverlay from './components/LoadingOverlay';
import ToastNotifications from './components/ToastNotifications';
import { CircularProgress } from '@mui/material';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1a237e',
    },
    secondary: {
      main: '#03a9f4',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
    text: {
      primary: '#212121',
      secondary: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    fontSize: 14,
    button: {
      textTransform: 'none',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          color: '#ffffff',
          backgroundColor: '#0d47a1',
          '&:hover': {
            backgroundColor: '#0288d1',
          },
          borderRadius: '8px',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#1a237e',
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        select: {
          color: '#212121',
          backgroundColor: '#ffffff',
        },
        icon: {
          color: '#212121',
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff',
          color: '#212121',
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          color: '#212121',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff',
        },
      },
    },
  },
});

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('App Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-container">
          <h2>Something went wrong.</h2>
          <button onClick={() => window.location.reload()}>Refresh Page</button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Loading Component
const LoadingSpinner = () => (
  <div className="loading-container">
    <CircularProgress size={40} />
    <p>Loading application...</p>
  </div>
);

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider theme={theme}>
        <BlockchainProvider>
          <Router>
            <LoadingProvider>
              <NavBar />
              <LoadingOverlay open={false}/>
              <ToastNotifications />
              <Routes>
                <Route path="/" element={<MainApp />} />
                <Route path="/regulator" element={<RegulatorPanel />} />
              </Routes>
            </LoadingProvider>
          </Router>
        </BlockchainProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

function MainApp() {
  const { isLoading } = useContext(BlockchainContext);

  if (isLoading) {
    return <LoadingSpinner />;
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

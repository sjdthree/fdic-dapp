import React from 'react';
import { CircularProgress, Backdrop, Box, Typography } from '@mui/material';
import StepperProgress from './StepperProgress'; // Import your stepper

// Define the color themes
const themes = {
  softLight: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)', // semi-transparent white
    color: '#007BFF', // bright blue
  },
  elegantGray: {
    backgroundColor: 'rgba(240, 240, 240, 0.1)', // light gray
    color: '#333333', // dark charcoal
  },
  darkTranslucent: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)', // semi-transparent black
    color: '#FFFFFF', // pure white
  },
  modernBlueTint: {
    backgroundColor: 'rgba(0, 123, 255, 0.1)', // semi-transparent blue
    color: '#F8F9FA', // light grayish-white
  },
  warmSoftContrast: {
    backgroundColor: 'rgba(255, 235, 205, 0.9)', // light peach
    color: '#555555', // medium gray
  },
};

const LoadingOverlay = ({ open, currentStep = 0, steps = [], theme = 'darkTranslucent' }) => {
  // Get the selected theme styles
  const selectedTheme = themes[theme] || themes.softLight;

  return (
    <Backdrop
      sx={{
        backgroundColor: selectedTheme.backgroundColor,
        color: selectedTheme.color,
        zIndex: 1300,
      }}
      open={open}
    >
      <Box sx={{ textAlign: 'center' }}>
        {/* Only show StepperProgress if there are steps */}
        {steps.length > 0 && <StepperProgress currentStep={currentStep} steps={steps} />}

        {/* Spinner */}
        <CircularProgress sx={{ marginTop: 2, color: selectedTheme.color }} />

        {/* Optionally, show step progress as text */}
        <Typography variant="h6" sx={{ marginTop: 2 }}>
          {steps.length > 0
            ? currentStep < steps.length
              ? `Step ${currentStep + 1} of ${steps.length}`
              : 'Processing...'
            : 'Processing...'}
        </Typography>
      </Box>
    </Backdrop>
  );
};

export default LoadingOverlay;
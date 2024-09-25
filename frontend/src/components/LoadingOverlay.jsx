import React from 'react';
import { CircularProgress, Backdrop, Box, Typography } from '@mui/material';
import StepperProgress from './StepperProgress'; // Import your stepper

const LoadingOverlay = ({ open, currentStep = 0, steps = [] }) => {
  return (
    <Backdrop sx={{ color: '#fff', zIndex: 1300 }} open={open}>
      <Box sx={{ textAlign: 'center' }}>
        {/* Only show StepperProgress if there are steps */}
        {steps.length > 0 && <StepperProgress currentStep={currentStep} steps={steps} />}

        {/* Spinner */}
        <CircularProgress sx={{ marginTop: 2 }} />

        {/* Optionally, show step progress as text */}
        {steps.length > 0 ? (
          <Typography variant="h6" sx={{ marginTop: 2 }}>
            {currentStep < steps.length ? `Step ${currentStep + 1} of ${steps.length}` : 'Processing...'}
          </Typography>
        ) : (
          <Typography variant="h6" sx={{ marginTop: 2 }}>
            Processing...
          </Typography>
        )}
      </Box>
    </Backdrop>
  );
};

export default LoadingOverlay;
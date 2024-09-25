import React from 'react';
import { Stepper, Step, StepLabel } from '@mui/material';

const StepperProgress = ({ currentStep, steps }) => {
  return (
    <Stepper activeStep={currentStep} alternativeLabel>
      {steps.map((label, index) => (
        <Step key={index}>
          <StepLabel>{label}</StepLabel>
        </Step>
      ))}
    </Stepper>
  );
};

export default StepperProgress;
// src/components/ThreeDButton.jsx
import React from 'react';
import { Button } from '@mui/material';

const ThreeDButton = ({ label, onClick }) => {
  return (
    <Button
      variant="contained"
      onClick={onClick}
      sx={{
        backgroundColor: '#03a9f4', // Main color
        color: '#fff',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', // 3D effect using shadow
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          backgroundColor: '#0288d1', // Slightly darker on hover
          boxShadow: '0 6px 12px rgba(0, 0, 0, 0.2)', // Deeper shadow on hover
          transform: 'translateY(-2px)', // Lifts the button slightly
        },
        '&:active': {
          backgroundColor: '#0277bd', // Even darker when clicked
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', // Reduced shadow to make it look pressed
          transform: 'translateY(2px)', // Press effect
        },
      }}
    >
      {label}
    </Button>
  );
};

export default ThreeDButton;
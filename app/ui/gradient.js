import React from 'react';
import { Typography } from '@mui/material';

const GradientText = ({ children, variant = 'h4' }) => {
    const gradientStyle = {
      background: 'linear-gradient(to right, #6C584C, #A98467)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      fontWeight: 'bold',
    };
  
    return (
      <Typography variant={variant} style={gradientStyle}>
        {children}
      </Typography>
    );
  };
  
  export default GradientText;

// components/AuthForm.js
import { useState } from 'react';
import { Box, TextField, Button, Typography, Alert } from '@mui/material';

export default function AuthForm({ formType, onSubmit, errorMessage }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formType === 'signup' && password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    onSubmit({ email, password });
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center" mt={4}>
      <Typography variant="h4" mb={2}>
        {formType === 'login' ? 'Login' : 'Sign Up'}
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Email"
          variant="outlined"
          type="email"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          label="Password"
          variant="outlined"
          type="password"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {formType === 'signup' && (
          <TextField
            label="Confirm Password"
            variant="outlined"
            type="password"
            fullWidth
            margin="normal"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        )}
        <Button type="submit" variant="contained" color="primary" fullWidth>
          {formType === 'login' ? 'Login' : 'Sign Up'}
        </Button>
      </form>
      {errorMessage && <Alert severity="error" sx={{ mt: 2 }}>{errorMessage}</Alert>}
    </Box>
  );
}

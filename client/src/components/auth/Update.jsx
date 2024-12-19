import React, { useState } from 'react';
import userService from '../../services/user';
import LoaderPrimary from '../loadings/LoaderPrimary';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  Box,
  TextField,
  Container,
  Grid,
  Button,
  IconButton,
  InputAdornment
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

export default function UpdatePassword() {
  const [isLoading, setIsLoading] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(undefined);

  const navigate = useNavigate();

  const handleClickShowNewPassword = () => setShowNewPassword((prev) => !prev);

  const handleClickShowConfirmPassword = () =>
    setShowConfirmPassword((prev) => !prev);

  const handleNewPassword = (e) => {
    setNewPassword(e.target.value);
    if (error && (error.includes('New') || error.includes('characters'))) {
      setError(undefined);
      setIsLoading(false);
  }
  };

  const handleConfirmPassword = (e) => {
    setConfirmPassword(e.target.value);
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const requestBody = { newPassword };
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    try {
      const response = await userService.updatePassword(requestBody);
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => {
        toast.success(response.data.message);
      }, 1000);
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (error) {
      setIsLoading(false);
      setError(error.response.data.message)
      toast.error(error.response.data.message);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        component="form"
        onSubmit={handleUpdatePassword}
        noValidate
        autoComplete="off"
      >
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              type={showNewPassword ? 'text' : 'password'}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label={
                        showNewPassword ? 'Hide password' : 'Show password'
                      }
                      onClick={handleClickShowNewPassword}
                    >
                      {showNewPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              error={error}
              fullWidth
              required
              value={newPassword}
              onChange={handleNewPassword}
              margin="dense"
              name="newPassword"
              label="New Password"
              variant="outlined"
              helperText={error && (error.includes('New') || error.includes('characters')) ? error : null}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              type={showConfirmPassword ? 'text' : 'password'}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label={
                        showConfirmPassword ? 'Hide password' : 'Show password'
                      }
                      onClick={handleClickShowConfirmPassword}
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              error={error}
              fullWidth
              required
              value={confirmPassword}
              onChange={handleConfirmPassword}
              margin="dense"
              name="confirmPassword"
              label="Confirm Password"
              variant="outlined"
              helperText={error}
            />
          </Grid>
        </Grid>
        <Box
          sx={{ mt: 5, mb: 3 }}
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Button
            disabled={isLoading}
            variant="secondary"
            onClick={() => navigate(-1)}
          >
            Back
          </Button>
          {isLoading ? (
            <Button disabled>
              <LoaderPrimary />
            </Button>
          ) : (
            <Button type="submit">Update</Button>
          )}
        </Box>
      </Box>
    </Container>
  );
}

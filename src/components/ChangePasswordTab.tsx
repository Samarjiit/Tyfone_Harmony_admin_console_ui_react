/**
 * Change Password Tab — two-step password change process
 * Uses MUI form components for consistency with the project's form library
 * Step 1: Validate current password
 * Step 2: Enter and confirm new password with policy validation
 */
import { useState, useEffect } from 'react';
import { Box, TextField, Button, Alert, IconButton } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { http } from '../services/http';
import { uiColors, formColors } from '../constants/colors';

interface ChangePasswordTabProps {
  passwordPolicy?: string;
}

export default function ChangePasswordTab({ passwordPolicy }: ChangePasswordTabProps) {
  const [step, setStep] = useState<'validate' | 'enter'>('validate');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [policyHtml, setPolicyHtml] = useState<string>('');

  useEffect(() => {
    if (passwordPolicy) {
      try {
        const decoded = atob(passwordPolicy);
        setPolicyHtml(decoded);
      } catch (error) {
        console.error('Error decoding password policy:', error);
      }
    }
  }, [passwordPolicy]);

  const handleValidatePassword = async () => {
    setErrorMessage('');

    if (!currentPassword.trim()) {
      setErrorMessage('Please enter your current password.');
      return;
    }

    try {
      setLoading(true);

      const response = await http.post('/validate_my_password', {
        password: currentPassword,
      });

      if (response.data.code === '200') {
        setStep('enter');
        setErrorMessage('');
      } else if (response.data.code === '11016') {
        window.location.href = '/account_locked';
      } else if (response.data.code === '900') {
        setErrorMessage(
          response.data.response?.error || 'Invalid password. Please try again.'
        );
      } else {
        setErrorMessage(response.data.message || 'Unable to validate password.');
      }
    } catch (error) {
      setErrorMessage('Unable to process your request. Please try again later.');
      console.error('Error validating password:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    setErrorMessage('');

    if (!newPassword.trim()) {
      setErrorMessage('Please enter your new password.');
      return;
    }

    if (!confirmPassword.trim()) {
      setErrorMessage('Please enter your confirm password.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage('Entries do not match. Please ensure you enter the same values.');
      return;
    }

    if (newPassword === currentPassword) {
      setErrorMessage('New password has to be different from current password.');
      return;
    }

    try {
      setLoading(true);

      const response = await http.post('/update_my_password', {
        newpassword: newPassword,
        confirmPassword: confirmPassword,
      });

      if (response.data.code === '0') {
        setSuccessMessage(response.data.message || 'Password changed successfully.');
        setTimeout(() => {
          window.location.href = '/my_profile';
        }, 2000);
      } else if (response.data.code === '900') {
        setErrorMessage(response.data.response?.error || 'Unable to change password.');
      } else {
        setErrorMessage(response.data.message || 'Unable to change password.');
      }
    } catch (error) {
      setErrorMessage('Unable to process your request. Please try again later.');
      console.error('Error changing password:', error);
    } finally {
      setLoading(false);
    }
  };

  const textFieldSx = {
    '& .MuiOutlinedInput-root': {
      backgroundColor: '#ffffff',
      '& fieldset': {
        borderColor: formColors.inputBorder,
      },
      '&:hover fieldset': {
        borderColor: formColors.inputBorder,
      },
      '&.Mui-focused fieldset': {
        borderColor: '#7aa7d9',
        borderWidth: '1px',
      },
    },
    '& .MuiOutlinedInput-input': {
      color: uiColors.text.primary,
      fontSize: '13px',
      padding: '10px 12px',
    },
  };

  return (
    <Box sx={{ padding: '10px 0' }}>
      {/* Success Alert */}
      {successMessage && (
        <Alert severity="success" sx={{ marginBottom: '20px' }}>
          {successMessage}
        </Alert>
      )}

      {/* Error Alert */}
      {errorMessage && (
        <Alert severity="error" sx={{ marginBottom: '20px' }}>
          {errorMessage}
        </Alert>
      )}

      {/* Step 1: Validate Current Password */}
      {step === 'validate' && (
        <Box sx={{ maxWidth: '600px' }}>
          <Box component="form" id="formValidateCurrentPassword" autoComplete="off">
            <Box sx={{ marginBottom: '20px' }}>
              <label style={{ fontWeight: 'bold', fontSize: '14px', color: uiColors.text.primary }}>
                To change your password, please authenticate again.
              </label>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '20px' }}>
              <Box sx={{ width: '150px', minWidth: '150px' }}>
                <label id="currentPasswordTag" style={{ fontWeight: 600, fontSize: '13px', color: uiColors.text.primary }}>
                  Current Password
                </label>
              </Box>
              <Box sx={{ width: '300px', position: 'relative' }}>
                <TextField
                  id="currentPasswordInput"
                  name="password"
                  type={showCurrentPassword ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  variant="outlined"
                  size="small"
                  fullWidth
                  autoComplete="off"
                  sx={textFieldSx}
                  InputProps={{
                    endAdornment: (
                      <IconButton
                        type="button"
                        id="togglePassword"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        edge="end"
                        size="small"
                        sx={{ position: 'absolute', right: '4px' }}
                      >
                        {showCurrentPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    ),
                  }}
                />
              </Box>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
              <Box sx={{ width: '150px', minWidth: '150px' }}></Box>
              <Button
                id="proceedButton"
                type="button"
                variant="contained"
                onClick={handleValidatePassword}
                disabled={loading}
                sx={{
                  backgroundColor: uiColors.chart.title,
                  color: '#fff',
                  textTransform: 'none',
                  padding: '8px 24px',
                  fontSize: '13px',
                  fontWeight: 500,
                  '&:hover': {
                    backgroundColor: '#2a5494',
                  },
                  '&:disabled': {
                    opacity: 0.6,
                  },
                }}
              >
                {loading ? 'Verifying...' : 'Proceed'}
              </Button>
            </Box>
          </Box>
        </Box>
      )}

      {/* Step 2: Enter New Password */}
      {step === 'enter' && (
        <Box sx={{ display: 'flex', gap: '40px' }}>
          {/* Left side: Password input fields */}
          <Box sx={{ flex: 1, maxWidth: '500px' }}>
            <Box component="form" id="formenternewpassword" autoComplete="off">
              <Box sx={{ marginBottom: '20px' }}>
                <label style={{ fontWeight: 'bold', fontSize: '14px', color: uiColors.text.primary }}>
                  Enter New Password
                </label>
              </Box>

              {/* New Password */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '20px' }}>
                <Box sx={{ width: '150px', minWidth: '150px' }}>
                  <label id="newPasswordTag" style={{ fontWeight: 600, fontSize: '13px', color: uiColors.text.primary }}>
                    New Password
                  </label>
                </Box>
                <Box sx={{ width: '300px', position: 'relative' }}>
                  <TextField
                    id="newPasswordInput"
                    name="newpassword"
                    type={showNewPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    variant="outlined"
                    size="small"
                    fullWidth
                    autoComplete="off"
                    sx={textFieldSx}
                    InputProps={{
                      endAdornment: (
                        <IconButton
                          type="button"
                          id="newtogglePassword"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          edge="end"
                          size="small"
                          sx={{ position: 'absolute', right: '4px' }}
                        >
                          {showNewPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      ),
                    }}
                  />
                </Box>
              </Box>

              {/* Confirm Password */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '20px' }}>
                <Box sx={{ width: '150px', minWidth: '150px' }}>
                  <label id="newPasswordConfirmTag" style={{ fontWeight: 600, fontSize: '13px', color: uiColors.text.primary }}>
                    Confirm Password
                  </label>
                </Box>
                <Box sx={{ width: '300px', position: 'relative' }}>
                  <TextField
                    id="newPasswordConfirmInput"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    variant="outlined"
                    size="small"
                    fullWidth
                    autoComplete="off"
                    sx={textFieldSx}
                    InputProps={{
                      endAdornment: (
                        <IconButton
                          type="button"
                          id="confirmtogglePassword"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          edge="end"
                          size="small"
                          sx={{ position: 'absolute', right: '4px' }}
                        >
                          {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      ),
                    }}
                  />
                </Box>
              </Box>

              {/* Submit Button */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                <Box sx={{ width: '150px', minWidth: '150px' }}></Box>
                <Button
                  id="submitButton"
                  type="button"
                  variant="contained"
                  onClick={handleChangePassword}
                  disabled={loading}
                  sx={{
                    backgroundColor: uiColors.chart.title,
                    color: '#fff',
                    textTransform: 'none',
                    padding: '8px 24px',
                    fontSize: '13px',
                    fontWeight: 500,
                    '&:hover': {
                      backgroundColor: '#2a5494',
                    },
                    '&:disabled': {
                      opacity: 0.6,
                    },
                  }}
                >
                  {loading ? 'Submitting...' : 'Submit'}
                </Button>
              </Box>
            </Box>
          </Box>

          {/* Right side: Password Policy */}
          {policyHtml && (
            <Box sx={{ flex: 1, paddingLeft: '20px' }} className="password-policy-contentDiv">
              <label style={{ fontWeight: 600, fontSize: '13px', color: uiColors.text.primary }}>
                Password Requirements
              </label>
              <Box
                id="password-policy-content"
                dangerouslySetInnerHTML={{ __html: policyHtml }}
                sx={{
                  paddingLeft: '20px',
                  fontSize: '12px',
                  color: uiColors.text.secondary,
                  marginTop: '8px',
                }}
              />
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
}

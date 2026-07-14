/**
 * Edit Profile Form - Production Ready
 * Migrated from JSP my_profile.jsp Profile tab
 * 100% UI match with JSP layout - horizontal form with labels and inputs on same row
 */
import { useState } from 'react';
import {
  TextField,
  Button,
  Box,
  Alert,
  CircularProgress,
} from '@mui/material';
import { http } from '../services/http';
import { uiColors, formColors } from '../constants/colors';

interface AdminUser {
  firstname: string;
  lastname: string;
  emailAddress: string;
  username: string;
  mobileno: string;
  roleName: string;
  roleSlug: string;
}

interface EditProfileFormProps {
  adminUser: AdminUser;
  allowedEmailDomains?: string;
}

export default function EditProfileForm({
  adminUser,
  allowedEmailDomains = '',
}: EditProfileFormProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const [formData, setFormData] = useState({
    firstName: adminUser.firstname,
    lastName: adminUser.lastname,
    email: adminUser.emailAddress,
    userName: adminUser.username,
    phoneNumber: adminUser.mobileno,
    role: adminUser.roleName,
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrorMessage('');
  };

  const validateEmail = (email: string): boolean => {
    if (!email.trim()) {
      setErrorMessage('Email is required.');
      return false;
    }

    if (!allowedEmailDomains) {
      const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
      if (!emailRegex.test(email)) {
        setErrorMessage('Please enter a valid email address.');
        return false;
      }
      return true;
    }

    const domains = allowedEmailDomains.split(',').map((d) => {
      let domain = d.trim();
      if (domain.startsWith('*')) {
        domain = domain.substring(1);
      }
      return domain;
    });

    const emailPrefix = email.split('@')[0];
    const emailPostfix = email.split('@')[1];

    if (!emailPrefix || !emailPostfix) {
      setErrorMessage('Please enter a valid email address.');
      return false;
    }

    let regExpressionStr = '^[A-Za-z0-9](\\.?[A-Za-z0-9]){0,}';
    for (let i = 0; i < domains.length; i++) {
      regExpressionStr += domains[i];
      if (i !== domains.length - 1) {
        regExpressionStr += '|';
      }
    }

    const reg = new RegExp(regExpressionStr);
    const regexstatus = reg.test(email) && emailPrefix.length > 0;

    let lengthstatus = false;
    for (let i = 0; i < domains.length; i++) {
      const domainPostfix = domains[i].split('@')[1];
      if (domainPostfix === emailPostfix && domainPostfix.length === emailPostfix.length) {
        lengthstatus = true;
      }
    }

    if (!lengthstatus || !regexstatus) {
      setErrorMessage('Please enter a valid email address from an allowed domain.');
      return false;
    }

    return true;
  };

  const validatePhoneNumber = (phone: string): boolean => {
    if (!phone.trim()) {
      return true; // phone is optional
    }
    const phoneRegex = /^\d+$/;
    if (phone.length !== 10 || !phoneRegex.test(phone)) {
      setErrorMessage('Please enter a valid 10-digit mobile number.');
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    setErrorMessage('');
    setSuccessMessage('');

    if (!validateEmail(formData.email)) {
      return;
    }

    if (!validatePhoneNumber(formData.phoneNumber)) {
      return;
    }

    try {
      setLoading(true);
      const payload = {
        firstname: formData.firstName,
        lastname: formData.lastName,
        emailAddress: formData.email.trim(),
        username: formData.userName,
        mobileno: formData.phoneNumber.trim(),
        roleSlug: adminUser.roleSlug,
      };

      const response = await http.put('/update_my_profile', payload);

      if (response.data.code === '0') {
        setSuccessMessage(response.data.message || 'Profile updated successfully.');
        setIsEditing(false);
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        setErrorMessage(response.data.message || 'Unable to update profile. Please try again.');
      }
    } catch (error) {
      setErrorMessage('Unable to process your request. Please try again later.');
      console.error('Error updating profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      firstName: adminUser.firstname,
      lastName: adminUser.lastname,
      email: adminUser.emailAddress,
      userName: adminUser.username,
      phoneNumber: adminUser.mobileno,
      role: adminUser.roleName,
    });
    setIsEditing(false);
    setErrorMessage('');
  };

  const textFieldSx = {
    '& .MuiOutlinedInput-root': {
      backgroundColor: !isEditing ? '#f5f6f8' : '#ffffff',
      '& fieldset': {
        borderColor: '#e0e0e0',
      },
      '&:hover fieldset': {
        borderColor: '#e0e0e0',
      },
      '&.Mui-focused fieldset': {
        borderColor: formColors.focusOutline,
        borderWidth: '1px',
      },
    },
    '& .MuiOutlinedInput-input': {
      color: uiColors.text.primary,
      fontSize: '13px',
      padding: '10px 12px',
    },
    '& .MuiOutlinedInput-input:disabled': {
      backgroundColor: '#f5f6f8',
      color: uiColors.text.primary,
      WebkitTextFillColor: uiColors.text.primary,
    },
  };

  return (
    <Box>
      {/* Success Alert */}
      {successMessage && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {successMessage}
        </Alert>
      )}

      {/* Error Alert */}
      {errorMessage && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {errorMessage}
        </Alert>
      )}

      {/* Form - Horizontal Layout matching JSP */}
      <Box component="form" sx={{ mt: 2 }}>
        {/* First Name Row */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2.5, gap: 3 }}>
          <Box sx={{ width: '150px', minWidth: '150px' }}>
            <label style={{ fontWeight: 600, fontSize: '13px', color: uiColors.text.primary }}>
              First Name
            </label>
          </Box>
          <Box sx={{ width: '350px' }}>
            <TextField
              fullWidth
              id="firstName"
              type="text"
              value={formData.firstName}
              disabled
              variant="outlined"
              size="small"
              sx={textFieldSx}
              autoComplete="off"
            />
          </Box>
        </Box>

        {/* Last Name Row */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2.5, gap: 3 }}>
          <Box sx={{ width: '150px', minWidth: '150px' }}>
            <label style={{ fontWeight: 600, fontSize: '13px', color: uiColors.text.primary }}>
              Last Name
            </label>
          </Box>
          <Box sx={{ width: '350px' }}>
            <TextField
              fullWidth
              id="lastName"
              type="text"
              value={formData.lastName}
              disabled
              variant="outlined"
              size="small"
              sx={textFieldSx}
              autoComplete="off"
            />
          </Box>
        </Box>

        {/* Email Row */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2.5, gap: 3 }}>
          <Box sx={{ width: '150px', minWidth: '150px' }}>
            <label style={{ fontWeight: 600, fontSize: '13px', color: uiColors.text.primary }}>
              Email
            </label>
          </Box>
          <Box sx={{ width: '350px' }}>
            <TextField
              fullWidth
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              disabled={!isEditing}
              variant="outlined"
              size="small"
              sx={textFieldSx}
              autoComplete="off"
            />
          </Box>
        </Box>

        {/* Username Row */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2.5, gap: 3 }}>
          <Box sx={{ width: '150px', minWidth: '150px' }}>
            <label style={{ fontWeight: 600, fontSize: '13px', color: uiColors.text.primary }}>
              Username
            </label>
          </Box>
          <Box sx={{ width: '350px' }}>
            <TextField
              fullWidth
              id="userName"
              type="text"
              value={formData.userName}
              disabled
              variant="outlined"
              size="small"
              sx={textFieldSx}
              autoComplete="off"
            />
          </Box>
        </Box>

        {/* Mobile Number Row */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2.5, gap: 3 }}>
          <Box sx={{ width: '150px', minWidth: '150px' }}>
            <label style={{ fontWeight: 600, fontSize: '13px', color: uiColors.text.primary }}>
              Mobile Number
            </label>
          </Box>
          <Box sx={{ width: '350px' }}>
            <TextField
              fullWidth
              id="phoneNumber"
              name="phoneNumber"
              type="text"
              inputProps={{
                maxLength: 10,
                pattern: '[0-9]*',
              }}
              value={formData.phoneNumber}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                handleInputChange('phoneNumber', value);
              }}
              disabled={!isEditing}
              variant="outlined"
              size="small"
              sx={textFieldSx}
              autoComplete="off"
            />
          </Box>
        </Box>

        {/* Role Row */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 3 }}>
          <Box sx={{ width: '150px', minWidth: '150px' }}>
            <label style={{ fontWeight: 600, fontSize: '13px', color: uiColors.text.primary }}>
              Role
            </label>
          </Box>
          <Box sx={{ width: '350px' }}>
            <TextField
              fullWidth
              id="role"
              type="text"
              value={formData.role}
              disabled
              variant="outlined"
              size="small"
              sx={textFieldSx}
              autoComplete="off"
            />
          </Box>
        </Box>

        {/* Buttons Row */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          <Box sx={{ width: '150px', minWidth: '150px' }}></Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            {!isEditing ? (
              <Button
                type="button"
                id="editProfileButtonTag"
                variant="contained"
                onClick={() => setIsEditing(true)}
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
                }}
              >
                Edit Profile
              </Button>
            ) : (
              <>
                <Button
                  type="button"
                  id="saveProfileButtonTag1"
                  variant="contained"
                  onClick={handleSave}
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
                  {loading && <CircularProgress size={14} sx={{ mr: 1 }} />}
                  Save Profile
                </Button>
                <Button
                  type="button"
                  id="canceleditProfileButtonTag"
                  variant="outlined"
                  onClick={handleCancel}
                  disabled={loading}
                  sx={{
                    borderColor: '#ddd',
                    color: uiColors.text.primary,
                    textTransform: 'none',
                    padding: '8px 24px',
                    fontSize: '13px',
                    fontWeight: 500,
                    backgroundColor: '#fff',
                    '&:hover': {
                      backgroundColor: '#f9f9f9',
                      borderColor: '#ddd',
                    },
                    '&:disabled': {
                      opacity: 0.6,
                    },
                  }}
                >
                  Cancel
                </Button>
              </>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

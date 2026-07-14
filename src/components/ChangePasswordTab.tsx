/**
 * Change Password Tab — two-step password change process
 * Step 1: Validate current password
 * Step 2: Enter and confirm new password with policy validation
 * Matches JSP layout exactly: Bootstrap form-horizontal structure
 */
import { useState, useEffect } from 'react';
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

  return (
    <div className="box-content" style={{ padding: '10px 0' }}>
      {/* Success Alert */}
      {successMessage && (
        <div
          className="alert alert-success"
          style={{
            marginBottom: '20px',
            backgroundColor: formColors.successBackground,
            borderColor: formColors.successBorder,
            color: formColors.successText,
          }}
        >
          <p style={{ margin: 0, fontSize: '13px' }}>{successMessage}</p>
        </div>
      )}

      {/* Error Alert */}
      {errorMessage && (
        <div
          className="alert alert-danger"
          style={{
            marginBottom: '20px',
            backgroundColor: formColors.errorBackground,
            borderColor: formColors.errorBorder,
            color: formColors.errorText,
          }}
        >
          <p style={{ margin: 0, fontSize: '13px' }}>{errorMessage}</p>
        </div>
      )}

      {/* Step 1: Validate Current Password */}
      {step === 'validate' && (
        <div style={{ maxWidth: '600px' }}>
          <form className="form-horizontal" id="formValidateCurrentPassword" autoComplete="off">
            <div className="form-group">
              <div className="row">
                <div className="col-md-12">
                  <label style={{ fontWeight: 'bold', fontSize: '14px', color: uiColors.text.primary }}>
                    To change your password, please authenticate again.
                  </label>
                </div>
              </div>
              <br />
              <div className="row" id="currentPasswordDiv">
                <div className="col-md-2">
                  <label id="currentPasswordTag" style={{ marginTop: '6px', fontWeight: 600, color: uiColors.text.primary }}>
                    Current Password
                  </label>
                </div>
                <div className="col-md-4">
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showCurrentPassword ? 'text' : 'password'}
                      id="currentPasswordInput"
                      className="form-control"
                      name="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      autoComplete="off"
                      style={{
                        backgroundColor: uiColors.background.card,
                        borderColor: formColors.inputBorder,
                        color: uiColors.text.primary,
                      }}
                    />
                    <button
                      type="button"
                      className="thirdTogglePassword"
                      id="togglePassword"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      style={{
                        position: 'absolute',
                        right: '10px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '14px',
                        color: uiColors.text.secondary,
                      }}
                    >
                      {showCurrentPassword ? 'Hide' : 'Show'}
                    </button>
                  </div>
                </div>
              </div>
              <br />
              <div className="row">
                <div className="col-md-2"></div>
                <div className="col-md-4">
                  <button
                    id="proceedButton"
                    type="button"
                    className="btn btn-primary"
                    onClick={handleValidatePassword}
                    disabled={loading}
                    style={{
                      backgroundColor: uiColors.chart.title,
                      borderColor: uiColors.chart.title,
                      color: '#fff',
                      padding: '6px 12px',
                      fontSize: '13px',
                      opacity: loading ? 0.6 : 1,
                    }}
                  >
                    {loading ? 'Verifying...' : 'Proceed'}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Step 2: Enter New Password */}
      {step === 'enter' && (
        <div style={{ display: 'flex', gap: '40px' }}>
          {/* Left side: Password input fields */}
          <div style={{ flex: 1, maxWidth: '500px' }}>
            <form className="form-horizontal" id="formenternewpassword" autoComplete="off">
              <div className="form-group">
                <div className="row">
                  <div className="col-md-12">
                    <label style={{ fontWeight: 'bold', fontSize: '14px', color: uiColors.text.primary }}>
                      Enter New Password
                    </label>
                    <i
                      hidden={true}
                      className="fa fa-info-circle fa-lg myProfile-PasswordPolicy-tooltip"
                      id="password-policy-icon"
                      style={{
                        marginLeft: '8px',
                        cursor: 'pointer',
                        color: uiColors.text.secondary,
                      }}
                    >
                      <span
                        className="myProfile-tooltiptext"
                        id="passwordPolSpan"
                        style={{
                          visibility: 'hidden',
                          backgroundColor: '#555',
                          color: '#fff',
                          textAlign: 'center',
                          padding: '5px',
                          borderRadius: '6px',
                          position: 'absolute',
                          zIndex: 1,
                        }}
                      ></span>
                    </i>
                  </div>
                </div>
                <br />
                <div className="row col-md-12">
                  <div className="col-md-6">
                    {/* New Password */}
                    <div className="row" id="newPasswordEnterDiv">
                      <div className="col-sm-4" style={{ paddingLeft: '0' }}>
                        <label className="control-label font-bold" id="newPasswordTag" style={{ fontWeight: 600, color: uiColors.text.primary }}>
                          New Password
                        </label>
                      </div>
                      <div className="col-sm-8">
                        <div style={{ position: 'relative' }}>
                          <input
                            className="form-control"
                            type={showNewPassword ? 'text' : 'password'}
                            id="newPasswordInput"
                            name="newpassword"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            autoComplete="off"
                            style={{
                              backgroundColor: uiColors.background.card,
                              borderColor: formColors.inputBorder,
                              color: uiColors.text.primary,
                            }}
                          />
                          <button
                            type="button"
                            className="fourthTogglePassword"
                            id="newtogglePassword"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            style={{
                              position: 'absolute',
                              right: '10px',
                              top: '50%',
                              transform: 'translateY(-50%)',
                              background: 'none',
                              border: 'none',
                              cursor: 'pointer',
                              fontSize: '14px',
                              color: uiColors.text.secondary,
                            }}
                          >
                            {showNewPassword ? 'Hide' : 'Show'}
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <label htmlFor="newpassword"></label>
                    </div>

                    {/* Confirm Password */}
                    <div className="row" id="newPasswordConfirmDiv">
                      <div className="col-sm-4" style={{ paddingLeft: '0' }}>
                        <label className="control-label font-bold" id="newPasswordConfirmTag" style={{ fontWeight: 600, color: uiColors.text.primary }}>
                          Confirm Password
                        </label>
                      </div>
                      <div className="col-sm-8">
                        <div style={{ position: 'relative' }}>
                          <input
                            className="form-control"
                            type={showConfirmPassword ? 'text' : 'password'}
                            id="newPasswordConfirmInput"
                            name="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            autoComplete="off"
                            style={{
                              backgroundColor: uiColors.background.card,
                              borderColor: formColors.inputBorder,
                              color: uiColors.text.primary,
                            }}
                          />
                          <button
                            type="button"
                            className="fourthTogglePassword"
                            id="confirmtogglePassword"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            style={{
                              position: 'absolute',
                              right: '10px',
                              top: '50%',
                              transform: 'translateY(-50%)',
                              background: 'none',
                              border: 'none',
                              cursor: 'pointer',
                              fontSize: '14px',
                              color: uiColors.text.secondary,
                            }}
                          >
                            {showConfirmPassword ? 'Hide' : 'Show'}
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <label htmlFor="confirmPassword"></label>
                    </div>

                    {/* Submit Button */}
                    <div className="row">
                      <div className="col-sm-4"></div>
                      <div className="col-sm-8">
                        <button
                          id="submitButton"
                          type="button"
                          className="btn btn-primary"
                          onClick={handleChangePassword}
                          disabled={loading}
                          style={{
                            backgroundColor: uiColors.chart.title,
                            borderColor: uiColors.chart.title,
                            color: '#fff',
                            padding: '6px 12px',
                            fontSize: '13px',
                            opacity: loading ? 0.6 : 1,
                          }}
                        >
                          {loading ? 'Submitting...' : 'Submit'}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Right side: Password Policy */}
                  {policyHtml && (
                    <div className="col-md-6 password-policy-contentDiv" style={{ paddingLeft: '20px' }}>
                      <label className="mt-2 font-bold" style={{ fontWeight: 600, fontSize: '13px', color: uiColors.text.primary }}>
                        Password Requirements
                      </label>
                      <div
                        id="password-policy-content"
                        dangerouslySetInnerHTML={{ __html: policyHtml }}
                        style={{
                          paddingLeft: '20px',
                          fontSize: '12px',
                          color: uiColors.text.secondary,
                          marginTop: '8px',
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

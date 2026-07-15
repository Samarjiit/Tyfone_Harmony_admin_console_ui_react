/**
 * Operations/Accounts Tab — displays user transaction history
 * Uses MUI form components for consistency with the project's form library
 * Allows filtering by transaction type and date range
 */
import { useState, useEffect } from 'react';
import { Box, TextField, Select, MenuItem, Button, Alert } from '@mui/material';
import { http } from '../services/http';
import { uiColors, formColors } from '../constants/colors';

interface OperationsTabProps {
  myProfileConfig?: unknown;
}

export default function OperationsTab({ myProfileConfig }: OperationsTabProps) {
  const [transactionType, setTransactionType] = useState('DELETE_MEMBER_ENROLLMENT');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState<unknown[]>([]);
  const [infoMessage, setInfoMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showTable, setShowTable] = useState(false);

  useEffect(() => {
    const today = new Date();
    const endDateObj = new Date(today);
    endDateObj.setDate(today.getDate() - 1);
    const startDateObj = new Date(endDateObj.getTime() - 7 * 86400000);

    const formatDate = (d: Date) => {
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    setStartDate(formatDate(startDateObj));
    setEndDate(formatDate(endDateObj));
  }, []);

  const validateDates = (): boolean => {
    if (!startDate.trim()) {
      setErrorMessage('Please select start date.');
      return false;
    }
    if (!endDate.trim()) {
      setErrorMessage('Please select end date.');
      return false;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start > end) {
      setErrorMessage('Start date cannot be after end date.');
      return false;
    }

    return true;
  };

  const handleSearch = async () => {
    setErrorMessage('');
    setInfoMessage('');
    setTransactions([]);
    setShowTable(false);

    if (!validateDates()) {
      return;
    }

    try {
      setLoading(true);

      const startDateObj = new Date(startDate);
      const endDateObj = new Date(endDate);
      endDateObj.setHours(23, 59, 59, 999);

      const formatDateIso = (d: Date) => {
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        const hours = String(d.getHours()).padStart(2, '0');
        const minutes = String(d.getMinutes()).padStart(2, '0');
        const seconds = String(d.getSeconds()).padStart(2, '0');
        return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
      };

      const response = await http.post('/get_my_operations', {
        from: formatDateIso(startDateObj),
        to: formatDateIso(endDateObj),
        transactionType,
      });

      if (response.data.status === 0) {
        const data = response.data.data?.aaData || [];
        if (data.length > 0) {
          setTransactions(data);
          setShowTable(true);
        } else {
          setInfoMessage('There are no log entries for the given criteria');
        }
      } else if (response.data.status === 1000) {
        window.location.href = '/session-timeout';
      } else {
        setErrorMessage(response.data.message || 'Unable to fetch transactions.');
      }
    } catch (error) {
      setErrorMessage('Unable to process your request. Please try again later.');
      console.error('Error fetching transactions:', error);
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
      {/* Search Form */}
      <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Transaction Type */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <Box sx={{ width: '150px', minWidth: '150px' }}>
            <label style={{ fontWeight: 600, fontSize: '13px', color: uiColors.text.primary }}>
              Transaction Type
            </label>
          </Box>
          <Box sx={{ width: '300px' }}>
            <Select
              id="transactionOptionSelect"
              value={transactionType}
              onChange={(e) => setTransactionType(e.target.value)}
              variant="outlined"
              size="small"
              sx={textFieldSx}
            >
              <MenuItem value="DELETE_MEMBER_ENROLLMENT">Delete Member Enrollment</MenuItem>
              <MenuItem value="ADD_MEMBER_ENROLLMENT">Add Member Enrollment</MenuItem>
              <MenuItem value="UPDATE_MEMBER">Update Member</MenuItem>
            </Select>
          </Box>
        </Box>

        {/* Start Date */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <Box sx={{ width: '150px', minWidth: '150px' }}>
            <label style={{ fontWeight: 600, fontSize: '13px', color: uiColors.text.primary }}>
              Start Date:
            </label>
          </Box>
          <Box sx={{ width: '300px' }}>
            <TextField
              id="startDate"
              aria-label="enter start date"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              variant="outlined"
              size="small"
              fullWidth
              InputLabelProps={{ shrink: true }}
              sx={textFieldSx}
            />
          </Box>
        </Box>

        {/* End Date */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <Box sx={{ width: '150px', minWidth: '150px' }}>
            <label style={{ fontWeight: 600, fontSize: '13px', color: uiColors.text.primary }}>
              End Date:
            </label>
          </Box>
          <Box sx={{ width: '300px' }}>
            <TextField
              id="endDate"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              variant="outlined"
              size="small"
              fullWidth
              InputLabelProps={{ shrink: true }}
              sx={textFieldSx}
            />
          </Box>
        </Box>

        {/* Search Button */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <Box sx={{ width: '150px', minWidth: '150px' }}></Box>
          <Box>
            <Button
              id="searchTransactionsButton"
              type="button"
              variant="contained"
              onClick={handleSearch}
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
              {loading ? 'Searching...' : 'Search Transactions'}
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Error Alert */}
      {errorMessage && (
        <Alert severity="error" sx={{ marginTop: '20px', marginBottom: '16px' }}>
          {errorMessage}
        </Alert>
      )}

      {/* Info Alert */}
      {infoMessage && (
        <Alert severity="warning" sx={{ marginTop: '20px', marginBottom: '16px' }}>
          {infoMessage}
        </Alert>
      )}

      {/* Transactions Table */}
      {showTable && transactions.length > 0 && (
        <Box id="tableDiv" sx={{ marginTop: '20px' }}>
          <Box id="shownTimezoneInfo" sx={{ marginBottom: '12px' }}>
            <Box sx={{ display: 'flex', gap: '4px' }}>
              <span style={{ fontSize: '12px', color: uiColors.text.secondary }}>All dates are in&nbsp;</span>
              <span id="timezoneText" style={{ fontWeight: 600, fontSize: '12px', color: uiColors.text.secondary }}></span>
            </Box>
          </Box>
          <table
            width="100%"
            className="table table-striped table-responsive table-bordered"
            id="transactionTable"
            style={{ borderLeft: `1px solid ${uiColors.border.default}`, marginTop: '12px' }}
          >
            <thead>
              <tr style={{ backgroundColor: uiColors.background.light }}>
                <th style={{ fontSize: '13px', color: uiColors.text.primary, fontWeight: 600 }}>Date</th>
                <th style={{ fontSize: '13px', color: uiColors.text.primary, fontWeight: 600 }}>Transaction Type</th>
                <th style={{ fontSize: '13px', color: uiColors.text.primary, fontWeight: 600 }}>Member Name</th>
                <th style={{ fontSize: '13px', color: uiColors.text.primary, fontWeight: 600 }}>Member ID</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction: any, index) => (
                <tr key={index}>
                  <td style={{ fontSize: '13px', color: uiColors.text.primary }}>{transaction.timestampInString}</td>
                  <td style={{ fontSize: '13px', color: uiColors.text.primary }}>{transaction.transactionType}</td>
                  <td style={{ fontSize: '13px', color: uiColors.text.primary }}>
                    {transaction.memberFirstName || transaction.memberLastName
                      ? `${transaction.memberFirstName || ''} ${transaction.memberLastName || ''}`.trim()
                      : transaction.memberFullName || 'N/A'}
                  </td>
                  <td style={{ fontSize: '13px', color: uiColors.text.primary }}>{transaction.memberId}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Box>
      )}
    </Box>
  );
}

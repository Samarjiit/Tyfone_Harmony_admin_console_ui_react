/**
 * Operations/Accounts Tab — displays user transaction history
 * Allows filtering by transaction type and date range
 * Matches JSP layout exactly: Bootstrap grid, form-group rows
 */
import { useState, useEffect } from 'react';
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
      return `${month}/${day}/${year}`;
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

  return (
    <div className="box-content" style={{ padding: '10px 0' }}>
      {/* Search Form */}
      <form className="form-horizontal">
        {/* Transaction Type */}
        <div className="row padding-bottom-0">
          <label id="transactionTypeLabel" className="col-sm-2 control-label font-bold" style={{ fontWeight: 600, lineHeight: '3' }}>
            Transaction Type
          </label>
          <div className="col-sm-3">
            <select
              id="transactionOptionSelect"
              className="form-control"
              value={transactionType}
              onChange={(e) => setTransactionType(e.target.value)}
              style={{
                backgroundColor: uiColors.background.card,
                borderColor: formColors.inputBorder,
                color: uiColors.text.primary,
                width: 'max-content !important',
              }}
            >
              <option value="DELETE_MEMBER_ENROLLMENT">Delete Member Enrollment</option>
              <option value="ADD_MEMBER_ENROLLMENT">Add Member Enrollment</option>
              <option value="UPDATE_MEMBER">Update Member</option>
            </select>
          </div>
        </div>

        {/* Start Date */}
        <div className="form-group row" id="startDateDiv">
          <label id="startdaterangeTag" className="col-sm-2 control-label font-bold" style={{ fontWeight: 600, lineHeight: '3' }}>
            Start Date:
          </label>
          <div className="col-sm-3 controls">
            <input
              aria-label="enter start date"
              id="startDate"
              type="date"
              value={startDate.split('/').reverse().join('-')}
              onChange={(e) => {
                const [year, month, day] = e.target.value.split('-');
                setStartDate(`${month}/${day}/${year}`);
              }}
              style={{
                backgroundColor: uiColors.background.card,
                borderColor: formColors.inputBorder,
                color: uiColors.text.primary,
                padding: '6px 12px',
                borderRadius: '4px',
                border: `1px solid ${formColors.inputBorder}`,
                width: '100%',
              }}
            />
          </div>
          <div>
            <label className="error nostyle" id="startDateError" style={{ color: formColors.errorText, display: 'none' }}></label>
          </div>
        </div>

        {/* End Date */}
        <div className="form-group row" id="endDateDiv">
          <label id="enddaterangeTag" className="col-sm-2 control-label font-bold" style={{ fontWeight: 600, lineHeight: '3' }}>
            End Date:
          </label>
          <div className="col-sm-3 controls">
            <input
              id="endDate"
              type="date"
              value={endDate.split('/').reverse().join('-')}
              onChange={(e) => {
                const [year, month, day] = e.target.value.split('-');
                setEndDate(`${month}/${day}/${year}`);
              }}
              style={{
                backgroundColor: uiColors.background.card,
                borderColor: formColors.inputBorder,
                color: uiColors.text.primary,
                padding: '6px 12px',
                borderRadius: '4px',
                border: `1px solid ${formColors.inputBorder}`,
                width: '100%',
              }}
            />
          </div>
          <div>
            <label className="error nostyle" id="endDateError" style={{ color: formColors.errorText, display: 'none' }}></label>
          </div>
        </div>

        {/* Search Button */}
        <div className="row padding-bottom-0">
          <label id="noTagLabel" className="col-md-2 control-label"></label>
          <div className="col-md-3 controls">
            <button
              type="button"
              id="searchTransactionsButton"
              className="btn btn-primary"
              onClick={handleSearch}
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
              {loading ? 'Searching...' : 'Search Transactions'}
            </button>
          </div>
        </div>
      </form>

      {/* Error Alert */}
      {errorMessage && (
        <div
          className="alert alert-danger"
          style={{
            marginTop: '20px',
            marginBottom: '16px',
            backgroundColor: formColors.errorBackground,
            borderColor: formColors.errorBorder,
            color: formColors.errorText,
          }}
        >
          <p style={{ margin: 0, fontSize: '13px' }}>{errorMessage}</p>
        </div>
      )}

      {/* Info Alert */}
      {infoMessage && (
        <div
          id="infodiv"
          className="alert alert-warning"
          style={{
            marginTop: '20px',
            marginBottom: '16px',
            backgroundColor: '#faebcc',
            borderColor: '#fad8a5',
            color: '#8a6d3b',
          }}
        >
          <p style={{ margin: 0, fontSize: '13px' }}>{infoMessage}</p>
        </div>
      )}

      {/* Transactions Table */}
      {showTable && transactions.length > 0 && (
        <div id="tableDiv" style={{ marginTop: '20px' }}>
          <div id="shownTimezoneInfo" className="mt-1">
            <div className="row" style={{ marginLeft: '0', marginRight: '0' }}>
              <label style={{ marginLeft: '12px', marginBottom: '0', fontSize: '12px', color: uiColors.text.secondary }}>
                All dates are in&nbsp;
              </label>
              <label id="timezoneText" style={{ fontWeight: 600, marginBottom: '0', fontSize: '12px', color: uiColors.text.secondary }}></label>
            </div>
          </div>
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
        </div>
      )}
    </div>
  );
}

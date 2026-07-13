/**
 * Global member search — port of the #searchBar block in header/header.jsp +
 * resources/js/scripts/header.js.
 *
 * Same behavior as the JSP:
 *  - clicking into the search box opens the criteria options panel
 *    (radio list: User ID / Member Name / Phone Number / Member Number /
 *    Individual ID / Business ID / Business Name / Label Name / Email),
 *    each option gated by its feature id; "Hide" closes the panel
 *  - "Member Name" swaps the single box for First Name + Last Name inputs
 *  - validation: non-empty, min 3 characters, numeric-only for phone
 *  - Search navigates to the Member Search page with the criteria + value
 *    (in the JSP this submitted the membersearch form to /member_search)
 *
 * NOTE: results themselves render on the Member Search page, which in this
 * skeleton iteration is a placeholder module — the control is fully
 * functional up to the hand-off.
 */
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useAuth } from '../context/AuthContext';
import { SEARCH_CRITERIA, isVisible } from '../utils/navigation';
import * as sx from '../styles/sx';

export default function HeaderSearch({ brandColor }: { brandColor: string }) {
  const { features } = useAuth();
  const navigate = useNavigate();
  const wrapRef = useRef<HTMLDivElement>(null);

  const visibleCriteria = SEARCH_CRITERIA.filter((c) => isVisible(features, c.feature));
  const [optionsOpen, setOptionsOpen] = useState(false);
  const [criteria, setCriteria] = useState(visibleCriteria[0]?.value ?? 'username');
  const [value, setValue] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState<string | null>(null);

  const selected = SEARCH_CRITERIA.find((c) => c.value === criteria);

  // Close the options panel on outside click (JSP hid it on blur/Hide).
  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOptionsOpen(false);
      }
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  const runSearch = () => {
    setError(null);
    // header.js / member_search.js validation rules
    if (selected?.twoFields) {
      if (!firstName.trim() && !lastName.trim()) {
        setError('Please enter a first or last name.');
        return;
      }
      if ((firstName.trim() || lastName.trim()).length < 3) {
        setError('Please enter at least 3 characters.');
        return;
      }
      navigate(
        `/search_for_member?searchBy=name&firstName=${encodeURIComponent(firstName.trim())}` +
          `&lastName=${encodeURIComponent(lastName.trim())}`
      );
    } else {
      const v = value.trim();
      if (!v) {
        setError('Please enter a search value.');
        return;
      }
      if (v.length < 3) {
        setError('Please enter at least 3 characters.');
        return;
      }
      if (selected?.numeric && Number.isNaN(Number(v))) {
        setError(`${selected.label} must be numeric.`);
        return;
      }
      navigate(`/search_for_member?searchBy=${criteria}&q=${encodeURIComponent(v)}`);
    }
    setOptionsOpen(false);
  };

  return (
    <Box id="searchBar" ref={wrapRef} sx={sx.searchBarWrap}>
      <Box sx={sx.searchBarRow}>
        {selected?.twoFields ? (
          <>
            <Box
              component="input"
              id="searchFirstName"
              placeholder="First Name"
              sx={sx.searchInput}
              value={firstName}
              onFocus={() => setOptionsOpen(true)}
              onChange={(e) => setFirstName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && runSearch()}
            />
            <Box sx={sx.nameSeparator} id="nameSeparator" />
            <Box
              component="input"
              id="searchLastName"
              placeholder="Last Name"
              sx={sx.searchInput}
              value={lastName}
              onFocus={() => setOptionsOpen(true)}
              onChange={(e) => setLastName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && runSearch()}
            />
          </>
        ) : (
          <Box
            component="input"
            id="searchField"
            className="search-bar"
            placeholder="Search"
            title="Search here"
            sx={sx.searchInput}
            value={value}
            onFocus={() => setOptionsOpen(true)}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && runSearch()}
          />
        )}
        <Box
          component="button"
          type="button"
          id="searchButton"
          title="Search"
          sx={{ ...sx.searchButton, backgroundColor: brandColor }}
          onClick={runSearch}
        >
          <SearchIcon fontSize="small" htmlColor="#fff" />
        </Box>
      </Box>

      {optionsOpen && (
        <Box id="searchOptions" sx={sx.searchOptionsPanel}>
          {error && (
            <Box className="alert alert-warning" id="globalSearchErrDiv" sx={sx.searchError}>
              {error}
            </Box>
          )}
          {visibleCriteria.map((c) => (
            <Box component="label" key={c.value} className="radio-item" sx={sx.searchRadioItem}>
              <input
                type="radio"
                name="searchBy"
                value={c.value}
                checked={criteria === c.value}
                onChange={() => {
                  setCriteria(c.value);
                  setError(null);
                }}
              />
              <span>{c.label}</span>
            </Box>
          ))}
          <Box
            component="button"
            type="button"
            id="hideSearchOptions"
            className="btn btn-secondary"
            sx={sx.searchHideBtn}
            onClick={() => setOptionsOpen(false)}
          >
            Hide
          </Box>
        </Box>
      )}
    </Box>
  );
}

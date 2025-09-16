import { useState } from 'react';

export default function AdminPage() {
  const [password, setPassword] = useState('');
  const [submissions, setSubmissions] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [authed, setAuthed] = useState(false);
  const [conciergeRequests, setConciergeRequests] = useState([]);

  // ===== Highlight matches =====
  const highlightMatch = (text, term) => {
    if (!term || !text) return text;
    const regex = new RegExp(`(${term})`, 'gi');
    return text.split(regex).map((part, i) =>
      regex.test(part) ? (
        <mark
          key={i}
          style={{ backgroundColor: 'yellow', color: 'black', padding: '0' }}
        >
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  // ===== All Leads Combined =====
  const combinedLeads = [
    ...submissions.map(row => ({
      source: 'Application',
      name: row.name,
      email: row.email,
      phone: row.phone,
      occupation: row.occupation,
      country: row.country,
      message: row.message,
      request: '',
      submitted_at: row.submitted_at
    })),
    ...conciergeRequests.map(row => ({
      source: 'Concierge',
      name: row.name,
      email: row.email,
      phone: '',
      occupation: '',
      country: '',
      message: '',
      request: row.request,
      submitted_at: row.submitted_at
    }))
  ];

  const [sortConfigCombined, setSortConfigCombined] = useState({ key: null, direction: null });
  const [searchTermCombined, setSearchTermCombined] = useState('');

  const handleSortCombined = (key) => {
    if (sortConfigCombined.key === key) {
      if (sortConfigCombined.direction === null) {
        setSortConfigCombined({ key, direction: 'asc' });
      } else if (sortConfigCombined.direction === 'asc') {
        setSortConfigCombined({ key, direction: 'desc' });
      } else {
        setSortConfigCombined({ key: null, direction: null });
      }
    } else {
      setSortConfigCombined({ key, direction: 'asc' });
    }
  };

  const sortedCombined = sortConfigCombined.key
    ? [...combinedLeads].sort((a, b) => {
        if (a[sortConfigCombined.key] < b[sortConfigCombined.key]) return sortConfigCombined.direction === 'asc' ? -1 : 1;
        if (a[sortConfigCombined.key] > b[sortConfigCombined.key]) return sortConfigCombined.direction === 'asc' ? 1 : -1;
        return 0;
      })
    : [...combinedLeads].sort((a, b) => new Date(b.submitted_at) - new Date(a.submitted_at));

  const filteredCombined = sortedCombined.filter(row => {
    const term = searchTermCombined.toLowerCase();
    return (
      row.source.toLowerCase().includes(term) ||
      (row.name && row.name.toLowerCase().includes(term)) ||
      (row.email && row.email.toLowerCase().includes(term)) ||
      (row.phone && row.phone.toLowerCase().includes(term)) ||
      (row.occupation && row.occupation.toLowerCase().includes(term)) ||
      (row.country && row.country.toLowerCase().includes(term)) ||
      (row.message && row.message.toLowerCase().includes(term)) ||
      (row.request && row.request.toLowerCase().includes(term))
    );
  });

  // ===== Applications =====
  const [sortConfigApps, setSortConfigApps] = useState({ key: null, direction: null });
  const [searchTermApps, setSearchTermApps] = useState('');

  const handleSortApps = (key) => {
    if (sortConfigApps.key === key) {
      if (sortConfigApps.direction === null) {
        setSortConfigApps({ key, direction: 'asc' });
      } else if (sortConfigApps.direction === 'asc') {
        setSortConfigApps({ key, direction: 'desc' });
      } else {
        setSortConfigApps({ key: null, direction: null });
      }
    } else {
      setSortConfigApps({ key, direction: 'asc' });
    }
  };

  const sortedApps = sortConfigApps.key
    ? [...submissions].sort((a, b) => {
        if (a[sortConfigApps.key] < b[sortConfigApps.key]) return sortConfigApps.direction === 'asc' ? -1 : 1;
        if (a[sortConfigApps.key] > b[sortConfigApps.key]) return sortConfigApps.direction === 'asc' ? 1 : -1;
        return 0;
      })
    : [...submissions].sort((a, b) => new Date(b.submitted_at) - new Date(a.submitted_at));

  const filteredApps = sortedApps.filter(row => {
    const term = searchTermApps.toLowerCase();
    return (
      row.name.toLowerCase().includes(term) ||
      row.email.toLowerCase().includes(term) ||
      (row.phone && row.phone.toLowerCase().includes(term)) ||
      (row.occupation && row.occupation.toLowerCase().includes(term)) ||
      (row.country && row.country.toLowerCase().includes(term)) ||
      (row.message && row.message.toLowerCase().includes(term))
    );
  });

  // ===== Concierge =====
  const [sortConfigConc, setSortConfigConc] = useState({ key: null, direction: null });
  const [searchTermConc, setSearchTermConc] = useState('');

  const handleSortConc = (key) => {
    if (sortConfigConc.key === key) {
      if (sortConfigConc.direction === null) {
        setSortConfigConc({ key, direction: 'asc' });
      } else if (sortConfigConc.direction === 'asc') {
        setSortConfigConc({ key, direction: 'desc' });
      } else {
        setSortConfigConc({ key: null, direction: null });
      }
    } else {
      setSortConfigConc({ key, direction: 'asc' });
    }
  };

  const sortedConc = sortConfigConc.key
    ? [...conciergeRequests].sort((a, b) => {
        if (a[sortConfigConc.key] < b[sortConfigConc.key]) return sortConfigConc.direction === 'asc' ? -1 : 1;
        if (a[sortConfigConc.key] > b[sortConfigConc.key]) return sortConfigConc.direction === 'asc' ? 1 : -1;
        return 0;
      })
    : [...conciergeRequests].sort((a, b) => new Date(b.submitted_at) - new Date(a.submitted_at));

  const filteredConcierge = sortedConc.filter(row => {
    const term = searchTermConc.toLowerCase();
    return (
      row.name.toLowerCase().includes(term) ||
      row.email.toLowerCase().includes(term) ||
      (row.request && row.request.toLowerCase().includes(term))
    );
  });

  // ===== Login & CSV =====
  const handleLogin = async e => {
    e.preventDefault();
    setLoading(true
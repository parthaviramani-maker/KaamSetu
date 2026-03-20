import { useState } from 'react';
import { MdSearch, MdStar, MdLocationOn } from 'react-icons/md';
import { useGetAgentWorkersQuery } from '../../../services/agentApi';

const ManageWorkers = () => {
  const [search, setSearch] = useState('');

  const { data: res, isLoading, isError } = useGetAgentWorkersQuery();
  const list = res?.data?.workers || [];

  const filtered = list.filter(w => {
    const matchSearch = (w.name || '').toLowerCase().includes(search.toLowerCase()) ||
                        (w.email || '').toLowerCase().includes(search.toLowerCase());
    return matchSearch;
  });

  return (
    <div>
      {/* Summary */}
      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)', marginBottom: '1.5rem' }}>
        {[
          { label: 'Total Workers', val: list.length, color: 'teal' },
          { label: 'Unique Placed', val: list.length, color: 'green' },
        ].map(c => (
          <div key={c.label} className={`stat-card stat-card--${c.color}`}>
            <div className="stat-body">
              <p className="stat-label">{c.label}</p>
              <p className="stat-value">{c.val}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="section-card" style={{ marginBottom: '1.5rem' }}>
        <div className="section-card-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1 }}>
            <MdSearch size={18} style={{ color: 'var(--text-secondary)' }} />
            <input
              className="dash-search-input"
              placeholder="Search workers by name or email…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      {isLoading && <p style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>Loading workers…</p>}
      {isError   && <p style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-error)' }}>Failed to load workers.</p>}

      {/* Worker Cards Grid */}
      {!isLoading && !isError && (
      <div className="worker-cards-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))' }}>
        {filtered.map(w => (
          <div key={w._id} className="worker-card" style={{ padding: '1.25rem', alignItems: 'center', textAlign: 'center' }}>
            <img
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(w.name || 'W')}&background=00ABB3&color=fff&size=80`}
              alt={w.name}
              className="worker-card-avatar"
              style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover', marginBottom: '0.6rem' }}
            />
            <h4 style={{ margin: '0 0 2px', fontSize: '0.9rem', fontWeight: 700 }}>{w.name}</h4>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: '0 0 0.4rem' }}>{w.email}</p>
            {w.phone && (
              <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', margin: '0 0 0.5rem' }}>{w.phone}</p>
            )}
          </div>
        ))}
      </div>
      )}
      {!isLoading && !isError && filtered.length === 0 && (
        <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginTop: '2rem' }}>No workers placed yet.</p>
      )}
    </div>
  );
};

export default ManageWorkers;

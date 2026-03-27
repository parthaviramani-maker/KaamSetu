import { useState } from 'react';
import { MdSearch } from 'react-icons/md';
import Avatar from '../../../components/Avatar';
import { useGetAllUsersQuery } from '../../../services/adminApi';

const ROLE_BADGE = {
  employer: 'badge-teal',
  worker:   'badge-active',
  agent:    'badge-reviewing',
  admin:    'badge-hired',
};

const AllUsers = () => {
  const [search,     setSearch]     = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  const { data: res, isLoading, isError } = useGetAllUsersQuery(
    { role: roleFilter !== 'all' ? roleFilter : undefined, search: search || undefined },
    { refetchOnMountOrArgChange: true }
  );
  const allUsers = res?.data || [];

  // client-side filter for instant search UX (server also filters on refetch)
  const filtered = allUsers.filter(u => {
    const matchSearch = !search ||
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    return matchSearch;
  });

  return (
    <div>
      {/* Summary */}
      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: '1.5rem' }}>
        {[
          { label: 'Total',     val: allUsers.length,                                     color: 'teal' },
          { label: 'Employers', val: allUsers.filter(u => u.role === 'employer').length,  color: 'blue' },
          { label: 'Workers',   val: allUsers.filter(u => u.role === 'worker').length,    color: 'green' },
          { label: 'Agents',    val: allUsers.filter(u => u.role === 'agent').length,     color: 'amber' },
        ].map(c => (
          <div key={c.label} className={`stat-card stat-card--${c.color}`}>
            <div className="stat-body">
              <p className="stat-label">{c.label}</p>
              <p className="stat-value">{c.val}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="section-card">
        {/* Filters */}
        <div className="section-card-header">
          <div className="filter-inner">
            <div className="fi-search">
              <MdSearch className="fi-icon" size={18} />
              <input
                placeholder="Search by name or email…"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <select className="dash-filter-select" value={roleFilter} onChange={e => setRoleFilter(e.target.value)}>
              <option value="all">All Roles</option>
              <option value="employer">Employer</option>
              <option value="worker">Worker</option>
              <option value="agent">Agent</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        </div>

        <div className="section-card-body">
          {isLoading && <p style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>Loading…</p>}
          {isError   && <p style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-error)' }}>Failed to load users.</p>}
          {!isLoading && !isError && (
          <div className="dash-table-wrap">
            <table className="dash-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Phone</th>
                  <th>Joined</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 && (
                  <tr><td colSpan={5} style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '2rem' }}>No users found</td></tr>
                )}
                {filtered.map(u => (
                  <tr key={u._id}>
                    <td>
                      <div className="td-user">
                        <Avatar
                          src={`https://ui-avatars.com/api/?name=${encodeURIComponent(u.name || 'U')}&background=00ABB3&color=fff&size=80`}
                          alt={u.name}
                        />
                        <div className="td-user-info"><div className="name">{u.name}</div></div>
                      </div>
                    </td>
                    <td style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{u.email}</td>
                    <td><span className={`badge ${ROLE_BADGE[u.role] || 'badge-applied'}`}>{u.role}</span></td>
                    <td style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{u.phone || '—'}</td>
                    <td style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                      {new Date(u.createdAt).toLocaleDateString('en-IN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllUsers;

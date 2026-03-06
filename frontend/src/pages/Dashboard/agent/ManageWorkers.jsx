import { useState } from 'react';
import { MdSearch, MdPersonAdd, MdStar, MdLocationOn, MdClose } from 'react-icons/md';
import { workers } from '../data/dummyData';

const STATUS_COLOR = {
  available: '#27AE60',
  'on-job':  '#3182CE',
  inactive:  '#999',
};

const ManageWorkers = () => {
  const [search,   setSearch]   = useState('');
  const [filter,   setFilter]   = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [newWorker, setNewWorker] = useState({ name: '', skill: '', area: '', rate: '' });
  const [list, setList] = useState(workers);

  const filtered = list.filter(w => {
    const matchSearch = w.name.toLowerCase().includes(search.toLowerCase()) ||
                        w.skill.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || w.status === filter;
    return matchSearch && matchFilter;
  });

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newWorker.name || !newWorker.skill) return;
    setList(prev => [...prev, {
      id: Date.now(), ...newWorker,
      status: 'available', rating: 4.0, jobs: 0,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(newWorker.name)}&background=00ABB3&color=fff&size=80`,
    }]);
    setNewWorker({ name: '', skill: '', area: '', rate: '' });
    setShowForm(false);
  };

  return (
    <div>
      {/* Summary */}
      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginBottom: '1.5rem' }}>
        {[
          { label: 'Total Workers',  val: list.length,                                  color: 'teal' },
          { label: 'Available',      val: list.filter(w => w.status === 'available').length, color: 'green' },
          { label: 'On Job',         val: list.filter(w => w.status === 'on-job').length,    color: 'blue' },
        ].map(c => (
          <div key={c.label} className={`stat-card stat-card--${c.color}`}>
            <div className="stat-body">
              <p className="stat-label">{c.label}</p>
              <p className="stat-value">{c.val}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="section-card" style={{ marginBottom: '1.5rem' }}>
        <div className="section-card-header" style={{ flexWrap: 'wrap', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: '1 1 200px' }}>
            <MdSearch size={18} style={{ color: 'var(--text-secondary)' }} />
            <input
              className="dash-search-input"
              placeholder="Search workers…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <select className="dash-filter-select" value={filter} onChange={e => setFilter(e.target.value)}>
              <option value="all">All Status</option>
              <option value="available">Available</option>
              <option value="on-job">On Job</option>
              <option value="inactive">Inactive</option>
            </select>
            <button
              className="btn-icon-action btn-icon-action--teal"
              style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '0.45rem 1rem', borderRadius: '8px', fontSize: '0.82rem' }}
              onClick={() => setShowForm(v => !v)}
            >
              <MdPersonAdd size={16} /> Add Worker
            </button>
          </div>
        </div>

        {/* Add Worker Form */}
        {showForm && (
          <div style={{ padding: '1rem 1.25rem', borderTop: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <h4 style={{ margin: 0, fontSize: '0.9rem' }}>Register New Worker</h4>
              <button onClick={() => setShowForm(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}>
                <MdClose />
              </button>
            </div>
            <form onSubmit={handleAdd} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr auto', gap: '0.5rem', alignItems: 'end' }}>
              <input className="dash-search-input" placeholder="Full Name *" value={newWorker.name} onChange={e => setNewWorker(p => ({ ...p, name: e.target.value }))} required />
              <input className="dash-search-input" placeholder="Skill *" value={newWorker.skill} onChange={e => setNewWorker(p => ({ ...p, skill: e.target.value }))} required />
              <input className="dash-search-input" placeholder="Area / City" value={newWorker.area} onChange={e => setNewWorker(p => ({ ...p, area: e.target.value }))} />
              <input className="dash-search-input" placeholder="Rate (₹/day)" value={newWorker.rate} onChange={e => setNewWorker(p => ({ ...p, rate: e.target.value }))} />
              <button type="submit" className="btn-icon-action btn-icon-action--green" style={{ padding: '0.5rem 1rem', borderRadius: '8px', fontSize: '0.82rem', whiteSpace: 'nowrap' }}>
                Register
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Worker Cards Grid */}
      <div className="worker-cards-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))' }}>
        {filtered.map(w => (
          <div key={w.id} className="worker-card" style={{ padding: '1.25rem', alignItems: 'center', textAlign: 'center' }}>
            <img
              src={w.avatar}
              alt={w.name}
              className="worker-card-avatar"
              style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover', marginBottom: '0.6rem' }}
              onError={e => {
                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(w.name)}&background=00ABB3&color=fff&size=80`;
              }}
            />
            <h4 style={{ margin: '0 0 2px', fontSize: '0.9rem', fontWeight: 700 }}>{w.name}</h4>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: '0 0 0.4rem' }}>{w.skill}</p>
            {w.area && (
              <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', margin: '0 0 0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '2px' }}>
                <MdLocationOn size={11} />{w.area}
              </p>
            )}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '0.4rem' }}>
              <span style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: '12px', background: `${STATUS_COLOR[w.status]}20`, color: STATUS_COLOR[w.status], fontWeight: 600 }}>
                {w.status}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
              <span style={{ color: '#C68A00', display: 'flex', alignItems: 'center', gap: '2px' }}><MdStar size={11} />{w.rating}</span>
              {w.rate && <span>{w.rate}</span>}
            </div>
          </div>
        ))}
      </div>
      {filtered.length === 0 && (
        <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginTop: '2rem' }}>No workers found.</p>
      )}
    </div>
  );
};

export default ManageWorkers;

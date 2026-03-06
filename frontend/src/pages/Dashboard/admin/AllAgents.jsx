import { MdStar, MdLocationOn, MdMonetizationOn, MdSwapHoriz } from 'react-icons/md';
import Avatar from '../../../components/Avatar';
import { topAgents } from '../data/dummyData';

const AllAgents = () => (
  <div>
    <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginBottom: '1.5rem' }}>
      {[
        { label: 'Total Agents',      val: topAgents.length,                                       color: 'teal' },
        { label: 'Total Placements',  val: topAgents.reduce((s, a) => s + a.placements, 0),         color: 'blue' },
        { label: 'Avg Rating',        val: (topAgents.reduce((s, a) => s + a.rating, 0) / topAgents.length).toFixed(1), color: 'amber' },
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
      <div className="section-card-header">
        <div><h3>All Agents</h3><p>Platform agents and their performance</p></div>
      </div>
      <div className="section-card-body">
        <div className="dash-table-wrap">
          <table className="dash-table">
            <thead>
              <tr>
                <th>Agent</th>
                <th>Area</th>
                <th>Placements</th>
                <th>Commission</th>
                <th>Rating</th>
              </tr>
            </thead>
            <tbody>
              {topAgents.map(a => (
                <tr key={a.id}>
                  <td>
                    <div className="td-user">
                      <Avatar src={a.avatar} alt={a.name} />
                      <div className="td-user-info">
                        <div className="name">{a.name}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '2px' }}><MdLocationOn size={13} />{a.area}</span>
                  </td>
                  <td>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 700, color: 'var(--color-accent)' }}>
                      <MdSwapHoriz size={15} />{a.placements}
                    </span>
                  </td>
                  <td style={{ fontWeight: 700, color: '#27AE60' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <MdMonetizationOn size={14} />{a.commission}
                    </span>
                  </td>
                  <td>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '3px', color: '#C68A00', fontWeight: 600, fontSize: '0.85rem' }}>
                      <MdStar size={14} />{a.rating}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
);

export default AllAgents;

import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import '../styles/componentsStyles/AdminChart.scss';

interface AdminChartProps {
  data: any[];
}

const AdminChart: React.FC<AdminChartProps> = ({ data }) => {
  return (
    <div className="admin-charts-container">
      {/* První graf: Růst uživatelů */}
      <div className="chart-card">
        <div className="chart-header">
          <h3>User growth over years</h3>
          <p>New registrations per year</p>
        </div>
        <div className="chart-body">
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2bc3ff" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#2bc3ff" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
              <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
              <Area type="monotone" dataKey="users" stroke="#2bc3ff" strokeWidth={3} fillOpacity={1} fill="url(#colorUsers)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Druhý graf: Součet návštěv (opraveno na 'visits') */}
      <div className="chart-card">
        <div className="chart-header">
          <h3>Total countries visited</h3>
          <p>Cumulative sum of visits by all users</p>
        </div>
        <div className="chart-body">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
              <Tooltip 
                cursor={{ fill: '#f8fafc' }} 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} 
              />
              <Bar 
                dataKey="visits" // Změněno z 'users' na 'visits'
                fill="#2bc3ff" 
                radius={[6, 6, 0, 0]} 
                barSize={40} 
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AdminChart;
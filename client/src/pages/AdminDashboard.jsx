import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { LayoutDashboard, Users, MousePointer2, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      const token = localStorage.getItem('token');
      if (!token) { navigate('/login'); window.scrollTo(0, 0); }

      try {
        const { data } = await axios.get('http://localhost:5000/api/analytics/stats', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStats(data);
      } catch (err) {
        navigate('/login');
      }
    };
    fetchStats();
  }, [navigate]);

  if (!stats) return <div className="p-20 text-center">Loading Analytics...</div>;

  return (
    <div className="pt-24 px-6 max-w-7xl mx-auto pb-20">
      <div className="flex items-center gap-4 mb-12">
        <LayoutDashboard className="text-accent-secondary" size={32} />
        <h1 className="text-4xl font-bold italic tracking-tight">System Analytics</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="glass-card p-6 border-l-4 border-l-accent-primary">
          <div className="flex justify-between items-start opacity-70 mb-4">
            <span className="text-sm font-bold uppercase tracking-wider">Total Hits</span>
            <Activity size={20} />
          </div>
          <div className="text-4xl font-black">{stats.totalVisits}</div>
        </div>
        <div className="glass-card p-6 border-l-4 border-l-accent-secondary">
          <div className="flex justify-between items-start opacity-70 mb-4">
            <span className="text-sm font-bold uppercase tracking-wider">Unique IPs</span>
            <Users size={20} />
          </div>
          <div className="text-4xl font-black">{stats.uniqueVisitors}</div>
        </div>
        <div className="glass-card p-6 border-l-4 border-l-green-500">
          <div className="flex justify-between items-start opacity-70 mb-4">
            <span className="text-sm font-bold uppercase tracking-wider">Avg Session</span>
            <MousePointer2 size={20} />
          </div>
          <div className="text-4xl font-black">2.4m</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass-card p-6">
          <h3 className="text-xl font-bold mb-6">Traffic Trends</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#222" />
                <XAxis dataKey="_id" stroke="#555" fontSize={10} />
                <YAxis stroke="#555" fontSize={10} />
                <Tooltip 
                   contentStyle={{ backgroundColor: '#111', border: '1px solid #333' }}
                />
                <Bar dataKey="visits" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card p-6 overflow-hidden">
          <h3 className="text-xl font-bold mb-6">Recent Activity Stream</h3>
          <div className="space-y-4">
            {stats.recentActivity.map((log, i) => (
              <div key={i} className="flex justify-between items-center text-sm border-b border-white/5 pb-2">
                <div className="flex gap-4">
                  <span className="text-accent-secondary font-mono">{log.ip}</span>
                  <span className="opacity-40">{log.path}</span>
                </div>
                <span className="text-[10px] opacity-30">{new Date(log.timestamp).toLocaleTimeString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

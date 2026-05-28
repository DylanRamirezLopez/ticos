import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiShield, FiUsers, FiFileText, FiMessageCircle, FiActivity, FiMapPin, FiLogOut, FiSearch, FiEye, FiList, FiBarChart2 } from 'react-icons/fi';
import api from '../api/client';

const AdminDashboard = ({ admin, onLogout }) => {
  const [view, setView] = useState('dashboard');
  const [data, setData] = useState(null);
  const [users, setUsers] = useState([]);
  const [userDetail, setUserDetail] = useState(null);
  const [telemetry, setTelemetry] = useState(null);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const adminToken = localStorage.getItem('admin_token');
  const adminApi = {
    get: (url) => api.get(url, { headers: { Authorization: `Admin ${adminToken}` } }),
    post: (url, body) => api.post(url, body, { headers: { Authorization: `Admin ${adminToken}` } }),
  };

  useEffect(() => {
    if (view === 'dashboard') loadDashboard();
    else if (view === 'users') loadUsers();
    else if (view === 'telemetry') loadTelemetry();
  }, [view]);

  const loadDashboard = async () => {
    setLoading(true);
    try {
      const res = await adminApi.get('/admin/dashboard');
      setData(res.data);
    } catch {} finally { setLoading(false); }
  };

  const loadUsers = async (q = '') => {
    setLoading(true);
    try {
      const res = await adminApi.get(`/admin/users?q=${q}&page=1`);
      setUsers(res.data.users || []);
    } catch {} finally { setLoading(false); }
  };

  const loadUserDetail = async (userId) => {
    setLoading(true);
    try {
      const res = await adminApi.get(`/admin/users/${userId}`);
      setUserDetail(res.data);
      setView('userDetail');
    } catch {} finally { setLoading(false); }
  };

  const loadTelemetry = async () => {
    setLoading(true);
    try {
      const res = await adminApi.get('/admin/telemetry');
      setTelemetry(res.data);
    } catch {} finally { setLoading(false); }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    onLogout();
  };

  const StatCard = ({ label, value, icon, color }) => (
    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-2xs text-gray-400 uppercase tracking-wider">{label}</span>
        <span className={`w-8 h-8 rounded-lg ${color} flex items-center justify-center`}>{icon}</span>
      </div>
      <p className="text-2xl font-bold text-white">{value?.toLocaleString() || 0}</p>
    </div>
  );

  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Dashboard</h1>
          <p className="text-xs text-gray-400 mt-0.5">Welcome, {admin?.username} · {admin?.role}</p>
        </div>
        <button onClick={handleLogout} className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-800 hover:bg-gray-700 rounded-lg text-xs text-gray-400 transition-colors">
          <FiLogOut size={12} /> Logout
        </button>
      </div>

      {!data ? (
        <div className="flex justify-center py-12">
          <div className="w-6 h-6 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <StatCard label="Users" value={data.stats.totalUsers} icon={<FiUsers size={14} className="text-white" />} color="bg-blue-600" />
            <StatCard label="Posts" value={data.stats.totalPosts} icon={<FiFileText size={14} className="text-white" />} color="bg-green-600" />
            <StatCard label="Echoes" value={data.stats.totalEchoes} icon={<FiMessageCircle size={14} className="text-white" />} color="bg-purple-600" />
            <StatCard label="Messages" value={data.stats.totalMessages} icon={<FiActivity size={14} className="text-white" />} color="bg-cyan-600" />
            <StatCard label="New Today" value={data.stats.newUsersToday} icon={<FiUsers size={14} className="text-white" />} color="bg-emerald-600" />
            <StatCard label="Active Today" value={data.stats.activeToday} icon={<FiActivity size={14} className="text-white" />} color="bg-orange-600" />
            <StatCard label="Telemetry" value={data.stats.totalTelemetry} icon={<FiBarChart2 size={14} className="text-white" />} color="bg-indigo-600" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-800/30 border border-gray-700/50 rounded-xl p-4">
              <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                <FiActivity size={14} className="text-red-400" /> Recent Activity
              </h3>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {data.recentTelemetry?.slice(0, 15).map((t, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs">
                    <span className="w-2 h-2 rounded-full bg-red-500/50 flex-shrink-0" />
                    <span className="text-gray-400 flex-1 truncate">
                      {t.user?.username || 'anon'} · {t.action}
                    </span>
                    <span className="text-gray-600 flex-shrink-0">{t.country || ''}{t.city ? `, ${t.city}` : ''}</span>
                    <span className="text-gray-600 flex-shrink-0">{new Date(t.createdAt).toLocaleTimeString()}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gray-800/30 border border-gray-700/50 rounded-xl p-4">
              <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                <FiBarChart2 size={14} className="text-red-400" /> Top Endpoints
              </h3>
              <div className="space-y-2">
                {data.topEndpoints?.map((ep, i) => (
                  <div key={i} className="flex items-center justify-between text-xs">
                    <span className="text-gray-400 truncate flex-1">{ep._id}</span>
                    <span className="text-gray-500 ml-2">{ep.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );

  const renderUsers = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-white">Users</h1>
        <button onClick={() => setView('dashboard')} className="text-xs text-gray-400 hover:text-white transition-colors">Back</button>
      </div>

      <div className="relative">
        <FiSearch size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
        <input
          type="text"
          value={search}
          onChange={(e) => { setSearch(e.target.value); loadUsers(e.target.value); }}
          placeholder="Search users by name, username or email..."
          className="w-full pl-9 pr-4 py-2.5 bg-gray-800/50 border border-gray-700 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-red-500 placeholder-gray-500"
        />
      </div>

      <div className="space-y-2">
        {users.map((u) => (
          <button
            key={u._id}
            onClick={() => loadUserDetail(u._id)}
            className="w-full flex items-center gap-3 p-3 bg-gray-800/30 hover:bg-gray-800/50 border border-gray-700/30 rounded-xl transition-colors text-left"
          >
            <div className="w-9 h-9 rounded-full overflow-hidden bg-gray-700 flex-shrink-0">
              {u.avatar ? (
                <img src={u.avatar} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-gray-600 to-gray-700 flex items-center justify-center text-white text-xs font-bold">
                  {u.name?.[0]?.toUpperCase() || '?'}
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">{u.username}</p>
              <p className="text-2xs text-gray-400 truncate">{u.name} · {u.email}</p>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="text-xs text-gray-400">{u.activityCount || 0} actions</p>
              <p className="text-2xs text-gray-600">{u.postsCount || 0} posts</p>
            </div>
            <div className="text-right flex-shrink-0 ml-2">
              <p className="text-2xs text-gray-500">{u.lastCountry || ''}{u.lastCity ? `, ${u.lastCity}` : ''}</p>
              <p className="text-2xs text-gray-600">
                {u.lastActivity ? new Date(u.lastActivity).toLocaleDateString() : 'Never'}
              </p>
            </div>
          </button>
        ))}
        {users.length === 0 && !loading && (
          <p className="text-center text-gray-500 text-sm py-8">No users found</p>
        )}
      </div>
    </div>
  );

  const renderUserDetail = () => {
    if (!userDetail) return null;
    const { user, stats, posts, loginHistory, telemetry: userTel, messages } = userDetail;

    return (
      <div className="space-y-4">
        <button onClick={() => { setView('users'); setUserDetail(null); }} className="text-xs text-gray-400 hover:text-white transition-colors">&larr; Back to users</button>

        <div className="bg-gray-800/30 border border-gray-700/50 rounded-xl p-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-700">
              {user.avatar ? (
                <img src={user.avatar} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-gray-600 to-gray-700 flex items-center justify-center text-white font-bold">
                  {user.name?.[0]?.toUpperCase() || '?'}
                </div>
              )}
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">{user.username}</h2>
              <p className="text-xs text-gray-400">{user.name} · {user.email}</p>
              <p className="text-xs text-gray-500">Joined: {new Date(user.createdAt).toLocaleDateString()}</p>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-2 text-center mb-4">
            <div className="bg-gray-800/50 rounded-lg p-2">
              <p className="text-lg font-bold text-white">{stats.postsCount}</p>
              <p className="text-2xs text-gray-400">Posts</p>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-2">
              <p className="text-lg font-bold text-white">{stats.telemetryCount}</p>
              <p className="text-2xs text-gray-400">Actions</p>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-2">
              <p className="text-lg font-bold text-white">{stats.messagesSent}</p>
              <p className="text-2xs text-gray-400">Sent</p>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-2">
              <p className="text-lg font-bold text-white">{stats.messagesReceived}</p>
              <p className="text-2xs text-gray-400">Received</p>
            </div>
          </div>

          {user.bio && <p className="text-xs text-gray-400 mb-2">Bio: {user.bio}</p>}
          <p className="text-xs text-gray-500">
            Anonymous: {user.anonymousModeEnabled ? 'YES' : 'NO'} · Language: {user.language || 'en'}
          </p>
        </div>

        <div className="bg-gray-800/30 border border-gray-700/50 rounded-xl p-4">
          <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
            <FiMapPin size={14} className="text-red-400" /> Login History
          </h3>
          <div className="space-y-1.5 max-h-40 overflow-y-auto">
            {loginHistory?.map((h, i) => (
              <div key={i} className="flex items-center justify-between text-xs">
                <span className="text-gray-400">{h.country}{h.city ? `, ${h.city}` : ''}</span>
                <span className="text-gray-500">{h.userAgent?.substring(0, 40)}...</span>
                <span className="text-gray-600">{new Date(h.time).toLocaleString()}</span>
              </div>
            )) || <p className="text-gray-600 text-xs">No login history</p>}
          </div>
        </div>

        <div className="bg-gray-800/30 border border-gray-700/50 rounded-xl p-4">
          <h3 className="text-sm font-semibold text-white mb-3">Recent Posts</h3>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {posts?.map((p) => (
              <div key={p._id} className="text-xs text-gray-400 border-b border-gray-700/30 pb-2">
                <span className="text-gray-500">{new Date(p.createdAt).toLocaleDateString()}</span>
                {' · '}{p.type === 'text' ? p.text?.substring(0, 100) : p.caption?.substring(0, 100) || '[image]'}
                {' · '}{p.likes?.length || 0} likes
              </div>
            )) || <p className="text-gray-600 text-xs">No posts</p>}
          </div>
        </div>

        <div className="bg-gray-800/30 border border-gray-700/50 rounded-xl p-4">
          <h3 className="text-sm font-semibold text-white mb-3">Recent Messages</h3>
          <div className="space-y-1.5 max-h-48 overflow-y-auto">
            {messages?.sent?.slice(0, 10).map((m) => (
              <div key={m._id} className="text-xs text-gray-400">
                <span className="text-gray-500">To {m.receiver?.username}:</span> {m.text?.substring(0, 80)}
              </div>
            ))}
            {(!messages?.sent || messages.sent.length === 0) && <p className="text-gray-600 text-xs">No messages</p>}
          </div>
        </div>
      </div>
    );
  };

  const renderTelemetry = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-white">Telemetry</h1>
        <button onClick={() => setView('dashboard')} className="text-xs text-gray-400 hover:text-white transition-colors">Back</button>
      </div>

      {telemetry?.summary && (
        <div className="grid grid-cols-6 md:grid-cols-10 gap-1">
          {telemetry.summary.slice(0, 14).map((d) => (
            <div key={d._id} className="bg-gray-800/30 border border-gray-700/30 rounded-lg p-2 text-center">
              <p className="text-xs font-bold text-white">{d.count}</p>
              <p className="text-2xs text-gray-500">{d._id?.slice(5)}</p>
            </div>
          ))}
        </div>
      )}

      <div className="bg-gray-800/30 border border-gray-700/50 rounded-xl p-4">
        <h3 className="text-sm font-semibold text-white mb-3">Top Active Users</h3>
        <div className="space-y-1.5">
          {telemetry?.topUsers?.map((u, i) => (
            <div key={i} className="flex items-center justify-between text-xs">
              <span className="text-gray-400">{u.user?.username || 'Unknown'}</span>
              <span className="text-gray-500">{u.count} actions</span>
            </div>
          )) || <p className="text-gray-600 text-xs">No data</p>}
        </div>
      </div>

      <div className="bg-gray-800/30 border border-gray-700/50 rounded-xl p-4">
        <h3 className="text-sm font-semibold text-white mb-3">Raw Feed</h3>
        <div className="space-y-1 max-h-96 overflow-y-auto">
          {telemetry?.telemetry?.slice(0, 30).map((t, i) => (
            <div key={i} className="flex items-center gap-2 text-2xs border-b border-gray-800/50 pb-1">
              <span className="text-gray-500 w-16">{new Date(t.createdAt).toLocaleTimeString()}</span>
              <span className="text-gray-400 w-20 truncate">{t.user?.username || 'anon'}</span>
              <span className="text-gray-500 flex-1 truncate">{t.action}</span>
              <span className="text-gray-600 w-16">{t.country || ''}</span>
              <span className="text-gray-600 w-8 text-right">{t.duration}ms</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const NavButton = ({ label, icon, viewName }) => (
    <button
      onClick={() => setView(viewName)}
      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
        view === viewName ? 'bg-red-600/20 text-red-400 border border-red-600/30' : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
      }`}
    >
      {icon} {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-black flex">
      <div className="w-16 md:w-48 bg-gray-900/50 border-r border-gray-800 p-3 flex flex-col gap-1">
        <div className="flex items-center gap-2 mb-6 px-2">
          <FiShield size={18} className="text-red-500" />
          <span className="hidden md:block text-sm font-bold text-white">TICOS</span>
        </div>
        <NavButton label="Dashboard" icon={<FiBarChart2 size={14} />} viewName="dashboard" />
        <NavButton label="Users" icon={<FiUsers size={14} />} viewName="users" />
        <NavButton label="Telemetry" icon={<FiActivity size={14} />} viewName="telemetry" />
        <div className="flex-1" />
        <button onClick={handleLogout} className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-gray-500 hover:text-red-400 hover:bg-gray-800/50 transition-all">
          <FiLogOut size={14} /> <span className="hidden md:block">Logout</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 md:p-6">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-6 h-6 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {view === 'dashboard' && renderDashboard()}
            {view === 'users' && renderUsers()}
            {view === 'userDetail' && renderUserDetail()}
            {view === 'telemetry' && renderTelemetry()}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;

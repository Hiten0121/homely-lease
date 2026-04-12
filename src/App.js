// import React, { useState } from 'react';
// import { 
//   Users, Bell, Home, LogOut, 
//   Zap, CheckCircle2, ArrowLeft, 
//   Download, Clock, Filter, TrendingUp, AlertCircle
// } from 'lucide-react';

import React, { useState } from 'react';
// import { 
//   Users, CreditCard, Settings, Bell, Home, User, Lock, LogOut, 
//   Zap, CheckCircle2, ChevronRight, Download, X, Menu, 
//   ShieldAlert, Landmark, Save, Eye, Filter, Clock, 
//   AlertCircle, TrendingUp, ZapOff, Check, Ban
// } from 'lucide-react';

import { 
  Users, CreditCard, Settings, Bell, Home, User, Lock, Mail, LogOut, 
  Smartphone, Zap, ShieldCheck, CheckCircle2, ArrowLeft, ChevronRight, 
  Globe, CreditCard as CardIcon, Eye, Download, X, Upload, Trash2, Save,
  ShieldAlert, Landmark, Building, Menu, FileText, Calendar, Clock,
  Coins, Filter, Check, Ban // Added the missing icons here
} from 'lucide-react';

/**
 * HOMELY - INTEGRATED PROPERTY MANAGEMENT SYSTEM
 * * Features included:
 * - Role-based Dashboard (Resident/Landlord)
 * - Automatic Electricity Calculation (Units * Price)
 * - 5-Day Grace Period Late Fee Logic
 * - Landlord Approval/Rejection Queue
 * - Financial Statistics Tracking
 */

const App = () => {
  // --- Auth & Navigation State ---
  const [userRole, setUserRole] = useState(null); // 'admin' or 'tenant'
  const [loginMode, setLoginMode] = useState('tenant'); 
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [authData, setAuthData] = useState({ identifier: '', password: '' });
  const [error, setError] = useState('');

  // --- Central Data Management ---
  const [tenants, setTenants] = useState([
    { 
      id: 1, 
      name: 'Rajesh Kumar', 
      room: 'A-101', 
      status: 'Pending', 
      amount: 12500, 
      dueDate: '2026-04-05', 
      prevReading: 1020,
      currReading: 1150,
      unitPrice: 10,
      lateFeePerDay: 50,
      email: 'rajesh.k@example.com',
      history: [{ month: 'March', amount: 13200, status: 'Paid', date: '02/03/2026' }]
    },
    { 
      id: 2, 
      name: 'Anita Sharma', 
      room: 'B-204', 
      status: 'Pending Approval', 
      amount: 15000, 
      dueDate: '2026-04-05', 
      prevReading: 500, 
      currReading: 580, 
      unitPrice: 10, 
      lateFeePerDay: 50,
      email: 'anita.s@example.com',
      history: []
    },
  ]);

  const [notifications, setNotifications] = useState([
    { message: "Anita Sharma submitted a payment for approval", time: "2 hours ago" },
    { message: "System: Electricity unit rates updated to ₹10/unit", time: "1 day ago" }
  ]);

  // --- Core Utility Logic ---
  const calculateElectricity = (t) => (t.currReading - t.prevReading) * t.unitPrice;
  
  const calculateLateFee = (t) => {
    const due = new Date(t.dueDate);
    const today = new Date();
    const diffTime = today - due;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 5 ? (diffDays - 5) * t.lateFeePerDay : 0;
  };

  const getTotalPayable = (t) => t.amount + calculateElectricity(t) + calculateLateFee(t);

  // --- Auth Handler ---
  const handleLogin = (e) => {
    e.preventDefault();
    setError('');

    // Demo Credentials
    const credentials = {
      admin: { id: 'admin123', pass: 'landlord@2026' },
      tenant: { id: '9876543210', pass: 'tenant@101' }
    };

    if (loginMode === 'admin') {
      if (authData.identifier === credentials.admin.id && authData.password === credentials.admin.pass) {
        setUserRole('admin');
        setActiveTab('Dashboard');
      } else {
        setError('Invalid Landlord Credentials');
      }
    } else {
      if (authData.identifier === credentials.tenant.id && authData.password === credentials.tenant.pass) {
        setUserRole('tenant');
        setActiveTab('Overview');
      } else {
        setError('Invalid Resident ID or Password');
      }
    }
  };

  const handleLogout = () => {
    setUserRole(null);
    setAuthData({ identifier: '', password: '' });
    setError('');
  };

  // --- Admin Logic ---
  const handleLandlordAction = (tenantId, action) => {
    setTenants(prev => prev.map(t => {
      if (t.id === tenantId) {
        if (action === 'approve') {
          return { 
            ...t, 
            status: 'Paid',
            history: [{ month: 'Current', amount: getTotalPayable(t), status: 'Paid', date: new Date().toLocaleDateString() }, ...t.history]
          };
        }
        return { ...t, status: 'Rejected' };
      }
      return t;
    }));
  };

  // --- LOGIN SCREEN ---
  if (!userRole) {
    return (
      <div className="min-h-screen bg-[#0F172A] flex items-center justify-center p-4">
        <div className="w-full max-w-4xl bg-white rounded-[3.5rem] overflow-hidden shadow-2xl grid grid-cols-1 md:grid-cols-2">
          {/* Branding */}
          <div className="bg-slate-900 p-16 text-white flex flex-col justify-between hidden md:flex">
            <div className="flex items-center gap-3 italic font-black text-2xl">
              <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center not-italic">H</div> Homely
            </div>
            <h1 className="text-5xl font-black leading-tight italic">Manage Your<br/>Property.<br/>Better.</h1>
            <div className="p-6 bg-slate-800/50 rounded-3xl border border-slate-700">
              <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">Demo Access:</p>
              <p className="text-[9px] text-indigo-400 font-mono">Admin: admin123 / landlord@2026</p>
              <p className="text-[9px] text-indigo-400 font-mono">Tenant: 9876543210 / tenant@101</p>
            </div>
          </div>

          {/* Form */}
          <div className="p-8 md:p-16 flex flex-col justify-center">
            <div className="flex gap-2 p-1 bg-slate-100 rounded-2xl mb-10">
              <button onClick={() => setLoginMode('tenant')} className={`flex-1 py-4 rounded-xl text-[10px] font-black uppercase transition-all ${loginMode === 'tenant' ? 'bg-white text-indigo-600 shadow-xl' : 'text-slate-400'}`}>Resident</button>
              <button onClick={() => setLoginMode('admin')} className={`flex-1 py-4 rounded-xl text-[10px] font-black uppercase transition-all ${loginMode === 'admin' ? 'bg-white text-indigo-600 shadow-xl' : 'text-slate-400'}`}>Landlord</button>
            </div>
            
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="relative">
                <User className="absolute left-6 top-5 text-slate-300" size={18}/>
                <input 
                  type="text" 
                  placeholder={loginMode === 'admin' ? "Admin ID" : "Mobile Number"} 
                  value={authData.identifier}
                  onChange={(e) => setAuthData({...authData, identifier: e.target.value})}
                  className="w-full bg-slate-50 border-2 border-transparent focus:border-indigo-600 rounded-2xl py-5 pl-16 px-8 font-black outline-none transition-all" 
                  required 
                />
              </div>
              <div className="relative">
                <Lock className="absolute left-6 top-5 text-slate-300" size={18}/>
                <input 
                  type="password" 
                  placeholder="Password" 
                  value={authData.password}
                  onChange={(e) => setAuthData({...authData, password: e.target.value})}
                  className="w-full bg-slate-50 border-2 border-transparent focus:border-indigo-600 rounded-2xl py-5 pl-16 px-8 font-black outline-none transition-all" 
                  required 
                />
              </div>

              {error && (
                <div className="p-4 bg-red-50 text-red-500 rounded-2xl text-[10px] font-black uppercase flex items-center gap-2">
                  <ShieldAlert size={14}/> {error}
                </div>
              )}

              <button className="w-full bg-slate-900 text-white font-black py-5 rounded-2xl uppercase tracking-[0.2em] text-xs shadow-2xl hover:bg-indigo-600 transition-all">
                Sign In <ChevronRight className="inline ml-2" size={14}/>
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // --- MAIN APP ROUTING ---
  return userRole === 'admin' ? (
    <AdminPortal 
      tenants={tenants} 
      setTenants={setTenants}
      notifications={notifications}
      activeTab={activeTab} 
      setActiveTab={setActiveTab} 
      onAction={handleLandlordAction}
      logout={handleLogout} 
      calcTotal={getTotalPayable}
      calcElec={calculateElectricity}
    />
  ) : (
    <TenantPortal 
      tenant={tenants[0]} 
      logout={handleLogout} 
      calcElec={calculateElectricity} 
      calcLate={calculateLateFee} 
      calcTotal={getTotalPayable} 
    />
  );
};


// --- Landlord View ---
const AdminPortal = ({ tenants, setTenants, notifications, activeTab, setActiveTab, onAction, logout, calcTotal, calcElec }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMeterModalOpen, setIsMeterModalOpen] = useState(false);
  const [editingTenant, setEditingTenant] = useState(null);
  const [newReading, setNewReading] = useState('');

  // --- Detailed Stats Calculation ---
  const totalRevenue = tenants.reduce((acc, t) => acc + calcTotal(t), 0);
  const pendingCount = tenants.filter(t => t.status.includes('Pending')).length;
  const occupiedRooms = tenants.length;

  const updateMeterReading = () => {
    if (!newReading || isNaN(newReading)) return;
    setTenants(prev => prev.map(t => 
      t.id === editingTenant.id ? { ...t, prevReading: t.currReading, currReading: parseInt(newReading) } : t
    ));
    setIsMeterModalOpen(false);
    setNewReading('');
    setEditingTenant(null);
  };

  return (
    <div className="flex h-screen bg-[#F8FAFC]">
      {/* Sidebar Navigation */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-slate-900 text-white p-8 flex flex-col transition-transform md:relative md:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-3 font-black italic text-xl">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center not-italic text-white">H</div> 
            <span className="tracking-tighter">HOMELY.</span>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="md:hidden text-slate-400"><X/></button>
        </div>
        
        <nav className="space-y-2 flex-1">
          {[
            { id: 'Dashboard', icon: <Home size={18}/> },
            { id: 'Tenants', icon: <Users size={18}/> },
            { id: 'Billing', icon: <Zap size={18}/> },
            { id: 'Notifications', icon: <Bell size={18}/> },
            { id: 'Settings', icon: <Settings size={18}/> }
          ].map(item => (
            <button 
              key={item.id} 
              onClick={() => {setActiveTab(item.id); setSidebarOpen(false);}} 
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.15em] transition-all ${activeTab === item.id ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'text-slate-500 hover:text-white hover:bg-slate-800'}`}
            >
              {item.icon} {item.id}
            </button>
          ))}
        </nav>

        <button onClick={logout} className="mt-auto flex items-center gap-4 px-6 py-4 text-slate-500 hover:text-red-400 font-black uppercase text-[10px] tracking-widest">
          <LogOut size={18}/> Logout
        </button>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="h-24 bg-white/80 backdrop-blur-md border-b px-8 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="md:hidden p-3 bg-slate-100 rounded-xl text-slate-600"><Menu size={20}/></button>
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest">{activeTab}</h2>
          </div>
          <div className="flex items-center gap-6">
            <div className="hidden sm:block text-right">
              <p className="text-[10px] font-black text-slate-400 uppercase">System Status</p>
              <p className="text-[10px] font-bold text-emerald-500 flex items-center justify-end gap-1">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse mr-1 inline-block"/> LIVE
              </p>
            </div>
            <div className="w-12 h-12 bg-slate-100 border rounded-2xl flex items-center justify-center font-black text-slate-600 shadow-inner">AD</div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-8 md:p-12 space-y-10">
          
          {/* DASHBOARD TAB */}
          {activeTab === 'Dashboard' && (
            <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden group hover:border-indigo-200 transition-all">
                  <div className="absolute top-0 right-0 p-8 text-slate-50 group-hover:text-indigo-50 transition-colors"><Building size={80}/></div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Expected Revenue</p>
                  <h3 className="text-4xl font-black italic text-slate-900">₹{totalRevenue.toLocaleString()}</h3>
                </div>
                
                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Total Tenants</p>
                  <h3 className="text-4xl font-black italic text-slate-900">{occupiedRooms} <span className="text-sm not-italic font-bold text-slate-300">/ 20</span></h3>
                </div>

                <div className="bg-indigo-600 p-8 rounded-[2.5rem] shadow-xl shadow-indigo-200 text-white">
                  <p className="text-[10px] font-black text-indigo-200 uppercase tracking-widest mb-2">Action Required</p>
                  <h3 className="text-4xl font-black italic">{pendingCount} <span className="text-sm not-italic font-bold text-indigo-300">Pending</span></h3>
                </div>
              </section>

              {/* Approval Table */}
              <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 border-b border-slate-100">
                    <tr>
                      <th className="p-8 text-[9px] font-black text-slate-400 uppercase">Resident Details</th>
                      <th className="p-8 text-[9px] font-black text-slate-400 uppercase text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {tenants.map(t => (
                      <tr key={t.id} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="p-8">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center font-black italic">{t.room}</div>
                            <div>
                              <p className="font-black text-slate-900 italic">{t.name}</p>
                              <p className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full inline-block mt-1 ${t.status === 'Paid' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                                {t.status}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="p-8 text-right">
                           <div className="flex items-center justify-end gap-2">
                             {t.status === 'Pending Approval' && (
                               <>
                                 <button onClick={() => onAction(t.id, 'approve')} className="p-3 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-200"><Check size={16}/></button>
                                 <button onClick={() => onAction(t.id, 'reject')} className="p-3 bg-red-100 text-red-500 rounded-xl hover:bg-red-200 transition-all"><Ban size={16}/></button>
                               </>
                             )}
                           </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TENANTS TAB */}
          {activeTab === 'Tenants' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-right-4 duration-500">
              {tenants.map(t => (
                <div key={t.id} className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all flex items-center gap-8 group">
                   <div className="w-20 h-20 bg-slate-100 rounded-[2rem] flex items-center justify-center text-slate-900 font-black italic text-2xl group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-500">
                     {t.room}
                   </div>
                   <div className="flex-1">
                     <h4 className="text-xl font-black italic text-slate-900">{t.name}</h4>
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 mt-1">
                       <Mail size={12}/> {t.email}
                     </p>
                     <div className="flex gap-4 mt-4">
                       <button className="text-[9px] font-black uppercase text-indigo-600 bg-indigo-50 px-4 py-2 rounded-xl">Edit Profile</button>
                       <button className="text-[9px] font-black uppercase text-slate-400 hover:text-red-500">End Lease</button>
                     </div>
                   </div>
                </div>
              ))}
            </div>
          )}

          {/* BILLING TAB */}
          {activeTab === 'Billing' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
               {tenants.map(t => (
                 <div key={t.id} className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm flex flex-col md:flex-row items-center gap-8">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center font-black italic text-xs">{t.room}</span>
                        <h4 className="text-xl font-black italic">{t.name}</h4>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-6 p-6 bg-slate-50 rounded-3xl border border-slate-100/50">
                        <div>
                          <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Last Meter</p>
                          <p className="font-bold text-slate-900">{t.currReading} <span className="text-[9px] text-slate-400">kWh</span></p>
                        </div>
                        <div>
                          <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Elec. Charge</p>
                          <p className="font-bold text-amber-500">₹{calcElec(t)}</p>
                        </div>
                        <div>
                          <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Rent Amount</p>
                          <p className="font-bold text-slate-900">₹{t.amount}</p>
                        </div>
                        <div>
                          <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Total Due</p>
                          <p className="font-black text-indigo-600">₹{calcTotal(t)}</p>
                        </div>
                      </div>
                    </div>
                    <button 
                      onClick={() => { setEditingTenant(t); setIsMeterModalOpen(true); }}
                      className="px-10 py-5 bg-slate-900 text-white rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] shadow-xl hover:bg-indigo-600 transition-all flex items-center gap-2"
                    >
                      <Zap size={14}/> Update Meter
                    </button>
                 </div>
               ))}
            </div>
          )}

          {/* NOTIFICATIONS TAB */}
          {activeTab === 'Notifications' && (
            <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in zoom-in-95 duration-500">
               <div className="flex items-center justify-between mb-8">
                  <h3 className="text-2xl font-black italic uppercase tracking-tighter">Activity Feed</h3>
                  <button className="text-[10px] font-black text-slate-400 uppercase hover:text-indigo-600">Mark all as read</button>
               </div>
               {(notifications || []).map((n, i) => (
                 <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex gap-6 items-start hover:border-indigo-100 transition-all">
                    <div className={`p-4 rounded-2xl ${n.message.includes('approval') ? 'bg-amber-50 text-amber-500' : 'bg-indigo-50 text-indigo-500'}`}>
                      <Bell size={20}/>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-slate-900 leading-tight mb-2">{n.message}</p>
                      <div className="flex items-center gap-4">
                        <span className="text-[10px] font-black text-slate-300 uppercase flex items-center gap-1"><Clock size={12}/> {n.time}</span>
                        <button className="text-[10px] font-black text-indigo-600 uppercase">View</button>
                      </div>
                    </div>
                 </div>
               ))}
            </div>
          )}

          {activeTab === 'Settings' && (
            <div className="max-w-4xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
               
               {/* Profile Section */}
               <section className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm flex flex-col md:flex-row items-center gap-10">
                  <div className="relative group">
                  <div className="w-32 h-32 bg-slate-900 rounded-[2.5rem] flex items-center justify-center text-white text-4xl font-black italic shadow-2xl">
                     AD
                  </div>
                  <button className="absolute -bottom-2 -right-2 p-3 bg-indigo-600 text-white rounded-2xl shadow-xl hover:scale-110 transition-transform">
                     <Upload size={18} />
                  </button>
                  </div>
                  <div className="flex-1 text-center md:text-left">
                  <h3 className="text-3xl font-black italic text-slate-900">Admin Account</h3>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">Property Management ID: #LAND-2026-X</p>
                  <div className="flex flex-wrap gap-3 mt-6 justify-center md:justify-start">
                     <button className="px-6 py-3 bg-slate-100 text-slate-600 rounded-xl font-black uppercase text-[9px] tracking-widest hover:bg-slate-200 transition-all">Edit Profile</button>
                     <button className="px-6 py-3 bg-slate-100 text-slate-600 rounded-xl font-black uppercase text-[9px] tracking-widest hover:bg-slate-200 transition-all">Change Password</button>
                  </div>
                  </div>
               </section>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Property Configuration */}
                  <section className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm space-y-6">
                  <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.3em] flex items-center gap-2 mb-4">
                     <Building size={16} className="text-indigo-600"/> Property Rates
                  </h4>
                  
                  <div className="space-y-4">
                     <div className="flex items-center justify-between p-5 bg-slate-50 rounded-2xl border border-slate-100">
                        <div>
                        <p className="text-[9px] font-black text-slate-400 uppercase">Electricity Unit Rate</p>
                        <p className="font-black italic text-slate-900">₹10.00 <span className="text-[9px] not-italic text-slate-400">/ Unit</span></p>
                        </div>
                        <button className="text-indigo-600 hover:rotate-90 transition-transform"><Settings size={18}/></button>
                     </div>

                     <div className="flex items-center justify-between p-5 bg-slate-50 rounded-2xl border border-slate-100">
                        <div>
                        <p className="text-[9px] font-black text-slate-400 uppercase">Late Payment Fee</p>
                        <p className="font-black italic text-slate-900">₹50.00 <span className="text-[9px] not-italic text-slate-400">/ Day</span></p>
                        </div>
                        <button className="text-indigo-600 hover:rotate-90 transition-transform"><Settings size={18}/></button>
                     </div>

                     <div className="flex items-center justify-between p-5 bg-slate-50 rounded-2xl border border-slate-100">
                        <div>
                        <p className="text-[9px] font-black text-slate-400 uppercase">Water Flat Rate</p>
                        <p className="font-black italic text-slate-900">₹200.00 <span className="text-[9px] not-italic text-slate-400">/ Month</span></p>
                        </div>
                        <button className="text-indigo-600 hover:rotate-90 transition-transform"><Settings size={18}/></button>
                     </div>
                  </div>
                  </section>

                  {/* Preferences & Security */}
                  <section className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm space-y-6">
                  <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.3em] flex items-center gap-2 mb-4">
                     <ShieldCheck size={16} className="text-indigo-600"/> Security & App
                  </h4>
                  
                  <div className="space-y-4">
                     <div className="flex items-center justify-between p-2">
                        <span className="text-[10px] font-black text-slate-500 uppercase">Email Notifications</span>
                        <div className="w-12 h-6 bg-indigo-600 rounded-full relative p-1 cursor-pointer">
                        <div className="w-4 h-4 bg-white rounded-full absolute right-1" />
                        </div>
                     </div>
                     
                     <div className="flex items-center justify-between p-2 border-t border-slate-50 pt-4">
                        <span className="text-[10px] font-black text-slate-500 uppercase">Two-Factor Auth</span>
                        <div className="w-12 h-6 bg-slate-200 rounded-full relative p-1 cursor-pointer">
                        <div className="w-4 h-4 bg-white rounded-full absolute left-1" />
                        </div>
                     </div>

                     <div className="flex items-center justify-between p-2 border-t border-slate-50 pt-4">
                        <span className="text-[10px] font-black text-slate-500 uppercase">WhatsApp Alerts</span>
                        <div className="w-12 h-6 bg-indigo-600 rounded-full relative p-1 cursor-pointer">
                        <div className="w-4 h-4 bg-white rounded-full absolute right-1" />
                        </div>
                     </div>
                  </div>

                  <div className="pt-6">
                     <button onClick={logout} className="w-full bg-red-50 text-red-500 py-5 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] hover:bg-red-500 hover:text-white transition-all flex items-center justify-center gap-3">
                        <LogOut size={16}/> Terminate Session
                     </button>
                  </div>
                  </section>
               </div>
            </div>
            )}
        </main>
      </div>

      {/* --- METER MODAL --- */}
      {isMeterModalOpen && editingTenant && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsMeterModalOpen(false)} />
          <div className="bg-white w-full max-w-md rounded-[3.5rem] p-12 shadow-2xl relative animate-in fade-in zoom-in-95 duration-300">
             <div className="flex justify-between items-center mb-10">
               <div>
                 <h3 className="text-2xl font-black italic text-slate-900">Meter Update</h3>
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{editingTenant.name} • Room {editingTenant.room}</p>
               </div>
               <button onClick={() => setIsMeterModalOpen(false)} className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all">
                 <X size={20}/>
               </button>
             </div>

             <div className="space-y-6">
               <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                  <p className="text-[9px] font-black text-slate-400 uppercase mb-2">Previous Reading Recorded</p>
                  <p className="text-xl font-black text-slate-900 italic">{editingTenant.currReading} Units</p>
               </div>

               <div className="relative">
                 <p className="text-[9px] font-black text-slate-400 uppercase mb-2 ml-4">New Reading Value</p>
                 <input 
                   type="number" 
                   value={newReading} 
                   onChange={(e) => setNewReading(e.target.value)} 
                   placeholder="0000"
                   autoFocus
                   className="w-full bg-slate-900 text-white p-8 rounded-[2rem] text-3xl font-black italic outline-none border-4 border-indigo-600/0 focus:border-indigo-600 transition-all" 
                 />
                 <div className="absolute right-8 bottom-8 text-indigo-400 font-black italic text-sm">Units</div>
               </div>

               <button 
                 onClick={updateMeterReading} 
                 className="w-full bg-indigo-600 text-white py-6 rounded-[2rem] font-black uppercase text-xs tracking-[0.3em] shadow-xl shadow-indigo-200 hover:bg-slate-900 transition-all mt-4"
               >
                 Confirm Update
               </button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

// export default AdminPortal;

const StatCard = ({ label, val, icon, color }) => (
  <div className="bg-white p-10 rounded-[2.5rem] border shadow-sm relative overflow-hidden">
    <div className={`absolute top-0 right-0 p-8 text-${color}-500/10`}>{icon}</div>
    <p className="text-[9px] font-black uppercase text-slate-400 mb-2 tracking-widest">{label}</p>
    <h3 className="text-3xl font-black italic">{val}</h3>
  </div>
);

// --- Resident View ---
const TenantPortal = ({ tenant, logout, calcElec, calcLate, calcTotal }) => {
  const [activeTab, setActiveTab] = useState('Overview');
  
  // Calculate real-time values
  const electricity = calcElec(tenant);
  const lateFee = calcLate(tenant);
  const total = calcTotal(tenant);

  return (
    <div className="min-h-screen bg-[#FDFDFD] flex flex-col">
      {/* Header Navigation */}
      <header className="h-24 bg-white border-b px-6 md:px-12 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3 italic font-black text-xl text-indigo-600">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center not-italic text-white text-sm">H</div>
          MyHome
        </div>
        <nav className="flex gap-4 md:gap-10">
          {['Overview', 'History', 'Settings'].map(t => (
            <button 
              key={t} 
              onClick={() => setActiveTab(t)} 
              className={`text-[10px] font-black uppercase tracking-widest pb-1 border-b-2 transition-all ${
                activeTab === t ? 'text-indigo-600 border-indigo-600' : 'text-slate-300 border-transparent'
              }`}
            >
              {t}
            </button>
          ))}
          <button onClick={logout} className="text-[10px] font-black uppercase text-red-500 hover:text-red-700 transition-colors">
            <LogOut size={16} className="inline mr-1 md:hidden" />
            <span className="hidden md:inline">Sign Out</span>
          </button>
        </nav>
      </header>

      <main className="p-6 md:p-12 max-w-6xl mx-auto w-full flex-1">
        {/* Tab Switching Logic */}
        {activeTab === 'Overview' && (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Hero Invoice Card */}
            <div className="bg-slate-900 rounded-[3.5rem] p-8 md:p-16 text-white shadow-2xl relative overflow-hidden">
              <p className="text-[10px] font-black uppercase text-slate-400 mb-4 tracking-widest italic">Current Invoice • {tenant.room}</p>
              <h2 className="text-5xl md:text-7xl font-black tracking-tighter italic mb-8">₹{total.toLocaleString()}</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 border-t border-white/10 pt-8">
                <div><p className="text-[9px] uppercase text-slate-500 mb-1">Monthly Rent</p><p className="font-bold text-lg">₹{tenant.amount.toLocaleString()}</p></div>
                <div><p className="text-[9px] uppercase text-slate-500 mb-1">Electricity ({tenant.currReading - tenant.prevReading} units)</p><p className="font-bold text-lg">₹{electricity.toLocaleString()}</p></div>
                {lateFee > 0 && <div><p className="text-[9px] uppercase text-red-400 mb-1">Late Fee (Grace Period Over)</p><p className="font-bold text-red-400 text-lg">₹{lateFee.toLocaleString()}</p></div>}
              </div>

              <div className="flex flex-wrap gap-4 items-center">
                <div className={`inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-black uppercase text-xs border ${
                  tenant.status === 'Paid' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-slate-500/10 text-slate-400 border-white/10'
                }`}>
                  {tenant.status === 'Paid' ? <CheckCircle2 size={20}/> : <Clock size={20}/>} {tenant.status}
                </div>
                {tenant.status !== 'Paid' && (
                   <button className="bg-indigo-600 hover:bg-indigo-500 text-white px-10 py-4 rounded-2xl font-black uppercase text-xs transition-all shadow-xl shadow-indigo-900/20">
                     Pay Bill Now
                   </button>
                )}
              </div>
            </div>

            {/* Utility & Documents Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm">
                <h4 className="text-[10px] font-black uppercase text-slate-400 mb-6 tracking-widest italic flex items-center gap-2">
                  <Zap size={14} className="text-indigo-600"/> Utility Tracking
                </h4>
                <div className="flex justify-between items-center bg-slate-50 p-6 rounded-3xl">
                  <div><p className="text-[9px] font-black text-slate-400 uppercase">Prev. Meter</p><p className="text-xl font-bold">{tenant.prevReading}</p></div>
                  <div className="h-px flex-1 bg-slate-200 mx-4 hidden sm:block"></div>
                  <div className="text-right"><p className="text-[9px] font-black text-slate-400 uppercase">Curr. Meter</p><p className="text-xl font-bold">{tenant.currReading}</p></div>
                </div>
              </div>
              <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm flex items-center justify-between">
                <div>
                  <h4 className="text-[10px] font-black uppercase text-slate-400 mb-1 tracking-widest italic flex items-center gap-2">
                    <FileText size={14} className="text-indigo-600"/> Lease Documents
                  </h4>
                  <p className="text-xs font-bold text-slate-600">Standard_Agreement_2026.pdf</p>
                </div>
                <button className="p-4 bg-slate-50 text-slate-400 rounded-2xl hover:bg-indigo-600 hover:text-white transition-all">
                  <Download size={20}/>
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'History' && <TenantHistory tenant={tenant} />}
        {activeTab === 'Settings' && <TenantSettings tenant={tenant} />}
      </main>
    </div>
  );
};

const TenantHistory = ({ tenant }) => {
  const history = tenant.history || [];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex justify-between items-end px-4">
        <div>
          <h3 className="text-3xl font-black italic uppercase text-slate-900 tracking-tighter">Payment Ledger</h3>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">Verified Transaction Records</p>
        </div>
      </div>

      <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
              <tr>
                <th className="px-10 py-6">Billing Date</th>
                <th className="px-10 py-6">Description</th>
                <th className="px-10 py-6">Reference ID</th>
                <th className="px-10 py-6 text-right">Amount Paid</th>
              </tr>
            </thead>
            <tbody>
              {history.length > 0 ? (
                history.map((item, idx) => (
                  <tr key={idx} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/30 transition-colors">
                    <td className="px-10 py-8 font-bold text-xs text-slate-500">{item.date}</td>
                    <td className="px-10 py-8">
                      <p className="text-xs font-black italic text-slate-900">{item.month} Rent + Utilities</p>
                      <p className="text-[9px] text-emerald-500 uppercase font-bold mt-1">Status: Verified</p>
                    </td>
                    <td className="px-10 py-8 font-mono text-[10px] text-slate-400 uppercase">#HMLY-2026-{idx + 101}</td>
                    <td className="px-10 py-8 text-right font-black italic text-sm text-slate-900">
                      ₹{item.amount.toLocaleString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-10 py-20 text-center text-slate-300 font-black uppercase text-[10px] tracking-widest italic">
                    No payment history found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const TenantSettings = ({ tenant }) => {
  return (
    <div className="max-w-5xl space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Profile Form */}
        <div className="lg:col-span-2 bg-white p-8 md:p-12 rounded-[3.5rem] border border-slate-100 shadow-sm">
          <div className="flex items-center gap-4 mb-10">
            <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
              <User size={24} />
            </div>
            <div>
              <h4 className="text-xs font-black uppercase italic text-indigo-600">Account Security</h4>
              <p className="text-xl font-black italic">Personal Information</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[9px] font-black text-slate-400 uppercase ml-2 tracking-widest">Full Name</label>
              <input type="text" defaultValue={tenant.name} className="w-full bg-slate-50 border-none rounded-2xl p-5 font-bold text-sm focus:ring-2 focus:ring-indigo-500/20" />
            </div>
            <div className="space-y-2">
              <label className="text-[9px] font-black text-slate-400 uppercase ml-2 tracking-widest">Mobile Number</label>
              <input type="text" defaultValue={tenant.phone} className="w-full bg-slate-50 border-none rounded-2xl p-5 font-bold text-sm focus:ring-2 focus:ring-indigo-500/20" />
            </div>
            <div className="md:col-span-2 space-y-2">
              <label className="text-[9px] font-black text-slate-400 uppercase ml-2 tracking-widest">Email Address</label>
              <input type="email" defaultValue={tenant.email} className="w-full bg-slate-50 border-none rounded-2xl p-5 font-bold text-sm focus:ring-2 focus:ring-indigo-500/20" />
            </div>
          </div>

          <button className="mt-10 px-10 py-5 bg-slate-900 text-white rounded-[2rem] font-black uppercase text-[10px] tracking-[0.2em] hover:bg-indigo-600 transition-all shadow-xl shadow-slate-200">
            Save Profile Changes
          </button>
        </div>

        {/* Sidebar Preferences */}
        <div className="space-y-8">
          <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm">
            <h4 className="text-[10px] font-black uppercase mb-6 italic tracking-widest text-slate-400">Notifications</h4>
            <div className="space-y-4">
              {['Rent Reminders', 'Payment Confirmations'].map(pref => (
                <div key={pref} className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl border border-transparent hover:border-slate-100 transition-all">
                  <span className="text-[10px] font-black uppercase">{pref}</span>
                  <div className="w-10 h-5 bg-emerald-500 rounded-full flex items-center px-1 cursor-pointer">
                    <div className="w-3 h-3 bg-white rounded-full ml-auto"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-indigo-600 p-10 rounded-[3rem] text-white shadow-2xl shadow-indigo-200 relative overflow-hidden group">
            <div className="relative z-10">
              <h4 className="text-[10px] font-black uppercase mb-2 italic text-indigo-200">Room Details</h4>
              <p className="text-3xl font-black italic mb-4">{tenant.room}</p>
              <p className="text-[9px] font-bold text-indigo-100 uppercase tracking-[0.2em]">Joined: {tenant.joinDate}</p>
            </div>
            <Home className="absolute -right-6 -bottom-6 text-white/10 group-hover:scale-110 transition-transform duration-700" size={120} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
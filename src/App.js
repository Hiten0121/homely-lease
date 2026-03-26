import React, { useState, useEffect } from 'react';
import { 
  Users, CreditCard, Settings, Bell, Home, User, Lock, Mail, LogOut, 
  Smartphone, Zap, ShieldCheck, CheckCircle2, ArrowLeft, ChevronRight, 
  Globe, CreditCard as CardIcon, Eye, Download, X, Upload, Trash2, Save,
  ShieldAlert, Landmark, Building, Menu, FileText, Calendar, Clock
} from 'lucide-react';

const App = () => {
  const [userRole, setUserRole] = useState(null); 
  const [loginMode, setLoginMode] = useState('tenant'); 
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [showPaymentSystem, setShowPaymentSystem] = useState(false);

  // --- Central Data Engine ---
  const [tenants, setTenants] = useState([
    { id: 1, name: 'Rajesh Kumar', room: 'A-101', status: 'Pending', amount: '12,500', date: 'N/A', phone: '+91 98765 43210', method: 'N/A', email: 'rajesh.k@example.com', joinDate: '12 Jan 2024' },
    { id: 2, name: 'Anita Sharma', room: 'B-204', status: 'Pending', amount: '15,000', date: 'N/A', phone: '+91 88776 65544', method: 'N/A', email: 'anita.s@example.com', joinDate: '05 Feb 2025' },
    { id: 3, name: 'Vikram Singh', room: 'C-302', status: 'Paid', amount: '10,000', date: '24 Mar 2026', phone: '+91 77665 44332', method: 'Debit Card', email: 'vikram.v@example.com', joinDate: '20 Nov 2023' },
    { id: 4, name: 'Siddharth M.', room: 'D-105', status: 'Paid', amount: '18,500', date: '20 Mar 2026', phone: '+91 99001 12233', method: 'UPI', email: 'sid.m@example.com', joinDate: '15 May 2024' },
    { id: 5, name: 'Priya Verma', room: 'A-202', status: 'Overdue', amount: '12,500', date: 'N/A', phone: '+91 91234 56789', method: 'N/A', email: 'priya.v@example.com', joinDate: '10 Dec 2024' },
  ]);

  // Added expanded sample notification data for the landlord
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Server Maintenance', desc: 'Portal will be down at 2 AM IST for optimization.', time: '2h ago', type: 'info' },
    { id: 2, title: 'New Tenant Request', desc: 'Room D-401 has a new applicant: Megha Rao.', time: '5h ago', type: 'alert' },
    { id: 3, title: 'Payment Success', desc: 'Siddharth (D-105) settled March rent via UPI.', time: '1d ago', type: 'success' },
    { id: 4, title: 'Late Rent Warning', desc: 'Priya Verma (A-202) is 3 days overdue.', time: '1d ago', type: 'alert' },
    { id: 5, title: 'Document Uploaded', desc: 'Anita Sharma updated her Police Verification.', time: '2d ago', type: 'success' },
    { id: 6, title: 'Security Alert', desc: 'Unrecognized login attempt from Chrome on Windows.', time: '3d ago', type: 'alert' }
  ]);

  const processTenantPayment = (method) => {
    const today = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    setTenants(prev => prev.map(t => t.id === 1 ? { ...t, status: 'Paid', date: today, method: method } : t));
    setNotifications(prev => [{
      id: Date.now(),
      title: 'Payment Received',
      desc: `₹12,500 from Rajesh (A-101) via ${method}`,
      time: 'Just now',
      type: 'success'
    }, ...prev]);
    setShowPaymentSystem(false);
  };

  if (!userRole) {
    return (
      <div className="min-h-screen bg-[#0F172A] flex items-center justify-center p-4 md:p-6 font-sans">
        <div className="w-full max-w-4xl bg-white rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-2xl grid grid-cols-1 md:grid-cols-2">
          <div className="bg-slate-900 p-8 md:p-16 text-white flex flex-col justify-between hidden md:flex">
            <div className="flex items-center gap-3 italic font-black text-2xl">
              <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center not-italic">H</div> Homely
            </div>
            <h1 className="text-5xl font-black leading-tight italic">Your Home,<br/>Managed.<br/>Better.</h1>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-xs italic">Version 4.0.2 Stable</p>
          </div>
          <div className="p-8 md:p-16 flex flex-col justify-center">
            <div className="flex gap-2 p-1 bg-slate-100 rounded-2xl mb-10">
              <button onClick={() => setLoginMode('tenant')} className={`flex-1 py-4 rounded-xl text-[10px] font-black uppercase transition-all ${loginMode === 'tenant' ? 'bg-white text-indigo-600 shadow-xl' : 'text-slate-400'}`}>Resident</button>
              <button onClick={() => setLoginMode('admin')} className={`flex-1 py-4 rounded-xl text-[10px] font-black uppercase transition-all ${loginMode === 'admin' ? 'bg-white text-indigo-600 shadow-xl' : 'text-slate-400'}`}>Landlord</button>
            </div>
            <form onSubmit={(e) => {e.preventDefault(); setUserRole(loginMode); setActiveTab(loginMode === 'admin' ? 'Dashboard' : 'Overview');}} className="space-y-4">
              <input type="text" placeholder="ID Number / Mobile" className="w-full bg-slate-50 border-none rounded-2xl py-5 px-8 font-black outline-none" required />
              <input type="password" placeholder="Password" className="w-full bg-slate-50 border-none rounded-2xl py-5 px-8 font-black outline-none" required />
              <button className="w-full bg-slate-900 text-white font-black py-5 rounded-2xl uppercase tracking-[0.2em] text-xs shadow-2xl hover:bg-indigo-600 transition-all">Sign In</button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return userRole === 'admin' ? (
    <AdminPortal tenants={tenants} notifications={notifications} activeTab={activeTab} setActiveTab={setActiveTab} logout={() => setUserRole(null)} />
  ) : (
    <TenantPortal tenant={tenants[0]} tenants={tenants} showPayment={showPaymentSystem} setShowPayment={setShowPaymentSystem} onPay={processTenantPayment} logout={() => setUserRole(null)} />
  );
};

const AdminPortal = ({ tenants, notifications, activeTab, setActiveTab, logout }) => {
  const [profileOpen, setProfileOpen] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const totalCollected = tenants.reduce((acc, t) => t.status === 'Paid' ? acc + parseInt(t.amount.replace(',','')) : acc, 0);
  const totalPending = tenants.reduce((acc, t) => (t.status === 'Pending' || t.status === 'Overdue') ? acc + parseInt(t.amount.replace(',','')) : acc, 0);

  return (
    <div className="flex h-screen bg-[#F8FAFC]">
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-slate-900 text-white p-8 flex flex-col shrink-0 transition-transform md:relative md:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-3 font-black italic text-xl">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center not-italic">H</div> Homely
          </div>
          <button onClick={() => setSidebarOpen(false)} className="md:hidden"><X/></button>
        </div>
        <nav className="space-y-2 flex-1">
          {['Dashboard', 'Tenants', 'Payments', 'Notifications', 'Settings'].map(tab => (
            <button key={tab} onClick={() => {setActiveTab(tab); setSidebarOpen(false);}} className={`w-full flex items-center gap-4 px-6 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-900/50' : 'text-slate-500 hover:text-white'}`}>
              {tab === 'Dashboard' && <Home size={18}/>}
              {tab === 'Tenants' && <Users size={18}/>}
              {tab === 'Payments' && <CreditCard size={18}/>}
              {tab === 'Notifications' && <Bell size={18}/>}
              {tab === 'Settings' && <Settings size={18}/>}
              {tab}
            </button>
          ))}
        </nav>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-24 bg-white border-b px-6 md:px-12 flex items-center justify-between">
           <div className="flex items-center gap-4">
             <button onClick={() => setSidebarOpen(true)} className="md:hidden p-2 bg-slate-50 rounded-lg"><Menu size={20}/></button>
             <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">{activeTab}</h2>
           </div>
           <div className="relative">
              <button onClick={() => setProfileOpen(!profileOpen)} className="flex items-center gap-3 p-2 pr-6 bg-slate-50 border rounded-2xl hover:bg-slate-100 transition-all">
                 <div className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center font-black">AD</div>
                 <span className="text-xs font-black uppercase italic hidden sm:inline">Manager <ChevronRight size={12}/></span>
              </button>
              {profileOpen && (
                 <div className="absolute right-0 mt-4 w-52 bg-white rounded-2xl shadow-2xl border p-2 z-50">
                    <button onClick={() => {setActiveTab('Settings'); setProfileOpen(false);}} className="w-full flex items-center gap-3 p-4 text-[10px] font-black text-slate-600 hover:bg-slate-50 rounded-xl uppercase"><User size={14}/> Profile</button>
                    <button onClick={logout} className="w-full flex items-center gap-3 p-4 text-[10px] font-black text-red-500 hover:bg-red-50 rounded-xl uppercase border-t mt-2 pt-4"><LogOut size={14}/> Sign Out</button>
                 </div>
              )}
           </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 md:p-12">
          {activeTab === 'Dashboard' && (
            <div className="space-y-12 animate-in fade-in duration-500">
               <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="bg-white p-10 rounded-[3rem] border shadow-sm flex justify-between items-center">
                      <div><p className="text-[10px] font-black text-slate-400 uppercase mb-2">Collected</p><h3 className="text-4xl font-black italic text-emerald-600">₹{totalCollected.toLocaleString()}</h3></div>
                      <Landmark className="text-emerald-500/20" size={48}/>
                  </div>
                  <div className="bg-white p-10 rounded-[3rem] border shadow-sm flex justify-between items-center">
                      <div><p className="text-[10px] font-black text-slate-400 uppercase mb-2">Pending</p><h3 className="text-4xl font-black italic text-red-500">₹{totalPending.toLocaleString()}</h3></div>
                      <ShieldAlert className="text-red-500/20" size={48}/>
                  </div>
                  <div className="bg-indigo-600 p-10 rounded-[3rem] shadow-2xl text-white">
                      <p className="text-[10px] font-black uppercase mb-2 text-indigo-200">System Health</p>
                      <h3 className="text-4xl font-black italic flex items-center gap-3">Good <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div></h3>
                  </div>
               </div>

               <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                  <div className="bg-white rounded-[3.5rem] border shadow-sm p-10">
                     <h3 className="text-xs font-black uppercase mb-8 italic flex items-center gap-2">Home Notifications <span className="bg-indigo-100 text-indigo-600 px-3 py-1 rounded-full text-[9px]">{notifications.length}</span></h3>
                     <div className="space-y-4">
                        {notifications.map(n => (
                           <div key={n.id} className="flex gap-4 p-5 bg-slate-50 rounded-2xl border border-slate-100">
                              <div className={`w-1 h-12 rounded-full ${n.type === 'success' ? 'bg-emerald-400' : n.type === 'alert' ? 'bg-red-400' : 'bg-indigo-400'}`}></div>
                              <div><p className="text-xs font-black italic">{n.title}</p><p className="text-[10px] font-bold text-slate-400">{n.desc}</p></div>
                              <span className="ml-auto text-[8px] font-black text-slate-300 uppercase">{n.time}</span>
                           </div>
                        ))}
                     </div>
                  </div>

                  <div className="bg-white rounded-[3.5rem] border shadow-sm overflow-hidden flex flex-col">
                     <div className="p-10 pb-6"><h3 className="text-xs font-black uppercase italic">Recent Transactions</h3></div>
                     <div className="overflow-x-auto">
                        <table className="w-full text-left">
                           <thead className="bg-slate-50 text-[9px] font-black text-slate-400 uppercase"><tr className="border-y"><th className="px-10 py-4">Tenant</th><th className="px-10 py-4">Method</th><th className="px-10 py-4 text-right">Status</th></tr></thead>
                           <tbody>
                              {tenants.map(t => (
                                 <tr key={t.id} className="border-b border-slate-50 last:border-0">
                                    <td className="px-10 py-6 font-bold text-xs">{t.name}</td>
                                    <td className="px-10 py-6 font-black text-[9px] text-indigo-600 uppercase italic">{t.method}</td>
                                    <td className="px-10 py-6 text-right"><span className={`px-4 py-1 rounded-full text-[8px] font-black uppercase ${t.status === 'Paid' ? 'bg-emerald-100 text-emerald-600' : t.status === 'Overdue' ? 'bg-red-600 text-white' : 'bg-red-100 text-red-600'}`}>{t.status}</span></td>
                                 </tr>
                              ))}
                           </tbody>
                        </table>
                     </div>
                  </div>
               </div>
            </div>
          )}

          {activeTab === 'Tenants' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 animate-in slide-in-from-bottom-8">
               {tenants.map(t => (
                  <div key={t.id} className="bg-white p-10 rounded-[3rem] border shadow-sm group hover:border-indigo-600 transition-all">
                     <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center font-black text-slate-300 text-xl mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-all">{t.name[0]}</div>
                     <h4 className="text-2xl font-black italic mb-1">{t.name}</h4>
                     <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-10">{t.room}</p>
                     <button onClick={() => setSelectedTenant(t)} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-indigo-600 transition-all flex items-center justify-center gap-2 shadow-xl shadow-indigo-100"><Eye size={16}/> View Records</button>
                  </div>
               ))}
            </div>
          )}

          {activeTab === 'Payments' && (
             <div className="bg-white rounded-[3rem] border shadow-sm overflow-hidden animate-in fade-in">
                <div className="p-10 flex justify-between items-end border-b">
                   <h3 className="text-3xl font-black italic uppercase">Financial Ledger</h3>
                   <button className="flex items-center gap-2 text-[10px] font-black text-indigo-600 uppercase border-b border-indigo-600"><Download size={14}/> Export CSV</button>
                </div>
                <div className="overflow-x-auto">
                   <table className="w-full text-left">
                     <thead className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase">
                       <tr className="border-y">
                         <th className="px-10 py-6">Ref ID</th>
                         <th className="px-10 py-6">Tenant Name</th>
                         <th className="px-10 py-6">Payment Date</th>
                         <th className="px-10 py-6">Amount</th>
                         <th className="px-10 py-6">Status</th>
                       </tr>
                     </thead>
                     <tbody>
                       {tenants.map(t => (
                         <tr key={t.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50">
                           <td className="px-10 py-6 font-mono text-[10px] text-slate-400">#HMLY-{t.id}024</td>
                           <td className="px-10 py-6 font-bold text-xs">{t.name}</td>
                           <td className="px-10 py-6 text-xs text-slate-500 italic">{t.date}</td>
                           <td className="px-10 py-6 font-black italic text-slate-900">₹{t.amount}</td>
                           <td className="px-10 py-6">
                              <span className={`px-4 py-1 rounded-full text-[8px] font-black uppercase ${t.status === 'Paid' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>{t.status}</span>
                           </td>
                         </tr>
                       ))}
                     </tbody>
                   </table>
                </div>
             </div>
          )}

          {activeTab === 'Notifications' && (
            <div className="max-w-4xl space-y-6 animate-in fade-in">
              <h3 className="text-3xl font-black italic uppercase mb-8">System Alerts</h3>
              {notifications.map(n => (
                <div key={n.id} className="bg-white p-8 rounded-[2.5rem] border flex items-center justify-between group hover:border-indigo-600 transition-all">
                  <div className="flex items-center gap-6">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xs ${n.type === 'success' ? 'bg-emerald-50 text-emerald-600' : n.type === 'alert' ? 'bg-red-50 text-red-600' : 'bg-indigo-50 text-indigo-600'}`}>
                      {n.type === 'success' ? 'OK' : n.type === 'alert' ? '!!' : 'i'}
                    </div>
                    <div>
                      <p className="text-lg font-black italic">{n.title}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{n.desc}</p>
                    </div>
                  </div>
                  <span className="text-[8px] font-black text-slate-300 uppercase">{n.time}</span>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'Settings' && (
            <div className="max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-12 animate-in slide-in-from-bottom-8">
               <div className="bg-white p-12 rounded-[3.5rem] border shadow-sm space-y-10">
                  <h3 className="text-2xl font-black italic uppercase">Management Profile</h3>
                  <div className="flex items-center gap-6 mb-12">
                     <div className="w-24 h-24 bg-slate-900 text-white rounded-[2rem] flex items-center justify-center text-3xl font-black italic shadow-2xl">HQ</div>
                     <div><p className="text-2xl font-black italic">Homely Group Inc.</p><p className="text-xs font-bold text-slate-400 uppercase">Master Landlord</p></div>
                  </div>
                  <div className="space-y-4">
                     <div className="p-6 bg-slate-50 rounded-3xl"><p className="text-[9px] font-black text-slate-400 uppercase mb-2">Support Email</p><p className="font-black italic">admin@homelylease.com</p></div>
                     <div className="p-6 bg-slate-50 rounded-3xl"><p className="text-[9px] font-black text-slate-400 uppercase mb-2">Portal Access Code</p><p className="font-black italic">HMLY-2026-XPR</p></div>
                     <button className="w-full py-5 bg-indigo-600 text-white rounded-[1.5rem] font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-3 shadow-xl shadow-indigo-200"><Save size={16}/> Apply Global Changes</button>
                  </div>
               </div>
               <div className="space-y-8">
                  <div className="bg-white p-10 rounded-[3rem] border shadow-sm">
                     <h4 className="text-xs font-black uppercase mb-8 italic flex items-center gap-2 text-indigo-600"><Lock size={16}/> Access Control</h4>
                     <div className="space-y-4">
                        <div className="flex justify-between items-center p-5 bg-slate-50 rounded-2xl">
                           <span className="text-[10px] font-black uppercase">Enable Auto-Receipts</span>
                           <div className="w-12 h-6 bg-emerald-500 rounded-full flex items-center px-1"><div className="w-4 h-4 bg-white rounded-full ml-auto"></div></div>
                        </div>
                        <div className="flex justify-between items-center p-5 bg-slate-50 rounded-2xl">
                           <span className="text-[10px] font-black uppercase">Tenant Late Alerts</span>
                           <div className="w-12 h-6 bg-indigo-600 rounded-full flex items-center px-1"><div className="w-4 h-4 bg-white rounded-full ml-auto"></div></div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
          )}
        </main>

        {selectedTenant && (
          <div className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-6">
             <div className="bg-white w-full max-w-lg rounded-[3.5rem] p-12 relative shadow-2xl animate-in zoom-in-95">
                <button onClick={() => setSelectedTenant(null)} className="absolute top-10 right-10 text-slate-300 hover:text-slate-900"><X size={24}/></button>
                <div className="flex items-center gap-8 mb-12">
                   <div className="w-24 h-24 bg-indigo-600 text-white rounded-[2rem] flex items-center justify-center text-4xl font-black italic">{selectedTenant.name[0]}</div>
                   <div><h4 className="text-3xl font-black italic">{selectedTenant.name}</h4><p className="text-sm font-bold text-slate-400 uppercase tracking-widest">{selectedTenant.room}</p></div>
                </div>
                <div className="grid grid-cols-2 gap-6">
                   <div className="p-5 bg-slate-50 rounded-2xl"><p className="text-[9px] font-black text-slate-400 uppercase mb-2">Phone</p><p className="text-sm font-black italic">{selectedTenant.phone}</p></div>
                   <div className="p-5 bg-slate-50 rounded-2xl"><p className="text-[9px] font-black text-slate-400 uppercase mb-2">Joining</p><p className="text-sm font-black italic">{selectedTenant.joinDate}</p></div>
                   <div className="p-5 bg-slate-50 rounded-2xl col-span-2"><p className="text-[9px] font-black text-slate-400 uppercase mb-2">Contact Email</p><p className="text-sm font-black italic">{selectedTenant.email}</p></div>
                </div>
                <button className="w-full mt-10 py-5 bg-slate-900 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-2xl">Save Tenant Overrides</button>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

const TenantPortal = ({ tenant, tenants, showPayment, setShowPayment, onPay, logout }) => {
  const [activeTab, setActiveTab] = useState('Overview');
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#FDFDFD] flex flex-col font-sans">
      <header className="h-24 bg-white border-b px-6 md:px-12 flex items-center justify-between sticky top-0 z-50">
         <div className="flex items-center gap-3 italic font-black text-xl text-indigo-600"><div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white italic not-italic text-sm">H</div> MyHome</div>
         <nav className="hidden md:flex gap-10">
            {['Overview', 'History', 'Documents', 'Settings'].map(t => (
               <button key={t} onClick={() => setActiveTab(t)} className={`text-[10px] font-black uppercase tracking-widest pb-1 border-b-2 transition-all ${activeTab === t ? 'text-indigo-600 border-indigo-600' : 'text-slate-300 border-transparent'}`}>{t}</button>
            ))}
         </nav>
         <div className="relative">
            <button onClick={() => setProfileOpen(!profileOpen)} className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center font-black shadow-xl hover:scale-105 transition-all">RK</button>
            {profileOpen && (
               <div className="absolute right-0 mt-4 w-52 bg-white rounded-2xl shadow-2xl border p-2 z-[60]">
                  <button onClick={() => {setActiveTab('Settings'); setProfileOpen(false);}} className="w-full flex items-center gap-3 p-4 text-[10px] font-black text-slate-600 hover:bg-slate-50 rounded-xl uppercase"><User size={16}/> My Profile</button>
                  <button onClick={logout} className="w-full flex items-center gap-3 p-4 text-[10px] font-black text-red-500 hover:bg-red-50 rounded-xl uppercase border-t mt-2 pt-4"><LogOut size={16}/> Sign Out</button>
               </div>
            )}
         </div>
      </header>

      <nav className="md:hidden flex justify-around bg-white border-b py-4">
         {['Overview', 'History', 'Documents'].map(t => (
            <button key={t} onClick={() => setActiveTab(t)} className={`text-[9px] font-black uppercase tracking-widest ${activeTab === t ? 'text-indigo-600' : 'text-slate-300'}`}>{t}</button>
         ))}
      </nav>

      <main className="p-6 md:p-12 max-w-6xl mx-auto w-full flex-1">
        {activeTab === 'Overview' && (
           <div className="space-y-12 animate-in slide-in-from-bottom-8">
              <div className="bg-indigo-600 rounded-[3.5rem] p-10 md:p-16 text-white shadow-2xl relative overflow-hidden group">
                 <div className="absolute top-[-20%] right-[-10%] w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
                 <p className="text-[10px] font-black uppercase text-indigo-200 mb-4 tracking-widest italic">March 2026 Statement • {tenant.room}</p>
                 <h2 className="text-6xl md:text-7xl font-black tracking-tighter italic mb-12">₹{tenant.amount}</h2>
                 <div className="flex gap-4">
                    {tenant.status === 'Paid' ? (
                        <div className="flex items-center gap-3 bg-white/20 px-8 py-4 rounded-2xl font-black uppercase text-xs"><CheckCircle2 size={20}/> Payment Confirmed</div>
                    ) : (
                        // Fixed "Pay Now" logic for mobile by explicitly handling button behavior
                        <button 
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            setShowPayment(true);
                          }} 
                          className="bg-white text-indigo-600 px-10 py-5 rounded-2xl font-black uppercase text-xs shadow-2xl hover:scale-110 active:scale-95 transition-all z-10"
                        >
                          Pay Rent Now
                        </button>
                    )}
                 </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="bg-white p-8 rounded-[3rem] border shadow-sm flex items-center gap-6">
                    <div className="w-14 h-14 bg-slate-50 text-indigo-600 rounded-2xl flex items-center justify-center"><Calendar size={28}/></div>
                    <div><p className="text-[9px] font-black text-slate-400 uppercase">Due Date</p><p className="text-xl font-black italic">05 Apr 2026</p></div>
                 </div>
                 <div className="bg-white p-8 rounded-[3rem] border shadow-sm flex items-center gap-6">
                    <div className="w-14 h-14 bg-slate-50 text-indigo-600 rounded-2xl flex items-center justify-center"><Zap size={28}/></div>
                    <div><p className="text-[9px] font-black text-slate-400 uppercase">Utilities</p><p className="text-xl font-black italic">Included in Rent</p></div>
                 </div>
              </div>
           </div>
        )}

        {activeTab === 'History' && (
           <div className="space-y-6 animate-in slide-in-from-bottom-4">
              <h3 className="text-3xl font-black italic uppercase mb-8">Payment Timeline</h3>
              {[
                { month: 'February 2026', amount: '12,500', date: '05 Feb', status: 'Paid', ref: 'TXN-99210' },
                { month: 'January 2026', amount: '12,500', date: '02 Jan', status: 'Paid', ref: 'TXN-88122' },
                { month: 'December 2025', amount: '12,500', date: '04 Dec', status: 'Paid', ref: 'TXN-77341' }
              ].map((item, idx) => (
                <div key={idx} className="bg-white p-8 rounded-[2.5rem] border flex items-center justify-between group hover:border-indigo-600 transition-all">
                  <div className="flex items-center gap-6">
                    <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center font-black text-xs">OK</div>
                    <div>
                      <p className="text-lg font-black italic">{item.month}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Ref: {item.ref} • Paid on {item.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-black italic text-slate-900">₹{item.amount}</p>
                    <span className="text-[8px] font-black text-emerald-500 uppercase">Settled</span>
                  </div>
                </div>
              ))}
           </div>
        )}

        {activeTab === 'Documents' && (
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-in fade-in">
              <h3 className="text-3xl font-black italic uppercase col-span-full mb-4">Resident Documents</h3>
              {['Lease_Agreement.pdf', 'Police_Verification.pdf', 'Rent_Receipt_Feb.pdf'].map(doc => (
                 <div key={doc} className="bg-white p-10 rounded-[3rem] border shadow-sm group hover:bg-indigo-600 hover:text-white transition-all">
                    <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-white/10 transition-all"><FileText className="text-indigo-600 group-hover:text-white" size={28}/></div>
                    <p className="text-xl font-black italic mb-2">{doc.replace('_', ' ')}</p>
                    <p className="text-[10px] font-bold text-slate-300 uppercase mb-8 group-hover:text-indigo-200 uppercase">Verifed • 2.4 MB</p>
                    <button className="text-[9px] font-black uppercase tracking-widest border-b-2 border-slate-100 group-hover:border-white/20 pb-1">Download Copy</button>
                 </div>
              ))}
           </div>
        )}

        {activeTab === 'Settings' && (
           <div className="max-w-xl bg-white p-12 rounded-[3.5rem] border shadow-sm space-y-8 animate-in slide-in-from-bottom-8">
              <h3 className="text-3xl font-black italic uppercase">Resident Info</h3>
              <div className="space-y-4">
                 <div className="p-8 bg-slate-50 rounded-3xl"><p className="text-[9px] font-black text-slate-400 uppercase mb-2">Legal Name</p><p className="text-xl font-black italic">{tenant.name}</p></div>
                 <div className="p-8 bg-slate-50 rounded-3xl"><p className="text-[9px] font-black text-slate-400 uppercase mb-2">Contact Mobile</p><p className="text-xl font-black italic">{tenant.phone}</p></div>
                 <button className="w-full py-5 bg-slate-900 text-white rounded-[1.5rem] font-black uppercase text-[10px] tracking-widest shadow-2xl">Update Records</button>
              </div>
           </div>
        )}
      </main>

      {showPayment && (
        <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-6">
           <div className="bg-white w-full max-w-4xl rounded-[4rem] overflow-hidden shadow-2xl grid grid-cols-1 md:grid-cols-5 animate-in zoom-in-95 duration-300">
              <div className="md:col-span-2 bg-slate-50 p-12 border-r flex flex-col justify-between">
                 <div>
                    <button onClick={() => setShowPayment(false)} className="flex items-center gap-2 text-[10px] font-black text-slate-300 uppercase mb-12"><ArrowLeft size={16}/> Go Back</button>
                    <h4 className="text-4xl font-black italic uppercase mb-2">Checkout</h4>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">A-101 Homely Square</p>
                 </div>
                 <div className="pt-8 border-t border-slate-200">
                    <p className="text-[10px] font-black text-slate-400 uppercase mb-2">Rent for March 2026</p>
                    <p className="text-5xl font-black italic text-indigo-600">₹{tenant.amount}</p>
                 </div>
              </div>
              <div className="md:col-span-3 p-16 flex flex-col justify-center space-y-8">
                 <div className="grid grid-cols-2 gap-4">
                    <button type="button" onClick={() => onPay('UPI')} className="p-6 border-2 border-indigo-600 rounded-3xl bg-indigo-50 flex flex-col items-center gap-4">
                       <Smartphone className="text-indigo-600" size={32}/>
                       <span className="text-[10px] font-black uppercase tracking-widest">UPI Payment</span>
                    </button>
                    <button type="button" onClick={() => onPay('Debit Card')} className="p-6 border-2 border-slate-100 rounded-3xl hover:border-indigo-600 transition-all flex flex-col items-center gap-4 text-slate-400 hover:text-indigo-600">
                       <CardIcon size={32}/>
                       <span className="text-[10px] font-black uppercase tracking-widest">Debit Card</span>
                    </button>
                 </div>
                 {/* Final verification button for mobile users */}
                 <button 
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    onPay('UPI');
                  }} 
                  className="w-full bg-slate-900 text-white py-6 rounded-3xl font-black uppercase text-[11px] tracking-[0.4em] shadow-2xl hover:bg-indigo-600 active:bg-indigo-700 transition-all"
                 >
                   Verify & Pay ₹{tenant.amount}
                 </button>
                 <p className="text-center text-[9px] font-black text-slate-300 uppercase flex items-center justify-center gap-2"><ShieldCheck size={14}/> 100% Secure Gateway</p>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default App;
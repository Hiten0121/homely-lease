import React, { useState, useEffect } from 'react';
import { 
  Users, CreditCard, Settings, Bell, Home, User, Lock, Mail, LogOut, 
  Smartphone, Zap, ShieldCheck, CheckCircle2, ArrowLeft, ChevronRight, 
  Globe, CreditCard as CardIcon, Eye, Download, X, Upload, Trash2, Save,
  ShieldAlert, Landmark, Building
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
  ]);

  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Server Maintenance', desc: 'Portal will be down at 2 AM IST.', time: '2h ago', type: 'info' },
    { id: 2, title: 'New Tenant Request', desc: 'Room D-401 has a new applicant.', time: '5h ago', type: 'alert' }
  ]);

  // --- Logic Functions ---
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
      <div className="min-h-screen bg-[#0F172A] flex items-center justify-center p-6 font-sans">
        <div className="w-full max-w-4xl bg-white rounded-[3rem] overflow-hidden shadow-2xl grid grid-cols-1 md:grid-cols-2">
          <div className="bg-slate-900 p-16 text-white flex flex-col justify-between">
            <div className="flex items-center gap-3 italic font-black text-2xl">
              <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center">H</div> Homely
            </div>
            <h1 className="text-5xl font-black leading-tight italic">Your Home,<br/>Managed.<br/>Better.</h1>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-xs italic">Version 4.0.2 Stable</p>
          </div>
          <div className="p-16 flex flex-col justify-center">
            <div className="flex gap-2 p-1 bg-slate-100 rounded-2xl mb-10">
              <button onClick={() => setLoginMode('tenant')} className={`flex-1 py-4 rounded-xl text-[10px] font-black uppercase transition-all ${loginMode === 'tenant' ? 'bg-white text-indigo-600 shadow-xl' : 'text-slate-400'}`}>Resident</button>
              <button onClick={() => setLoginMode('admin')} className={`flex-1 py-4 rounded-xl text-[10px] font-black uppercase transition-all ${loginMode === 'admin' ? 'bg-white text-indigo-600 shadow-xl' : 'text-slate-400'}`}>Landlord</button>
            </div>
            <form onSubmit={(e) => {e.preventDefault(); setUserRole(loginMode);}} className="space-y-4">
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

// --- ADMIN PORTAL ---
const AdminPortal = ({ tenants, notifications, activeTab, setActiveTab, logout }) => {
  const [profileOpen, setProfileOpen] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState(null);

  const totalCollected = tenants.reduce((acc, t) => t.status === 'Paid' ? acc + parseInt(t.amount.replace(',','')) : acc, 0);
  const totalPending = tenants.reduce((acc, t) => t.status === 'Pending' ? acc + parseInt(t.amount.replace(',','')) : acc, 0);

  return (
    <div className="flex h-screen bg-[#F8FAFC]">
      {/* Sidebar */}
      <aside className="w-72 bg-slate-900 text-white p-8 flex flex-col shrink-0">
        <div className="flex items-center gap-3 font-black italic text-xl mb-12"><div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">H</div> Homely</div>
        <nav className="space-y-2 flex-1">
          {['Dashboard', 'Tenants', 'Payments', 'Notifications', 'Settings'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`w-full flex items-center gap-4 px-6 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-900/50' : 'text-slate-500 hover:text-white'}`}>
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
        <header className="h-24 bg-white border-b px-12 flex items-center justify-between">
           <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">{activeTab}</h2>
           <div className="relative">
              <button onClick={() => setProfileOpen(!profileOpen)} className="flex items-center gap-3 p-2 pr-6 bg-slate-50 border rounded-2xl hover:bg-slate-100 transition-all">
                 <div className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center font-black">AD</div>
                 <span className="text-xs font-black uppercase italic">Manager <ChevronRight size={12}/></span>
              </button>
              {profileOpen && (
                 <div className="absolute right-0 mt-4 w-52 bg-white rounded-2xl shadow-2xl border p-2 z-50">
                    <button onClick={() => {setActiveTab('Settings'); setProfileOpen(false);}} className="w-full flex items-center gap-3 p-4 text-[10px] font-black text-slate-600 hover:bg-slate-50 rounded-xl uppercase"><User size={14}/> Profile</button>
                    <button onClick={logout} className="w-full flex items-center gap-3 p-4 text-[10px] font-black text-red-500 hover:bg-red-50 rounded-xl uppercase border-t mt-2 pt-4"><LogOut size={14}/> Sign Out</button>
                 </div>
              )}
           </div>
        </header>

        <main className="flex-1 overflow-y-auto p-12">
          {activeTab === 'Dashboard' && (
            <div className="space-y-12 animate-in fade-in duration-500">
               {/* Dashboard Stats */}
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
                  {/* Live Notifications Feed */}
                  <div className="bg-white rounded-[3.5rem] border shadow-sm p-10">
                     <h3 className="text-xs font-black uppercase mb-8 italic flex items-center gap-2">Home Notifications <span className="bg-indigo-100 text-indigo-600 px-3 py-1 rounded-full text-[9px]">{notifications.length}</span></h3>
                     <div className="space-y-4">
                        {notifications.map(n => (
                           <div key={n.id} className="flex gap-4 p-5 bg-slate-50 rounded-2xl border border-slate-100">
                              <div className={`w-1 h-12 rounded-full ${n.type === 'success' ? 'bg-emerald-400' : 'bg-indigo-400'}`}></div>
                              <div><p className="text-xs font-black italic">{n.title}</p><p className="text-[10px] font-bold text-slate-400">{n.desc}</p></div>
                              <span className="ml-auto text-[8px] font-black text-slate-300 uppercase">{n.time}</span>
                           </div>
                        ))}
                     </div>
                  </div>

                  {/* Top Payers Table */}
                  <div className="bg-white rounded-[3.5rem] border shadow-sm overflow-hidden flex flex-col">
                     <div className="p-10 pb-6"><h3 className="text-xs font-black uppercase italic">Recent Transactions</h3></div>
                     <div className="flex-1">
                        <table className="w-full text-left">
                           <thead className="bg-slate-50 text-[9px] font-black text-slate-400 uppercase"><tr className="border-y"><th className="px-10 py-4">Tenant</th><th className="px-10 py-4">Method</th><th className="px-10 py-4">Status</th></tr></thead>
                           <tbody>
                              {tenants.map(t => (
                                 <tr key={t.id} className="border-b border-slate-50 last:border-0">
                                    <td className="px-10 py-6 font-bold text-xs">{t.name}</td>
                                    <td className="px-10 py-6 font-black text-[9px] text-indigo-600 uppercase italic">{t.method}</td>
                                    <td className="px-10 py-6"><span className={`px-4 py-1 rounded-full text-[8px] font-black uppercase ${t.status === 'Paid' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>{t.status}</span></td>
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-in slide-in-from-bottom-8">
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

          {activeTab === 'Settings' && (
            <div className="max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-12 animate-in slide-in-from-bottom-8">
               <div className="bg-white p-12 rounded-[3.5rem] border shadow-sm space-y-10">
                  <h3 className="text-2xl font-black italic uppercase">Profile Management</h3>
                  <div className="flex items-center gap-6 mb-12">
                     <div className="w-24 h-24 bg-slate-900 text-white rounded-[2rem] flex items-center justify-center text-3xl font-black italic shadow-2xl">HQ</div>
                     <div><p className="text-2xl font-black italic">Homely Group Inc.</p><p className="text-xs font-bold text-slate-400 uppercase">Master Admin</p></div>
                  </div>
                  <div className="space-y-4">
                     <div className="p-6 bg-slate-50 rounded-3xl"><p className="text-[9px] font-black text-slate-400 uppercase mb-2">Office Email</p><p className="font-black italic">admin@homelylease.com</p></div>
                     <div className="p-6 bg-slate-50 rounded-3xl"><p className="text-[9px] font-black text-slate-400 uppercase mb-2">Company Reg.</p><p className="font-black italic">GSTIN-1200344X</p></div>
                     <button className="w-full py-5 bg-indigo-600 text-white rounded-[1.5rem] font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-3"><Save size={16}/> Save Updates</button>
                  </div>
               </div>

               <div className="space-y-8">
                  <div className="bg-white p-10 rounded-[3rem] border shadow-sm">
                     <h4 className="text-xs font-black uppercase mb-8 italic flex items-center gap-2"><Lock size={16} className="text-indigo-600"/> Privacy Settings</h4>
                     <div className="space-y-4">
                        <div className="flex justify-between items-center p-5 bg-slate-50 rounded-2xl">
                           <span className="text-[10px] font-black uppercase">2-Factor Authentication</span>
                           <div className="w-12 h-6 bg-emerald-500 rounded-full flex items-center px-1"><div className="w-4 h-4 bg-white rounded-full ml-auto"></div></div>
                        </div>
                        <div className="flex justify-between items-center p-5 bg-slate-50 rounded-2xl">
                           <span className="text-[10px] font-black uppercase">Auto-Generate Invoices</span>
                           <div className="w-12 h-6 bg-indigo-600 rounded-full flex items-center px-1"><div className="w-4 h-4 bg-white rounded-full ml-auto"></div></div>
                        </div>
                     </div>
                  </div>
                  <div className="bg-red-50 p-10 rounded-[3rem] border border-red-100">
                     <h4 className="text-xs font-black uppercase text-red-600 mb-6 italic">Danger Zone</h4>
                     <button className="w-full py-4 border-2 border-dashed border-red-200 text-red-600 rounded-2xl font-black uppercase text-[10px]">Delete Organization Account</button>
                  </div>
               </div>
            </div>
          )}

          {activeTab === 'Notifications' && (
            <div className="max-w-2xl space-y-6 animate-in fade-in">
               <div className="flex justify-between items-end mb-10">
                  <h3 className="text-3xl font-black italic uppercase">System Alerts</h3>
                  <button className="text-[9px] font-black text-indigo-600 uppercase border-b border-indigo-600">Mark all read</button>
               </div>
               {notifications.map(n => (
                  <div key={n.id} className="bg-white p-8 rounded-[2.5rem] border shadow-sm flex justify-between items-center group hover:bg-slate-900 hover:text-white transition-all duration-300">
                     <div className="flex gap-6 items-center">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${n.type === 'success' ? 'bg-emerald-50 text-emerald-600' : 'bg-indigo-50 text-indigo-600'} group-hover:bg-white/10 group-hover:text-white`}>
                           <Bell size={24}/>
                        </div>
                        <div><p className="text-lg font-black italic">{n.title}</p><p className="text-xs font-bold text-slate-400 group-hover:text-slate-500">{n.desc}</p></div>
                     </div>
                     <span className="text-[10px] font-black text-slate-300 group-hover:text-slate-600 uppercase italic">{n.time}</span>
                  </div>
               ))}
            </div>
          )}
        </main>

        {/* Modal: Details */}
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
                   <div className="p-5 bg-slate-50 rounded-2xl"><p className="text-[9px] font-black text-slate-400 uppercase mb-2">Registration</p><p className="text-sm font-black italic">{selectedTenant.joinDate}</p></div>
                   <div className="p-5 bg-slate-50 rounded-2xl col-span-2"><p className="text-[9px] font-black text-slate-400 uppercase mb-2">Private Email</p><p className="text-sm font-black italic">{selectedTenant.email}</p></div>
                </div>
                <button className="w-full mt-10 py-5 bg-slate-900 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest">Update Resident Info</button>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

// --- TENANT PORTAL ---
const TenantPortal = ({ tenant, tenants, showPayment, setShowPayment, onPay, logout }) => {
  const [activeTab, setActiveTab] = useState('Overview');
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#FDFDFD] flex flex-col font-sans">
      <header className="h-24 bg-white border-b px-12 flex items-center justify-between sticky top-0 z-50">
         <div className="flex items-center gap-3 italic font-black text-xl text-indigo-600"><div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white italic">H</div> MyHome</div>
         <nav className="flex gap-10">
            {['Overview', 'Documents', 'History', 'Settings'].map(t => (
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

      <main className="p-12 max-w-6xl mx-auto w-full flex-1">
        {activeTab === 'Overview' && (
           <div className="space-y-12 animate-in slide-in-from-bottom-8">
              <div className="bg-indigo-600 rounded-[3.5rem] p-16 text-white shadow-2xl relative overflow-hidden group">
                 <div className="absolute top-[-20%] right-[-10%] w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
                 <p className="text-[10px] font-black uppercase text-indigo-200 mb-4 tracking-widest italic">March 2026 Rent Bill • {tenant.room}</p>
                 <h2 className="text-7xl font-black tracking-tighter italic mb-12">₹{tenant.amount}</h2>
                 <div className="flex gap-4">
                    {tenant.status === 'Paid' ? (
                       <div className="flex items-center gap-3 bg-white/20 px-8 py-4 rounded-2xl font-black uppercase text-xs"><CheckCircle2 size={20}/> Payment Confirmed</div>
                    ) : (
                       <button onClick={() => setShowPayment(true)} className="bg-white text-indigo-600 px-10 py-5 rounded-2xl font-black uppercase text-xs shadow-2xl hover:scale-105 transition-all">Pay Monthly Rent</button>
                    )}
                 </div>
              </div>
           </div>
        )}

        {activeTab === 'Documents' && (
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-in fade-in">
              <h3 className="text-3xl font-black italic uppercase col-span-full mb-4">Your Archive</h3>
              {['Lease_Contract_2026.pdf', 'Receipt_Feb_2026.pdf', 'Rent_History.pdf'].map(doc => (
                 <div key={doc} className="bg-white p-10 rounded-[3rem] border shadow-sm group hover:bg-indigo-600 hover:text-white transition-all">
                    <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-white/10"><Download className="text-indigo-600 group-hover:text-white" size={28}/></div>
                    <p className="text-xl font-black italic mb-2">{doc}</p>
                    <p className="text-[10px] font-bold text-slate-300 uppercase mb-8 group-hover:text-indigo-200">2.4 MB • PDF Document</p>
                    <button className="text-[9px] font-black uppercase tracking-widest group-hover:text-white border-b-2 border-indigo-100 group-hover:border-white/20 pb-1">Download Copy</button>
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
                 <button className="w-full py-5 bg-slate-900 text-white rounded-[1.5rem] font-black uppercase text-[10px] tracking-widest">Update Registration</button>
              </div>
           </div>
        )}
      </main>

      {/* Payment Overlay */}
      {showPayment && (
        <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-6">
           <div className="bg-white w-full max-w-4xl rounded-[4rem] overflow-hidden shadow-2xl grid grid-cols-1 md:grid-cols-5 animate-in zoom-in-95 duration-300">
              <div className="md:col-span-2 bg-slate-50 p-12 border-r flex flex-col justify-between">
                 <div>
                    <button onClick={() => setShowPayment(false)} className="flex items-center gap-2 text-[10px] font-black text-slate-300 uppercase mb-12"><ArrowLeft size={16}/> Go Back</button>
                    <h4 className="text-4xl font-black italic uppercase mb-2">Checkout</h4>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Property: Homely Square A-101</p>
                 </div>
                 <div className="pt-8 border-t border-slate-200">
                    <p className="text-[10px] font-black text-slate-400 uppercase mb-2">Rent for March 2026</p>
                    <p className="text-5xl font-black italic text-indigo-600">₹12,500</p>
                 </div>
              </div>
              <div className="md:col-span-3 p-16 flex flex-col justify-center space-y-8">
                 <div className="grid grid-cols-2 gap-4">
                    <button className="p-6 border-2 border-indigo-600 rounded-3xl bg-indigo-50 flex flex-col items-center gap-4">
                       <Smartphone className="text-indigo-600" size={32}/>
                       <span className="text-[10px] font-black uppercase tracking-widest">UPI Payment</span>
                    </button>
                    <button className="p-6 border-2 border-slate-100 rounded-3xl hover:border-indigo-600 transition-all flex flex-col items-center gap-4 text-slate-400 hover:text-indigo-600">
                       <CardIcon size={32}/>
                       <span className="text-[10px] font-black uppercase tracking-widest">Debit Card</span>
                    </button>
                 </div>
                 <button onClick={() => onPay('UPI')} className="w-full bg-slate-900 text-white py-6 rounded-3xl font-black uppercase text-[11px] tracking-[0.4em] shadow-2xl hover:bg-indigo-600 transition-all">Verify & Pay ₹12,500</button>
                 <p className="text-center text-[9px] font-black text-slate-300 uppercase flex items-center justify-center gap-2"><ShieldCheck size={14}/> 100% Encrypted Gateway</p>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default App;

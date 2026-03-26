import React, { useState } from 'react';
import { 
  Users, FileText, CreditCard, Bell, Search, Menu, X, 
  Plus, Home, Trash2, User, Clock, CheckCircle2, 
  AlertCircle, Eye, LogOut, ChevronDown 
} from 'lucide-react';

// This component receives 'onLogout' from App.js to handle the session exit
const AdminDashboard = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  
  const [tenants, setTenants] = useState([
    { id: 1, name: 'Rajesh Kumar', mobile: '+91 91234 56789', room: 'A-101', amount: '12,500', timestamp: '2026-03-26 | 10:45 AM' },
    { id: 2, name: 'Anita Sharma', mobile: '+91 99887 76655', room: 'B-204', amount: '15,000', timestamp: '2026-03-25 | 02:20 PM' },
    { id: 3, name: 'Vikram Singh', mobile: '+91 90001 00001', room: 'C-005', amount: '10,000', timestamp: '2026-03-24 | 09:15 AM' },
  ]);

  const menuItems = [
    { id: 'Dashboard', icon: <Home size={22} /> },
    { id: 'Tenants', icon: <Users size={22} /> },
    { id: 'Payments', icon: <CreditCard size={22} /> },
    { id: 'Settings', icon: <User size={22} /> },
  ];

  return (
    <div className="flex h-screen bg-[#FDFDFD] overflow-hidden font-sans text-slate-900">
      
      {/* Sidebar Overlay for Mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 z-40 lg:hidden backdrop-blur-md" 
          onClick={() => setIsSidebarOpen(false)} 
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-80 bg-slate-900 text-white transform transition-all duration-500 lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-10 text-3xl font-black flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-600 rounded-[1.25rem] flex items-center justify-center italic shadow-2xl">H</div>
            <span className="tracking-tighter text-2xl">HomelyLease</span>
          </div>
          <button className="lg:hidden p-2" onClick={() => setIsSidebarOpen(false)}><X /></button>
        </div>
        
        <nav className="px-6 py-4 space-y-3">
          {menuItems.map((item) => (
            <button 
              key={item.id} 
              onClick={() => { setActiveTab(item.id); setIsSidebarOpen(false); }}
              className={`w-full flex items-center gap-5 px-8 py-5 rounded-[1.5rem] transition-all font-black text-xs uppercase tracking-[0.2em] ${activeTab === item.id ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/40 translate-x-2' : 'text-slate-500 hover:bg-slate-800 hover:text-white'}`}
            >
              {item.icon} {item.id}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Top Header */}
        <header className="h-24 bg-white/50 backdrop-blur-xl border-b border-slate-50 flex items-center justify-between px-6 lg:px-12">
          <div className="flex items-center gap-6">
            <button className="lg:hidden p-3 bg-white border border-slate-100 rounded-2xl" onClick={() => setIsSidebarOpen(true)}>
              <Menu size={24}/>
            </button>
            <div className="relative hidden md:block group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <input type="text" placeholder="Global search..." className="pl-14 pr-8 py-4 bg-slate-50 border-none rounded-[1.5rem] text-sm w-80 focus:ring-4 focus:ring-blue-50 transition-all font-bold" />
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            {/* Notifications */}
            <div className="relative">
              <button onClick={() => setShowNotifications(!showNotifications)} className="p-4 text-slate-400 hover:bg-white rounded-[1.25rem] border border-transparent hover:border-slate-100 relative">
                <Bell size={24} />
                <span className="absolute top-4 right-4 w-3 h-3 bg-red-500 rounded-full border-[3px] border-white"></span>
              </button>
            </div>

            {/* Profile Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                className="flex items-center gap-4 border-l border-slate-100 pl-8 ml-2 group"
              >
                <div className="text-right hidden sm:block">
                  <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest leading-none mb-1">Super Admin</p>
                  <p className="text-sm font-black text-slate-900 flex items-center gap-1 group-hover:text-blue-600 transition-colors">Pandey <ChevronDown size={14}/></p>
                </div>
                <div className="w-14 h-14 bg-slate-900 text-white rounded-[1.5rem] flex items-center justify-center font-black shadow-xl">SA</div>
              </button>

              {showProfileDropdown && (
                <div className="absolute top-20 right-0 w-64 bg-white rounded-[2rem] shadow-2xl border border-slate-100 z-[100] p-3 animate-in fade-in slide-in-from-top-4">
                  <div className="p-4 mb-2 border-b border-slate-50">
                    <p className="text-sm font-black text-slate-900">M. Pandey</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">admin@homelylease.com</p>
                  </div>
                  <button onClick={() => setActiveTab('Settings')} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-50 font-bold text-sm transition-all">
                    <User size={18}/> View Profile
                  </button>
                  <div className="my-2 border-t border-slate-50"></div>
                  <button 
                    onClick={onLogout} 
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 font-black text-sm transition-all"
                  >
                    <LogOut size={18}/> Logout Session
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-12 bg-[#F8FAFC]">
          <div className="mb-10">
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">{activeTab}</h1>
            <div className="flex items-center gap-3 mt-4 text-slate-300 font-black text-[10px] uppercase tracking-widest">
              <div className="w-12 h-0.5 bg-blue-600"></div> System Status / Online
            </div>
          </div>

          {activeTab === 'Dashboard' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-in fade-in duration-700">
               {[
                 { label: 'Tenants', value: tenants.length, icon: <Users />, color: 'bg-blue-50' },
                 { label: 'Approvals', value: '1', icon: <FileText />, color: 'bg-orange-50' },
                 { label: 'Collection', value: '₹42,500', icon: <CreditCard />, color: 'bg-purple-50' },
                 { label: 'Alerts', value: '1', icon: <AlertCircle />, color: 'bg-red-50' }
               ].map((stat, i) => (
                 <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm transition-all hover:shadow-lg">
                   <div className={`${stat.color} w-12 h-12 rounded-2xl flex items-center justify-center mb-4`}>{stat.icon}</div>
                   <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">{stat.label}</p>
                   <p className="text-2xl font-black text-slate-900">{stat.value}</p>
                 </div>
               ))}
            </div>
          )}

          {activeTab === 'Tenants' && (
            <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden animate-in slide-in-from-bottom-4">
              <div className="p-8 border-b border-slate-50 flex justify-between items-center">
                <h2 className="font-black text-slate-800 uppercase tracking-tight text-sm">Tenant Directory</h2>
                <button className="bg-slate-900 text-white px-6 py-3 rounded-2xl flex items-center gap-2 text-xs font-black uppercase shadow-xl transition-all hover:bg-black">
                  <Plus size={16}/> Add Tenant
                </button>
              </div>
              <table className="w-full text-left">
                <thead className="text-slate-400 text-[10px] uppercase font-black tracking-widest bg-slate-50/50">
                  <tr><th className="px-8 py-4">Name</th><th className="px-8 py-4">Room</th><th className="px-8 py-4 text-right">Actions</th></tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {tenants.map((t) => (
                    <tr key={t.id} className="hover:bg-slate-50/50 transition-all">
                      <td className="px-8 py-5 font-black text-slate-800">{t.name}</td>
                      <td className="px-8 py-5 font-bold text-slate-500">{t.room}</td>
                      <td className="px-8 py-5 text-right flex justify-end gap-2">
                        <button className="bg-blue-50 text-blue-600 p-2.5 rounded-xl hover:bg-blue-600 hover:text-white transition-all"><Eye size={18}/></button>
                        <button 
                          onClick={() => setTenants(tenants.filter(x => x.id !== t.id))}
                          className="bg-red-50 text-red-500 p-2.5 rounded-xl hover:bg-red-500 hover:text-white transition-all"
                        >
                          <Trash2 size={18}/>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Add similar sections for Payments and Settings here */}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
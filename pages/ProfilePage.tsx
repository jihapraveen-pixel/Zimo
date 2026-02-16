import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User as UserIcon, LogOut, Shield, ChevronRight, Phone, UserPlus } from 'lucide-react';
import { useApp } from '../store/AppContext';

const ProfilePage: React.FC = () => {
  const { user, setUser } = useApp();
  const navigate = useNavigate();
  
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!otpSent) {
      if (name.trim() && phone.trim().length >= 10) {
        setOtpSent(true);
      } else {
        alert('Please enter a valid Name and 10-digit Mobile number');
      }
      return;
    }

    if (!otp || otp.length < 4) {
      alert('Please enter a 4-digit OTP');
      return;
    }

    // Admin login is now triggered exclusively by entering "1990" as the OTP
    const isAdminLogin = otp.trim() === '1990';

    const newUser = {
      id: isAdminLogin ? 'admin_zito' : 'usr_' + Math.random().toString(36).substr(2, 5),
      name: name.trim(),
      mobile: phone.trim(),
      address: isAdminLogin ? 'Admin Office' : 'Customer Address',
      isAdmin: isAdminLogin
    };

    setUser(newUser);

    if (isAdminLogin) {
      navigate('/admin');
    } else {
      navigate('/');
    }
  };

  const handleLogout = () => {
    setUser(null);
    setOtpSent(false);
    setName('');
    setPhone('');
    setOtp('');
  };

  if (!user) {
    return (
      <div className="p-8 space-y-8 animate-in slide-in-from-bottom duration-500">
        <div className="text-center space-y-3">
          <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
              <UserIcon size={48} />
          </div>
          <h1 className="text-3xl font-bold text-emerald-800 tracking-tight">ZITO Login</h1>
          <p className="text-gray-500 text-sm">
            Enter your details to access your account.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative group">
                <UserPlus className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-500 transition-colors" size={18} />
                <input 
                    type="text" required
                    placeholder="Enter Your Name"
                    disabled={otpSent}
                    className="w-full py-4 pl-12 pr-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50 transition-all"
                    value={name}
                    onChange={e => setName(e.target.value)}
                />
            </div>

            <div className="relative group">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-500 transition-colors" size={18} />
                <input 
                    type="tel" required
                    placeholder="Mobile Number"
                    disabled={otpSent}
                    className="w-full py-4 pl-12 pr-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50 transition-all"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                />
            </div>

            {otpSent && (
              <div className="space-y-2 animate-in fade-in zoom-in duration-300">
                <label className="text-xs font-bold text-emerald-600 uppercase ml-2">Enter OTP</label>
                <input 
                    type="text" required
                    placeholder="0000"
                    className="w-full p-4 bg-white border-2 border-emerald-100 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 text-center text-xl font-bold tracking-[1em]"
                    maxLength={4}
                    value={otp}
                    onChange={e => setOtp(e.target.value)}
                />
              </div>
            )}

            <button className="w-full bg-emerald-600 text-white p-4 rounded-2xl font-bold shadow-xl shadow-emerald-100 active:scale-95 hover:bg-emerald-700 transition-all">
                {otpSent ? 'Login Now' : 'Send OTP'}
            </button>
        </form>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="relative">
            <div className="w-24 h-24 bg-sky-100 rounded-full flex items-center justify-center text-sky-600 border-4 border-sky-50 shadow-sm">
                <UserIcon size={48} />
            </div>
            {user.isAdmin && (
              <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-emerald-500 text-white rounded-full flex items-center justify-center border-4 border-white shadow-md">
                  <Shield size={16} />
              </div>
            )}
        </div>
        <div>
            <h2 className="text-2xl font-bold text-gray-800">{user.name}</h2>
            <p className="text-gray-400 text-sm">{user.mobile}</p>
            {user.isAdmin && <span className="text-[10px] font-extrabold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full uppercase mt-2 inline-block">Administrator Mode</span>}
        </div>
      </div>

      <div className="bg-sky-50 p-6 rounded-2xl border border-sky-100 text-center">
          <p className="text-[10px] text-sky-600 font-bold uppercase tracking-widest">Account Status</p>
          <p className="text-xl font-bold text-sky-900">{user.isAdmin ? 'Admin' : 'Member'}</p>
      </div>

      <div className="space-y-3">
        <button 
          onClick={() => navigate('/')}
          className="w-full bg-emerald-50 text-emerald-700 p-4 rounded-2xl font-bold flex items-center justify-center gap-2"
        >
          Go to Home Page
        </button>
        
        {user.isAdmin && (
           <button 
             onClick={() => navigate('/admin')}
             className="w-full bg-sky-600 text-white p-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-sky-100"
           >
             Go to Admin Dashboard
           </button>
        )}
        
        <button 
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-3 p-4 bg-red-50 text-red-500 rounded-2xl font-bold"
        >
            <LogOut size={20} /> Logout
        </button>
      </div>
    </div>
  );
};

export default ProfilePage

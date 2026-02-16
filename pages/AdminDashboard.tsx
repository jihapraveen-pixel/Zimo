
import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../store/AppContext';
import { RequestStatus, Product, Banner } from '../types';
import { 
  BarChart, Users, Package, ArrowUpRight, Check, X, Plus, Trash2,
  Lock, Tag, FileText, TrendingUp, ChevronLeft, Image as ImageIcon,
  Edit2, Save, LayoutGrid, Camera, Upload, Flame, Star, PlusCircle
} from 'lucide-react';
import { ADMIN_PASSWORD } from '../constants';
import { useNavigate } from 'react-router-dom';

const AdminDashboard: React.FC = () => {
  const { requests, updateRequestStatus, products, setProducts, user, banners, setBanners, categories, setCategories } = useApp();
  const navigate = useNavigate();
  
  const [isAuthenticated, setIsAuthenticated] = useState(user?.isAdmin || false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<'requests' | 'inventory' | 'banners' | 'categories'>('requests');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [newCatInput, setNewCatInput] = useState('');

  const productFileRef = useRef<HTMLInputElement>(null);
  const bannerFileRef = useRef<HTMLInputElement>(null);

  useEffect(() => { if (user?.isAdmin) setIsAuthenticated(true); }, [user]);

  const totalKG = requests.reduce((acc, r) => acc + r.clothesWeight, 0);
  const pendingCount = requests.filter(r => r.status === RequestStatus.PENDING).length;

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) setIsAuthenticated(true);
    else alert('Invalid Admin Password!');
  };

  const handleImageUpload = (file: File, callback: (base64: string) => void) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      callback(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // --- Product Management ---
  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    
    if (products.find(p => p.id === editingProduct.id)) {
      setProducts(products.map(p => p.id === editingProduct.id ? editingProduct : p));
    } else {
      setProducts([...products, editingProduct]);
    }
    setEditingProduct(null);
  };

  const startNewProduct = () => {
    // Fixed: Remove 'points' property as it does not exist on the Product type
    setEditingProduct({
      id: Math.random().toString(36).substr(2, 9),
      name: '',
      hindiName: '',
      description: '',
      mrp: 0,
      category: categories[0] || 'Kitchen',
      image: '',
      stock: 10,
      sellCount: 0,
      isTrending: false,
      isPopular: false
    });
  };

  // --- Banner Management ---
  const handleSaveBanner = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBanner) return;

    if (banners.find(b => b.id === editingBanner.id)) {
      setBanners(banners.map(b => b.id === editingBanner.id ? editingBanner : b));
    } else {
      setBanners([...banners, editingBanner]);
    }
    setEditingBanner(null);
  };

  const startNewBanner = () => {
    setEditingBanner({
      id: Date.now().toString(),
      title: '',
      subtitle: '',
      imageUrl: '',
      link: '/exchange'
    });
  };

  // --- Category Management ---
  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    const name = newCatInput.trim();
    if (name && !categories.includes(name)) {
      setCategories([...categories, name]);
      setNewCatInput('');
    } else if (categories.includes(name)) {
      alert("Category already exists!");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-emerald-900 flex flex-col items-center justify-center p-6">
        <button onClick={() => navigate('/profile')} className="absolute top-6 left-6 text-white/50 flex items-center gap-1 text-sm font-bold">
          <ChevronLeft size={16} /> Back
        </button>
        <form onSubmit={handleAuth} className="bg-white rounded-3xl p-8 w-full max-sm space-y-6 shadow-2xl">
            <div className="text-center space-y-2">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4"><Lock size={32} /></div>
                <h1 className="text-2xl font-bold text-gray-800">Admin Login</h1>
                <p className="text-sm text-gray-400">Enter secure password to continue</p>
            </div>
            <input type="password" required className="w-full p-4 rounded-xl bg-gray-50 border border-gray-100 outline-none focus:ring-2 focus:ring-emerald-500" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
            <button className="w-full bg-emerald-600 text-white p-4 rounded-xl font-bold">Access Dashboard</button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pb-10 max-w-md mx-auto shadow-2xl relative">
      <div className="bg-white border-b border-gray-100 p-6 space-y-4 sticky top-0 z-50">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <button onClick={() => navigate('/profile')} className="text-gray-400"><ChevronLeft size={24} /></button>
            <h1 className="text-xl font-bold text-emerald-800 uppercase tracking-tight">Admin ZITO</h1>
          </div>
          <div className="bg-emerald-100 text-emerald-600 px-3 py-1 rounded-full text-[10px] font-bold uppercase">Active</div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <div className="bg-emerald-50 p-3 rounded-xl text-center"><p className="text-lg font-bold">{requests.length}</p><p className="text-[8px] font-bold uppercase text-emerald-600">Requests</p></div>
          <div className="bg-sky-50 p-3 rounded-xl text-center"><p className="text-lg font-bold">{totalKG}kg</p><p className="text-[8px] font-bold uppercase text-sky-600">Collected</p></div>
          <div className="bg-amber-50 p-3 rounded-xl text-center"><p className="text-lg font-bold">{pendingCount}</p><p className="text-[8px] font-bold uppercase text-amber-600">Pending</p></div>
        </div>

        <div className="flex bg-gray-100 p-1 rounded-xl overflow-x-auto no-scrollbar gap-1">
          {[
            { id: 'requests', icon: <FileText size={14}/>, label: 'Activity' },
            { id: 'inventory', icon: <Package size={14}/>, label: 'Products' },
            { id: 'banners', icon: <ImageIcon size={14}/>, label: 'Banners' },
            { id: 'categories', icon: <LayoutGrid size={14}/>, label: 'Categories' }
          ].map(tab => (
            <button 
              key={tab.id}
              onClick={() => { setActiveTab(tab.id as any); setEditingProduct(null); setEditingBanner(null); }}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-[10px] font-bold transition-all whitespace-nowrap px-3 ${activeTab === tab.id ? 'bg-white text-emerald-600 shadow-sm' : 'text-gray-400'}`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 flex-1">
        {activeTab === 'requests' && (
          <div className="space-y-4">
            {requests.map(req => (
              <div key={req.id} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm space-y-3">
                <div className="flex items-center gap-3">
                  <img src={req.imageUrl || 'https://via.placeholder.com/150'} className="w-12 h-12 rounded-lg object-cover" />
                  <div className="flex-1">
                    <h3 className="font-bold text-sm">{req.userName}</h3>
                    <p className="text-[10px] text-gray-400">{req.mobile}</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${req.status === 'Pending' ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'}`}>{req.status}</span>
                </div>
                {req.status === RequestStatus.PENDING && (
                  <div className="flex gap-2">
                    <button onClick={() => updateRequestStatus(req.id, RequestStatus.APPROVED)} className="flex-1 bg-emerald-600 text-white py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1"><Check size={14}/> Approve</button>
                    <button onClick={() => updateRequestStatus(req.id, RequestStatus.REJECTED)} className="flex-1 border border-red-100 text-red-500 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1"><X size={14}/> Reject</button>
                  </div>
                )}
              </div>
            ))}
            {requests.length === 0 && <div className="text-center py-20 text-gray-400 text-sm italic">No recent activity.</div>}
          </div>
        )}

        {activeTab === 'inventory' && (
          <div className="space-y-4">
            {!editingProduct ? (
              <>
                <button onClick={startNewProduct} className="w-full bg-emerald-600 text-white p-4 rounded-2xl font-bold flex items-center justify-center gap-2 mb-2"><Plus size={18}/> Add Product</button>
                <div className="grid grid-cols-1 gap-3">
                  {products.map(p => (
                    <div key={p.id} className="bg-white rounded-2xl p-3 border border-gray-100 flex gap-3 relative group">
                      <img src={p.image || 'https://via.placeholder.com/150'} className="w-16 h-16 rounded-xl object-cover" />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-sm truncate">{p.name}</h4>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          {p.isTrending && <div className="flex items-center gap-0.5 px-1.5 py-0.5 bg-orange-100 text-orange-600 rounded text-[8px] font-bold uppercase"><Flame size={8} /> Trending</div>}
                          {p.isPopular && <div className="flex items-center gap-0.5 px-1.5 py-0.5 bg-amber-100 text-amber-600 rounded text-[8px] font-bold uppercase"><Star size={8} /> Popular</div>}
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-emerald-600 font-bold mt-1">
                          <span className="text-gray-800">MRP: ₹{p.mrp}</span>
                        </div>
                      </div>
                      <div className="flex flex-col gap-1">
                        <button onClick={() => setEditingProduct(p)} className="p-2 bg-sky-50 text-sky-600 rounded-lg"><Edit2 size={14}/></button>
                        <button onClick={() => setProducts(products.filter(item => item.id !== p.id))} className="p-2 bg-red-50 text-red-500 rounded-lg"><Trash2 size={14}/></button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <form onSubmit={handleSaveProduct} className="bg-white p-6 rounded-3xl border border-gray-100 space-y-4 animate-in slide-in-from-right duration-300">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-bold text-lg text-emerald-800">{products.find(p=>p.id===editingProduct.id) ? 'Edit' : 'New'} Product</h3>
                  <button type="button" onClick={() => setEditingProduct(null)} className="text-gray-400"><X size={20}/></button>
                </div>
                
                <div className="space-y-4">
                  <div className="relative group">
                    <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Product Photo</label>
                    {editingProduct.image ? (
                      <div className="relative">
                        <img src={editingProduct.image} className="w-full h-32 object-cover rounded-xl" />
                        <button type="button" onClick={() => setEditingProduct({...editingProduct, image: ''})} className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full"><Trash2 size={14}/></button>
                      </div>
                    ) : (
                      <div 
                        onClick={() => productFileRef.current?.click()}
                        className="w-full h-32 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center gap-2 text-gray-400 cursor-pointer hover:bg-gray-50 transition-colors"
                      >
                        <Camera size={24} />
                        <span className="text-xs font-medium">Click to Upload Photo</span>
                      </div>
                    )}
                    <input 
                      type="file" ref={productFileRef} className="hidden" accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleImageUpload(file, (b64) => setEditingProduct({...editingProduct, image: b64}));
                      }}
                    />
                  </div>

                  <div className="flex gap-4 p-3 bg-gray-50 rounded-xl">
                    <label className="flex-1 flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="w-4 h-4 accent-orange-600" checked={editingProduct.isTrending || false} onChange={e => setEditingProduct({...editingProduct, isTrending: e.target.checked})} />
                      <span className="text-xs font-bold text-gray-600 flex items-center gap-1"><Flame size={14} className="text-orange-600" /> Trending</span>
                    </label>
                    <label className="flex-1 flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="w-4 h-4 accent-amber-600" checked={editingProduct.isPopular || false} onChange={e => setEditingProduct({...editingProduct, isPopular: e.target.checked})} />
                      <span className="text-xs font-bold text-gray-600 flex items-center gap-1"><Star size={14} className="text-amber-600" /> Popular</span>
                    </label>
                  </div>

                  <div className="grid grid-cols-1 gap-3">
                    <input placeholder="Name (English)" required className="w-full p-3 rounded-xl bg-gray-50 text-sm border-0 outline-none focus:ring-1 focus:ring-emerald-500" value={editingProduct.name} onChange={e => setEditingProduct({...editingProduct, name: e.target.value})} />
                    <input placeholder="Name (Hindi)" required className="w-full p-3 rounded-xl bg-gray-50 text-sm border-0 outline-none focus:ring-1 focus:ring-emerald-500" value={editingProduct.hindiName} onChange={e => setEditingProduct({...editingProduct, hindiName: e.target.value})} />
                    <div className="flex gap-2">
                      <input type="number" placeholder="MRP (Cash Price)" className="w-full p-3 rounded-xl bg-gray-50 text-sm border-0 outline-none focus:ring-1 focus:ring-emerald-500" value={editingProduct.mrp || ''} onChange={e => setEditingProduct({...editingProduct, mrp: parseInt(e.target.value) || 0})} />
                    </div>
                    <select className="w-full p-3 rounded-xl bg-gray-50 text-sm border-0 outline-none focus:ring-1 focus:ring-emerald-500" value={editingProduct.category} onChange={e => setEditingProduct({...editingProduct, category: e.target.value})}>
                      {categories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <textarea placeholder="Description" rows={3} className="w-full p-3 rounded-xl bg-gray-50 text-sm border-0 outline-none focus:ring-1 focus:ring-emerald-500" value={editingProduct.description} onChange={e => setEditingProduct({...editingProduct, description: e.target.value})} />
                  </div>
                </div>
                <button className="w-full bg-emerald-600 text-white p-4 rounded-xl font-bold flex items-center justify-center gap-2 mt-4"><Save size={18}/> Save Product</button>
              </form>
            )}
          </div>
        )}

        {activeTab === 'banners' && (
          <div className="space-y-4">
            {!editingBanner ? (
              <>
                <button onClick={startNewBanner} className="w-full bg-sky-600 text-white p-4 rounded-2xl font-bold flex items-center justify-center gap-2"><Plus size={18}/> Add Banner</button>
                <div className="grid grid-cols-1 gap-3">
                  {banners.map(b => (
                    <div key={b.id} className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm relative group">
                      <img src={b.imageUrl || 'https://via.placeholder.com/400x150'} className="h-24 w-full object-cover" />
                      <div className="p-3 flex justify-between items-center">
                        <div>
                          <h4 className="font-bold text-xs">{b.title}</h4>
                          <p className="text-[9px] text-gray-400">{b.subtitle}</p>
                        </div>
                        <div className="flex gap-1">
                          <button onClick={() => setEditingBanner(b)} className="p-2 bg-sky-50 text-sky-600 rounded-lg"><Edit2 size={12}/></button>
                          <button onClick={() => setBanners(banners.filter(item => item.id !== b.id))} className="p-2 bg-red-50 text-red-500 rounded-lg"><Trash2 size={12}/></button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <form onSubmit={handleSaveBanner} className="bg-white p-6 rounded-3xl border border-gray-100 space-y-4 animate-in slide-in-from-right duration-300">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-bold text-lg text-sky-800">{banners.find(b=>b.id===editingBanner.id) ? 'Edit' : 'New'} Banner</h3>
                  <button type="button" onClick={() => setEditingBanner(null)} className="text-gray-400"><X size={20}/></button>
                </div>

                <div className="space-y-4">
                   <div className="relative group">
                    <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Banner Image</label>
                    {editingBanner.imageUrl ? (
                      <div className="relative">
                        <img src={editingBanner.imageUrl} className="w-full h-32 object-cover rounded-xl" />
                        <button type="button" onClick={() => setEditingBanner({...editingBanner, imageUrl: ''})} className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full"><Trash2 size={14}/></button>
                      </div>
                    ) : (
                      <div 
                        onClick={() => bannerFileRef.current?.click()}
                        className="w-full h-32 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center gap-2 text-gray-400 cursor-pointer hover:bg-gray-50 transition-colors"
                      >
                        <Upload size={24} />
                        <span className="text-xs font-medium">Click to Upload Image</span>
                      </div>
                    )}
                    <input 
                      type="file" ref={bannerFileRef} className="hidden" accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleImageUpload(file, (b64) => setEditingBanner({...editingBanner, imageUrl: b64}));
                      }}
                    />
                  </div>

                  <input placeholder="Banner Title" required className="w-full p-3 rounded-xl bg-gray-50 text-sm border-0 outline-none focus:ring-1 focus:ring-sky-500" value={editingBanner.title} onChange={e => setEditingBanner({...editingBanner, title: e.target.value})} />
                  <input placeholder="Banner Subtitle" className="w-full p-3 rounded-xl bg-gray-50 text-sm border-0 outline-none focus:ring-1 focus:ring-sky-500" value={editingBanner.subtitle} onChange={e => setEditingBanner({...editingBanner, subtitle: e.target.value})} />
                  <input placeholder="Link Path (e.g. /exchange)" className="w-full p-3 rounded-xl bg-gray-50 text-sm border-0 outline-none focus:ring-1 focus:ring-sky-500" value={editingBanner.link} onChange={e => setEditingBanner({...editingBanner, link: e.target.value})} />
                </div>
                <button className="w-full bg-sky-600 text-white p-4 rounded-xl font-bold flex items-center justify-center gap-2 mt-4"><Save size={18}/> Save Banner</button>
              </form>
            )}
          </div>
        )}

        {activeTab === 'categories' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
              <h3 className="font-bold text-gray-800 flex items-center gap-2"><LayoutGrid size={18} className="text-emerald-600" /> Manage Categories</h3>
              <form onSubmit={handleAddCategory} className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="Enter category name..." 
                  className="flex-1 p-3 rounded-xl bg-gray-50 text-sm border-0 outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                  value={newCatInput}
                  onChange={e => setNewCatInput(e.target.value)}
                />
                <button 
                  type="submit"
                  className="bg-emerald-600 text-white px-4 py-3 rounded-xl font-bold text-sm shadow-md active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  <PlusCircle size={18} /> Add
                </button>
              </form>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {categories.map(cat => (
                <div key={cat} className="bg-white p-4 rounded-2xl border border-gray-100 flex justify-between items-center group hover:border-red-100 transition-all shadow-sm">
                  <span className="text-sm font-bold text-gray-700">{cat}</span>
                  <button 
                    onClick={() => {
                      if(window.confirm(`Delete "${cat}" category?`)) {
                        setCategories(categories.filter(c => c !== cat));
                      }
                    }} 
                    className="text-gray-300 hover:text-red-500 p-1 rounded-lg hover:bg-red-50 transition-all"
                  >
                    <Trash2 size={16}/>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard


import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Camera, Send, Trash2, CheckCircle2 } from 'lucide-react';
import { useApp } from '../store/AppContext';
import { WHATSAPP_NUMBER, TRANSLATIONS } from '../constants';
import { RequestStatus, ExchangeRequest } from '../types';

const ExchangeForm: React.FC = () => {
  const { language, products, user, addRequest } = useApp();
  const [searchParams] = useSearchParams();
  const t = TRANSLATIONS[language];

  const preselectedProductId = searchParams.get('productId');

  const [formData, setFormData] = useState({
    name: user?.name || '',
    mobile: user?.mobile || '',
    address: user?.address || '',
    weight: 1,
    category: 'Mixed Clothes',
    notes: '',
    productId: preselectedProductId || products[0]?.id || '',
    image: ''
  });

  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (preselectedProductId) {
      setFormData(prev => ({ ...prev, productId: preselectedProductId }));
    }
  }, [preselectedProductId]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const selectedProduct = products.find(p => p.id === formData.productId);
    
    const newRequest: ExchangeRequest = {
      id: Math.random().toString(36).substr(2, 9),
      userId: user?.id || 'guest',
      userName: formData.name,
      mobile: formData.mobile,
      address: formData.address,
      clothesWeight: formData.weight,
      clothesCategory: formData.category,
      notes: formData.notes,
      imageUrl: formData.image,
      productId: formData.productId,
      productName: selectedProduct?.name || 'Unknown',
      status: RequestStatus.PENDING,
      date: new Date().toISOString()
    };

    addRequest(newRequest);

    const message = `Namaste ZITO Exchange 👋\n\nName: ${formData.name}\nMobile: ${formData.mobile}\nAddress: ${formData.address}\nClothes Quantity: ${formData.weight} KG\nCategory: ${formData.category}\nDescription: ${formData.notes || 'N/A'}\nSelected Product for Exchange: ${selectedProduct?.name}\n\nMain exchange request bhej raha hoon.`.trim();

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/91${WHATSAPP_NUMBER}?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="p-8 text-center space-y-6 animate-in zoom-in duration-300">
        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 size={40} />
        </div>
        <div className="space-y-2">
            <h2 className="text-2xl font-bold">Request Submitted!</h2>
            <p className="text-gray-500">Redirecting to WhatsApp for final confirmation. Our agent will contact you soon for pick-up.</p>
        </div>
        <button 
          onClick={() => setSubmitted(false)}
          className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-bold shadow-lg"
        >
            New Request
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-emerald-800">Start Exchange</h1>
        <p className="text-sm text-gray-500">Fill details to get your eco-rewards</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
            <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Full Name</label>
                <input 
                    type="text" required
                    className="w-full p-4 rounded-xl border border-gray-100 bg-gray-50 focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all outline-none"
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                />
            </div>
            <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Mobile Number</label>
                <input 
                    type="tel" required
                    className="w-full p-4 rounded-xl border border-gray-100 bg-gray-50 focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all outline-none"
                    value={formData.mobile}
                    onChange={e => setFormData({...formData, mobile: e.target.value})}
                />
            </div>
            <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Pick-up Address</label>
                <textarea 
                    required rows={2}
                    className="w-full p-4 rounded-xl border border-gray-100 bg-gray-50 focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all outline-none resize-none"
                    value={formData.address}
                    onChange={e => setFormData({...formData, address: e.target.value})}
                />
            </div>
        </div>

        <div className="p-5 bg-emerald-50 rounded-2xl border border-emerald-100 space-y-4">
             <div className="flex justify-between items-center">
                <label className="text-sm font-bold text-emerald-800">Clothes Weight (KG)</label>
                <div className="flex items-center gap-3 bg-white p-1 rounded-lg border border-emerald-200">
                    <button type="button" onClick={() => setFormData({...formData, weight: Math.max(1, formData.weight - 1)})} className="w-8 h-8 flex items-center justify-center font-bold text-emerald-600">-</button>
                    <span className="font-bold text-lg min-w-[30px] text-center">{formData.weight}</span>
                    <button type="button" onClick={() => setFormData({...formData, weight: formData.weight + 1})} className="w-8 h-8 flex items-center justify-center font-bold text-emerald-600">+</button>
                </div>
             </div>

             <div className="space-y-2">
                <label className="text-sm font-bold text-emerald-800">Clothes Category</label>
                <select 
                    className="w-full p-3 rounded-xl border border-emerald-100 focus:ring-2 focus:ring-emerald-500 outline-none"
                    value={formData.category}
                    onChange={e => setFormData({...formData, category: e.target.value})}
                >
                    <option>Mixed Clothes</option>
                    <option>Bed Sheets / Curtains</option>
                    <option>Winter Wear</option>
                    <option>Sarees / Suits</option>
                </select>
             </div>

             <div className="space-y-2">
                <label className="text-sm font-bold text-emerald-800">Clothes Description (Condition/Type)</label>
                <textarea 
                    placeholder="E.g. Mostly cotton shirts, slightly used..."
                    className="w-full p-3 rounded-xl border border-emerald-100 focus:ring-2 focus:ring-emerald-500 outline-none resize-none"
                    rows={2}
                    value={formData.notes}
                    onChange={e => setFormData({...formData, notes: e.target.value})}
                />
             </div>
        </div>

        <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Select Reward Product</label>
            <select 
                required
                className="w-full p-4 rounded-xl border border-gray-100 bg-gray-50 outline-none focus:ring-2 focus:ring-emerald-500"
                value={formData.productId}
                onChange={e => setFormData({...formData, productId: e.target.value})}
            >
                {products.map(p => (
                    <option key={p.id} value={p.id}>{language === 'hi' ? p.hindiName : p.name}</option>
                ))}
            </select>
        </div>

        <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Upload Photo</label>
            {!formData.image ? (
                <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-200 rounded-2xl cursor-pointer hover:bg-gray-50 hover:border-emerald-300 transition-all">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Camera className="w-10 h-10 mb-3 text-gray-400" />
                        <p className="mb-2 text-sm text-gray-500 font-medium">Click to take photo</p>
                    </div>
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                </label>
            ) : (
                <div className="relative group">
                    <img src={formData.image} alt="Preview" className="w-full h-48 object-cover rounded-2xl shadow-md" />
                    <button 
                        type="button"
                        onClick={() => setFormData({...formData, image: ''})}
                        className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full shadow-lg"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            )}
        </div>

        <button 
            type="submit"
            className="w-full bg-emerald-600 text-white p-5 rounded-2xl font-bold flex items-center justify-center gap-3 shadow-lg shadow-emerald-100 hover:bg-emerald-700 active:scale-[0.98] transition-all sticky bottom-4 z-10"
        >
            <Send size={20} />
            Submit Exchange Request
        </button>
      </form>
    </div>
  );
};

export default ExchangeForm;

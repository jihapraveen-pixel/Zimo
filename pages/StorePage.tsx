
import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ShoppingBag, Search, Filter, Recycle, Tag, Users, Wallet } from 'lucide-react';
import { useApp } from '../store/AppContext';
import { WHATSAPP_NUMBER, TRANSLATIONS } from '../constants';

const StorePage: React.FC = () => {
  const { products, language, categories } = useApp();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const t = TRANSLATIONS[language];
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCat, setSelectedCat] = useState<string>(
    searchParams.get('cat') || 'All'
  );

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.hindiName.includes(searchQuery);
    const matchesCat = selectedCat === 'All' || p.category === selectedCat;
    return matchesSearch && matchesCat;
  });

  const handleBuyWithCash = (product: any) => {
    const message = `Namaste ZITO 👋\n\nI want to BUY this product for CASH (Direct Purchase):\n\nProduct: ${product.name}\nPrice: ₹${product.mrp}\n\nPlease share delivery and payment details.`.trim();
    const whatsappUrl = `https://wa.me/91${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleExchange = (productId: string) => {
    navigate(`/exchange?productId=${productId}`);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      <div className="bg-white p-6 pb-2 space-y-4 sticky top-16 z-40 shadow-sm border-b border-gray-100">
        <h1 className="text-2xl font-bold text-gray-800">Eco Shop</h1>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search products..."
            className="w-full py-3 pl-12 pr-4 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex overflow-x-auto gap-2 pb-2 no-scrollbar">
            <button 
                onClick={() => setSelectedCat('All')}
                className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap border transition-all ${selectedCat === 'All' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-gray-500 border-gray-200'}`}
            >
                All
            </button>
            {categories.map(cat => (
                <button 
                    key={cat}
                    onClick={() => setSelectedCat(cat)}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap border transition-all ${selectedCat === cat ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-gray-500 border-gray-200'}`}
                >
                    {cat}
                </button>
            ))}
        </div>
      </div>

      <div className="px-6 space-y-4">
        {filteredProducts.map(product => (
            <div key={product.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow group flex flex-col">
                <div className="relative aspect-[4/3] overflow-hidden">
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    <div className="absolute top-2 left-2 bg-emerald-600 text-white px-2 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 shadow-sm">
                        <Recycle size={10} />
                        Available for Exchange
                    </div>
                    <div className="absolute top-2 right-2 bg-black/50 backdrop-blur-sm text-white px-2 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 shadow-sm">
                        <Users size={10} />
                        {product.sellCount}+ {language === 'hi' ? 'एक्सचेंज' : 'Exchanges'}
                    </div>
                </div>
                <div className="p-4 space-y-2 flex-1 flex flex-col">
                    <div>
                        <h3 className="font-bold text-base text-gray-800">{language === 'hi' ? product.hindiName : product.name}</h3>
                        <p className="text-[10px] text-gray-400 font-medium uppercase mb-1">{product.category}</p>
                        <p className="text-xs text-gray-500 line-clamp-2 italic leading-relaxed">"{product.description}"</p>
                    </div>
                    
                    <div className="pt-3 border-t border-gray-50 mt-auto space-y-2">
                        <div className="flex justify-between items-center mb-1">
                          <div className="flex flex-col">
                              <span className="text-[10px] text-gray-400 font-medium uppercase tracking-tight">Market Rate</span>
                              <span className="text-gray-900 font-bold text-lg flex items-center gap-0.5">
                                ₹{product.mrp || 0}
                              </span>
                          </div>
                          <div className="text-right">
                              <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-tight">Status</span>
                              <span className="text-emerald-700 font-bold text-xs block">Ready to Exchange</span>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <button 
                            onClick={() => handleExchange(product.id)}
                            className="flex-1 bg-emerald-600 text-white py-3 rounded-xl hover:bg-emerald-700 active:scale-95 transition-all shadow-sm flex items-center justify-center gap-2 text-xs font-bold"
                          >
                              <Recycle size={14} /> {t.redeemBtn}
                          </button>
                          <button 
                            onClick={() => handleBuyWithCash(product)}
                            className="flex-1 bg-sky-50 text-sky-700 py-3 rounded-xl border border-sky-100 hover:bg-sky-100 active:scale-95 transition-all flex items-center justify-center gap-2 text-xs font-bold"
                          >
                              <Wallet size={14} /> {t.buyBtn}
                          </button>
                        </div>
                    </div>
                </div>
            </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="px-6 py-20 text-center space-y-3">
            <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto">
                <Filter className="text-gray-300" size={40} />
            </div>
            <p className="text-gray-500 font-medium">No products found in this category.</p>
        </div>
      )}
    </div>
  );
};

export default StorePage;

import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Leaf, Recycle, Award, ShoppingBag, Tag, Flame, Users, Star } from 'lucide-react';
import { useApp } from '../store/AppContext';
import { TRANSLATIONS } from '../constants';

const HomePage: React.FC = () => {
  const { language, products, user, banners, categories } = useApp();
  const t = TRANSLATIONS[language];

  const mainBanner = banners[0] || {
    id: 'default',
    title: 'Eco Exchange',
    subtitle: 'Old Clothes = New Items',
    imageUrl: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=800&q=80',
    link: '/exchange'
  };

  const trendingProducts = products.filter(p => p.isTrending);
  const popularProducts = products.filter(p => p.isPopular);

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      <div className="relative h-60 flex items-center overflow-hidden rounded-b-[40px] shadow-lg">
        <img 
          src={mainBanner.imageUrl} 
          className="absolute inset-0 w-full h-full object-cover"
          alt={mainBanner.title}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/80 to-transparent"></div>
        
        <div className="relative z-10 text-white space-y-2 px-6">
          <div className="inline-block px-3 py-1 bg-emerald-500/30 backdrop-blur-md border border-white/20 rounded-full text-[10px] font-bold tracking-widest uppercase">
            {t.heroText}
          </div>
          <h1 className="text-2xl font-bold leading-tight drop-shadow-md">
            {mainBanner.title}
          </h1>
          <p className="text-white/90 text-sm max-w-[250px] font-medium drop-shadow-sm">
            {mainBanner.subtitle}
          </p>
          <div className="pt-2">
            <Link to={mainBanner.link} className="bg-white text-emerald-700 px-6 py-2.5 rounded-full font-bold text-sm shadow-xl hover:shadow-2xl active:scale-95 transition-all inline-block">
               Learn More
            </Link>
          </div>
        </div>
      </div>

      {user && (
        <div className="px-6 -mt-8 relative z-20">
            <div className="bg-white rounded-2xl p-4 shadow-xl border border-emerald-50 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                        <Award size={24} />
                    </div>
                    <div>
                        <p className="text-gray-400 text-xs font-medium uppercase">Welcome back</p>
                        <p className="text-lg font-bold text-gray-800">{user.name}</p>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-gray-400 text-xs font-medium uppercase">Member</p>
                    <p className="text-emerald-600 font-bold text-sm">Eco Hero</p>
                </div>
            </div>
        </div>
      )}

      <section className="px-6 space-y-4">
        <div className="flex justify-between items-end">
          <h2 className="font-bold text-lg text-gray-800">Shop Categories</h2>
          <Link to="/store" className="text-emerald-600 text-sm font-semibold flex items-center">
            View All <ChevronRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {categories.slice(0, 6).map((cat) => (
            <Link to={`/store?cat=${cat}`} key={cat} className="flex flex-col items-center gap-2 p-3 bg-white border border-gray-100 rounded-2xl shadow-sm hover:border-emerald-200 transition-all">
                <div className="w-12 h-12 bg-sky-50 rounded-xl flex items-center justify-center text-sky-600">
                    <ShoppingBag size={20} />
                </div>
                <span className="text-[10px] font-bold text-gray-600 text-center uppercase tracking-tight truncate w-full">{cat}</span>
            </Link>
          ))}
        </div>
      </section>

      {trendingProducts.length > 0 && (
        <section className="px-6 space-y-4">
          <div className="flex justify-between items-end">
            <h2 className="font-bold text-lg text-gray-800 flex items-center gap-2">
              Trending Now <Flame size={18} className="text-orange-500 fill-orange-500" />
            </h2>
          </div>
          <div className="flex overflow-x-auto gap-4 pb-4 no-scrollbar">
            {trendingProducts.map((product) => (
              <Link to={`/store?search=${product.name}`} key={product.id} className="min-w-[160px] bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex-shrink-0 active:scale-95 transition-transform">
                  <div className="relative">
                    <img src={product.image} alt={product.name} className="h-32 w-full object-cover" />
                    <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-sm text-white text-[8px] px-1.5 py-0.5 rounded-md flex items-center gap-1">
                      <Users size={8} /> {product.sellCount}+ Exchanged
                    </div>
                  </div>
                  <div className="p-3 space-y-1">
                      <h3 className="font-bold text-xs line-clamp-1">{language === 'hi' ? product.hindiName : product.name}</h3>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 text-emerald-600 font-bold text-[10px]">
                            <Recycle size={10} />
                            Exchange
                        </div>
                        <div className="flex items-center gap-0.5 text-gray-900 font-bold text-[10px]">
                            <Tag size={10} className="text-emerald-500" />
                            ₹{product.mrp || 0}
                        </div>
                      </div>
                  </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {popularProducts.length > 0 && (
        <section className="px-6 space-y-4">
          <div className="flex justify-between items-end">
            <h2 className="font-bold text-lg text-gray-800 flex items-center gap-2">
              Popular Items <Star size={18} className="text-amber-400 fill-amber-400" />
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-4 pb-4">
            {popularProducts.map((product) => (
              <Link to={`/store?search=${product.name}`} key={product.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden active:scale-95 transition-transform">
                  <div className="relative">
                    <img src={product.image} alt={product.name} className="h-28 w-full object-cover" />
                  </div>
                  <div className="p-3 space-y-1">
                      <h3 className="font-bold text-xs line-clamp-1">{language === 'hi' ? product.hindiName : product.name}</h3>
                      <div className="flex items-center justify-between">
                        <div className="text-emerald-600 font-bold text-[10px]">
                            Exchange
                        </div>
                        <div className="text-gray-900 font-bold text-[10px]">
                            ₹{product.mrp || 0}
                        </div>
                      </div>
                  </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <div className="px-6">
        <div className="bg-emerald-900 rounded-3xl p-6 text-white flex items-center justify-between overflow-hidden relative shadow-lg">
            <div className="space-y-2 z-10">
                <h3 className="text-lg font-bold">Need Help?</h3>
                <p className="text-white/70 text-xs">Chat with our support team on WhatsApp anytime.</p>
                <a href="https://wa.me/919643281807" target="_blank" rel="noopener noreferrer" className="inline-block bg-white text-emerald-900 px-4 py-2 rounded-xl font-bold text-xs mt-2">
                    Message Now
                </a>
            </div>
            <Leaf className="absolute -right-6 top-1/2 -translate-y-1/2 text-white/10" size={120} />
        </div>
      </div>
    </div>
  );
};

export default HomePage

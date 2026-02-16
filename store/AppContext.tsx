
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Product, ExchangeRequest, Language, RequestStatus, Banner } from '../types';
import { MOCK_PRODUCTS } from '../services/mockData';

interface AppContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  products: Product[];
  setProducts: (products: Product[]) => void;
  requests: ExchangeRequest[];
  setRequests: (requests: ExchangeRequest[]) => void;
  banners: Banner[];
  setBanners: (banners: Banner[]) => void;
  categories: string[];
  setCategories: (cats: string[]) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  addRequest: (req: ExchangeRequest) => void;
  updateRequestStatus: (id: string, status: RequestStatus) => void;
}

const DEFAULT_BANNERS: Banner[] = [
  {
    id: '1',
    title: 'Old Clothes = New Items',
    subtitle: 'No need to sell old clothes! Give them to ZITO and take home kitchen items.',
    imageUrl: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=800&q=80',
    link: '/exchange'
  }
];

const DEFAULT_CATEGORIES = ['Kitchen', 'Storage', 'Bath', 'Kids', 'Jewelry', 'Cleaning'];

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('zito_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('zito_products');
    return saved ? JSON.parse(saved) : MOCK_PRODUCTS;
  });
  const [requests, setRequests] = useState<ExchangeRequest[]>(() => {
    const saved = localStorage.getItem('zito_requests');
    return saved ? JSON.parse(saved) : [];
  });
  const [banners, setBanners] = useState<Banner[]>(() => {
    const saved = localStorage.getItem('zito_banners');
    return saved ? JSON.parse(saved) : DEFAULT_BANNERS;
  });
  const [categories, setCategories] = useState<string[]>(() => {
    const saved = localStorage.getItem('zito_categories');
    return saved ? JSON.parse(saved) : DEFAULT_CATEGORIES;
  });
  
  const [language, setLanguage] = useState<Language>('hi');

  useEffect(() => {
    if (user) {
      localStorage.setItem('zito_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('zito_user');
    }
  }, [user]);

  useEffect(() => localStorage.setItem('zito_products', JSON.stringify(products)), [products]);
  useEffect(() => localStorage.setItem('zito_requests', JSON.stringify(requests)), [requests]);
  useEffect(() => localStorage.setItem('zito_banners', JSON.stringify(banners)), [banners]);
  useEffect(() => localStorage.setItem('zito_categories', JSON.stringify(categories)), [categories]);

  const addRequest = (req: ExchangeRequest) => {
    setRequests(prev => [req, ...prev]);
  };

  const updateRequestStatus = (id: string, status: RequestStatus) => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status } : r));
  };

  return (
    <AppContext.Provider value={{
      user, setUser, products, setProducts, requests, setRequests,
      banners, setBanners, categories, setCategories,
      language, setLanguage, addRequest, updateRequestStatus
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};

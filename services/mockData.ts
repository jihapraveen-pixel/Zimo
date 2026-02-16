
import { Product, Category } from '../types';

export const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Multipurpose Storage Box',
    hindiName: 'बहुउद्देशीय स्टोरेज बॉक्स',
    description: 'Durable plastic box for home storage. Perfect for clothes or toys.',
    mrp: 150,
    image: 'https://images.unsplash.com/photo-1591129841117-3adfd313e34f?auto=format&fit=crop&w=400&q=80',
    category: Category.STORAGE,
    stock: 25,
    sellCount: 142,
    isTrending: true,
    isPopular: true
  },
  {
    id: '2',
    name: 'Unbreakable Water Bottle Set',
    hindiName: 'मजबूत पानी की बोतल सेट',
    description: 'Set of 3 leak-proof bottles made from high-quality food grade plastic.',
    mrp: 299,
    image: 'https://images.unsplash.com/photo-1602143393494-1317043a504a?auto=format&fit=crop&w=400&q=80',
    category: Category.KITCHEN,
    stock: 15,
    sellCount: 89,
    isTrending: true
  },
  {
    id: '3',
    name: 'Kitchen Spice Rack',
    hindiName: 'किचन मसाला रैक',
    description: 'Organize your kitchen with this 12-jar revolving spice rack.',
    mrp: 450,
    image: 'https://images.unsplash.com/photo-1588854337236-6889d631faa8?auto=format&fit=crop&w=400&q=80',
    category: Category.KITCHEN,
    stock: 10,
    sellCount: 54,
    isPopular: true
  },
  {
    id: '4',
    name: 'Strong Plastic Bucket (20L)',
    hindiName: 'मजबूत प्लास्टिक बाल्टी (20 लीटर)',
    description: 'Heavy duty bucket for daily bathroom and laundry use.',
    mrp: 250,
    image: 'https://images.unsplash.com/photo-1584622781564-1d9876a13d00?auto=format&fit=crop&w=400&q=80',
    category: Category.BATH,
    stock: 30,
    sellCount: 120,
    isPopular: true
  },
  {
    id: '5',
    name: 'Kids Lunch Box',
    hindiName: 'बच्चों का लंच बॉक्स',
    description: 'BPA free lunch box with partition. Microwave safe and easy to clean.',
    mrp: 180,
    image: 'https://images.unsplash.com/photo-1601003440997-500ea98a964a?auto=format&fit=crop&w=400&q=80',
    category: Category.KIDS,
    stock: 12,
    sellCount: 65,
    isTrending: true
  },
  {
    id: '6',
    name: 'Plastic Jewelry Organizer',
    hindiName: 'प्लास्टिक ज्वेलरी ऑर्गनाइज़र',
    description: 'Clear drawers to store and find your jewelry easily.',
    mrp: 120,
    image: 'https://images.unsplash.com/photo-1589118949245-7d38baf380d6?auto=format&fit=crop&w=400&q=80',
    category: Category.JEWELRY,
    stock: 40,
    sellCount: 30
  }
];

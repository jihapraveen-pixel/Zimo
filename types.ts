export enum RequestStatus {
  PENDING = 'Pending',
  APPROVED = 'Approved',
  COMPLETED = 'Completed',
  REJECTED = 'Rejected'
}

export enum Category {
  STORAGE = 'Storage',
  KITCHEN = 'Kitchen',
  CLEANING = 'Cleaning',
  KIDS = 'Kids',
  BATH = 'Bath',
  JEWELRY = 'Jewelry'
}

export interface Product {
  id: string;
  name: string;
  hindiName: string;
  description: string;
  mrp?: number;
  image: string;
  category: string;
  stock: number;
  sellCount: number;
  isTrending?: boolean;
  isPopular?: boolean;
}

export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  link: string;
}

export interface User {
  id: string;
  name: string;
  mobile: string;
  address: string;
  isAdmin: boolean;
}

export interface ExchangeRequest {
  id: string;
  userId: string;
  userName: string;
  mobile: string;
  address: string;
  clothesWeight: number;
  clothesCategory: string;
  notes: string;
  imageUrl: string;
  productId: string;
  productName: string;
  status: RequestStatus;
  date: string;
}

export type Language = 'en' | 'hi';
export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  createdAt: Date;
}

export interface HistoryEntry {
  id: string;
  barcode: string;
  productName: string;
  brand?: string;
  imageUrl?: string;
  healthScore: number;
  nutritionGrade?: string;
  scannedAt: Date;
}

export interface FavoriteEntry {
  barcode: string;
  productName: string;
  brand?: string;
  imageUrl?: string;
  healthScore: number;
  nutritionGrade?: string;
  addedAt: Date;
}

export interface ProductList {
  id: string;
  name: string;
  description?: string;
  products: string[]; // Array of barcodes
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductRating {
  barcode: string;
  rating: number; // 1-5 stars
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: 'printing' | 'handmade' | 'souvenir';
  price?: string;
}

export interface GalleryItem {
  id: string;
  imageUrl: string;
  title: string;
  // Positioning props are optional now, calculated dynamically if missing
  rotation?: number;
  top?: string;
  left?: string;
  zIndex?: number;
}

export interface PriceItem {
  service: string;
  price: string;
  details: string;
}

export interface NavItem {
  label: string;
  path: string;
}
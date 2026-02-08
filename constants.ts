import { GalleryItem, PriceItem, Product } from './types';

// ==========================================
// НАЛАШТУВАННЯ ГАЛЕРЕЇ (ЗМІНІТЬ ЦЕ!)
// ==========================================
export const GITHUB_CONFIG = {
  // Ваше ім'я користувача на GitHub (наприклад, 'ivan-petrenko')
  username: 'YOUR_GITHUB_USERNAME', 
  // Назва вашого репозиторію (наприклад, 'dream-print-ua')
  repo: 'YOUR_REPO_NAME',
  // Папка, в яку ви будете кидати фото (має бути всередині public)
  path: 'gallery_images'
};

export const NAV_ITEMS = [
  { label: 'Головна', path: '/' },
  { label: 'Продукти', path: '/products' },
  { label: 'Ціни', path: '/prices' },
  { label: 'Про нас', path: '/about' },
];

// Fallback items in case GitHub API limit is reached or config is wrong
export const GALLERY_ITEMS: GalleryItem[] = [
  { id: '1', imageUrl: 'https://picsum.photos/id/102/400/400', title: 'Малинові свічки', rotation: -5, top: '10%', left: '10%', zIndex: 1 },
  { id: '2', imageUrl: 'https://picsum.photos/id/225/400/400', title: 'Сублімація на чашці', rotation: 8, top: '20%', left: '60%', zIndex: 2 },
  { id: '3', imageUrl: 'https://picsum.photos/id/364/400/400', title: 'Брелоки з епоксидки', rotation: -12, top: '50%', left: '20%', zIndex: 3 },
  { id: '4', imageUrl: 'https://picsum.photos/id/175/400/400', title: 'Гіпсова фігурка', rotation: 4, top: '60%', left: '70%', zIndex: 1 },
  { id: '5', imageUrl: 'https://picsum.photos/id/106/400/400', title: 'Вишивка на худі', rotation: 15, top: '30%', left: '35%', zIndex: 4 },
  { id: '6', imageUrl: 'https://picsum.photos/id/250/400/400', title: 'Пластиковий декор', rotation: -8, top: '75%', left: '45%', zIndex: 2 },
];

export const PRODUCTS: Product[] = [
  {
    id: 'p1',
    title: 'Сублімаційний друк',
    description: 'Друк будь-яких зображень на футболках, чашках, подушках та пазлах. Висока стійкість до прання.',
    imageUrl: 'https://picsum.photos/id/400/600/400',
    category: 'printing'
  },
  {
    id: 'p2',
    title: 'Вироби з епоксидної смоли',
    description: 'Унікальні підвіски, підставки, годинники та брелоки ручної роботи.',
    imageUrl: 'https://picsum.photos/id/1069/600/400',
    category: 'handmade'
  },
  {
    id: 'p3',
    title: 'Ароматичні свічки',
    description: 'Соєві свічки з неймовірними ароматами та дерев’яним гнотом.',
    imageUrl: 'https://picsum.photos/id/678/600/400',
    category: 'handmade'
  },
  {
    id: 'p4',
    title: 'Вишивка',
    description: 'Машинна вишивка на одязі та рушниках. Індивідуальні дизайни.',
    imageUrl: 'https://picsum.photos/id/324/600/400',
    category: 'printing'
  },
  {
    id: 'p5',
    title: 'Гіпсові фігурки',
    description: 'Декор для дому, кашпо для сукулентів та свічники з гіпсу.',
    imageUrl: 'https://picsum.photos/id/1070/600/400',
    category: 'souvenir'
  },
  {
    id: 'p6',
    title: '3D Фігурки',
    description: 'Друк фігурок та деталей з пластику на 3D принтері.',
    imageUrl: 'https://picsum.photos/id/1060/600/400',
    category: 'souvenir'
  },
];

export const PRICES: PriceItem[] = [
  { service: 'Друк на чашці (біла)', price: '250 грн', details: 'Включно з чашкою' },
  { service: 'Друк на футболці (А4)', price: '450 грн', details: 'Бавовна/Поліестер' },
  { service: 'Брелок (епоксидна смола)', price: 'від 150 грн', details: 'Залежить від складності' },
  { service: 'Свічка у гіпсі (100мл)', price: '300 грн', details: 'Соєвий віск' },
  { service: 'Машинна вишивка (лого)', price: 'від 200 грн', details: 'Розробка програми + вишивка' },
  { service: '3D Друк (година)', price: '50 грн', details: 'PLA/PETG пластик' },
];
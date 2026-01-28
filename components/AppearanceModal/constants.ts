import type { ThemeMode } from './types';
import { Monitor, Sun, Moon, LucideIcon } from 'lucide-react';

export const themeOptions: Array<{
  key: ThemeMode;
  text: string;
  icon: LucideIcon;
}> = [
  {
    key: 'system' as const,
    text: 'System preference',
    icon: Monitor,
  },
  {
    key: 'light' as const,
    text: 'Light mode',
    icon: Sun,
  },
  {
    key: 'dark' as const,
    text: 'Dark mode',
    icon: Moon,
  },
];

export interface BackgroundImage {
  id: string;
  url: string;
  alt: string;
}

export interface BackgroundCategory {
  id: string;
  title: string;
  images: BackgroundImage[];
}

export const backgroundCategories: BackgroundCategory[] = [
  {
    id: 'landscape',
    title: 'Landscape',
    images: [
      {
        id: 'landscape-1',
        url: 'https://res.cloudinary.com/di6tqrg5y/image/upload/v1769422684/cristina-gottardi-CSpjU6hYo_0-unsplash_iibp0a.jpg',
        alt: 'Mountain landscape',
      },
      {
        id: 'landscape-2',
        url: 'https://res.cloudinary.com/di6tqrg5y/image/upload/v1769363732/john-towner-3Kv48NS4WUU-unsplash_bujnm1.jpg',
        alt: 'Forest landscape',
      },
      {
        id: 'landscape-3',
        url: 'https://res.cloudinary.com/di6tqrg5y/image/upload/v1769347048/ales-krivec-4miBe6zg5r0-unsplash_h8qpsg.jpg',
        alt: 'Field landscape',
      },
      {
        id: 'landscape-4',
        url: 'https://res.cloudinary.com/di6tqrg5y/image/upload/v1769363540/pietro-de-grandi-T7K4aEPoGGk-unsplash_q6plyc.jpg',
        alt: 'Lake landscape',
      },
    ],
  },
  {
    id: 'abstract',
    title: 'Abstract',
    images: [
      {
        id: 'abstract-1',
        url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&q=80',
        alt: 'Abstract pattern',
      },
      {
        id: 'abstract-2',
        url: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=400&q=80',
        alt: 'Abstract gradient',
      },
      {
        id: 'abstract-3',
        url: 'https://images.unsplash.com/photo-1541701494-874177d18c95?w=400&q=80',
        alt: 'Abstract colors',
      },
      {
        id: 'abstract-4',
        url: 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=400&q=80',
        alt: 'Abstract texture',
      },
    ],
  },
];


import type { ThemeMode } from './types';

export const themeOptions: Array<{
  key: ThemeMode;
  text: string;
  caption: string;
}> = [
  {
    key: 'system' as const,
    text: 'System preference',
    caption: 'Follows OS theme',
  },
  {
    key: 'light' as const,
    text: 'Light mode',
    caption: 'Always light',
  },
  {
    key: 'dark' as const,
    text: 'Dark',
    caption: 'Always dark',
  },
];


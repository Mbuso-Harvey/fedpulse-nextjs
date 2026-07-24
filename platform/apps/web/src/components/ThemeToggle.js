'use client';

import * as React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

export function ThemeToggle({ className }) {
  const { theme, setTheme } = useTheme();

  return (
    <button
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      className={`inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-muted hover:text-foreground h-9 w-9 text-muted-foreground ${className || ''}`}
    >
      <Sun className="h-5 w-5 rotate-0 scale-100 transition-all  " />
      <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all  " />
      <span className="sr-only">Toggle theme</span>
    </button>
  );
}

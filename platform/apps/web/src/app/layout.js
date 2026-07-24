import { Providers } from './providers';
import './globals.css';

export const metadata = {
  title: 'FedPulse — Federal Contract Intelligence',
  description: 'Bloomberg for Canadian federal procurement intelligence. Track $22B+ in contract renewals. Know who buys, who wins, and what expires.',
};

import { ThemeProvider } from '@/components/theme-provider';

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased">
        <ThemeProvider attribute="class" defaultTheme="light" forcedTheme="light" disableTransitionOnChange>
          <Providers>
            {children}
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}

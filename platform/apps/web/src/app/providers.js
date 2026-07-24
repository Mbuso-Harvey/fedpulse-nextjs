'use client'
import { AuthProvider } from '@/lib/auth-context'
import { ThemeProvider } from 'next-themes'
import { TooltipProvider } from '@/components/ui/tooltip'

export function Providers({ children }) {
  return (
    <ThemeProvider attribute="data-theme" defaultTheme="dark">
      <AuthProvider>
        <TooltipProvider>
          {children}
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}

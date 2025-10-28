
import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { cn } from '@/lib/utils';
import { ThemeProvider } from '@/components/ui/theme-provider';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from "@vercel/speed-insights/next";
import { PT_Sans } from 'next/font/google';
import KenaAILogoSrc from '@/app/KenaAI.png';

const pt_sans = PT_Sans({
  subsets: ['latin'],
  weight: ['400', '700'],
  display: 'swap',
  variable: '--font-pt-sans',
});

export const metadata: Metadata = {
  title: 'KenaAI Chat Dashboard',
  description: 'A responsive chat dashboard application.',
  icons: {
    icon: '/icon.png?v=3',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preload" href={KenaAILogoSrc.src} as="image" />
      </head>
      <body className={cn("font-body antialiased", "min-h-screen bg-background font-sans", pt_sans.variable)}>
          <ThemeProvider 
            attribute="class"
            defaultTheme="system"
            enableSystem
            storageKey="kena-ui-theme"
          >
            {children}
            <Toaster />
            <Analytics />
            <SpeedInsights />
          </ThemeProvider>
      </body>
    </html>
  );
}

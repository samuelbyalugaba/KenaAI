
import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { cn } from '@/lib/utils';
import { ThemeProvider } from '@/components/ui/theme-provider';

export const metadata: Metadata = {
  title: 'KenaAI Chat Dashboard',
  description: 'A responsive chat dashboard application.',
  icons: {
    icon: '/icon.png?v=2',
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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet" />
      </head>
      <body className={cn("font-body antialiased", "min-h-screen bg-background font-sans")}>
          <ThemeProvider 
            attribute="class"
            defaultTheme="system"
            enableSystem
            storageKey="kena-ui-theme"
          >
            {children}
            <Toaster />
          </ThemeProvider>
      </body>
    </html>
  );
}

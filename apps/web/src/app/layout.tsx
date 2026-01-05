import { ReactNode } from 'react';
import type { Metadata } from 'next';

// Font
import { Manrope } from 'next/font/google';

// Theme
import { ThemeProvider } from 'next-themes';

// Styles
import './globals.css';

// Utils
import { cn } from '@repo/ui/utils/styles';

const manRope = Manrope({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Task Management',
  description: 'Application to manage task built by NextJS',
  icons: [
    {
      rel: 'icon',
      url: '/favicon.ico',
    },
  ],
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          manRope.className,
          'bg-zinc-50 dark:bg-neutral-900 px-6 py-5',
        )}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}

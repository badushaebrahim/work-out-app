import type { Metadata } from 'next';
import { Lexend, Manrope } from 'next/font/google';
import './globals.css';

const lexend = Lexend({
  variable: '--font-lexend',
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900']
});

const manrope = Manrope({
  variable: '--font-manrope',
  subsets: ['latin'],
  weight: ['200', '300', '400', '500', '600', '700', '800']
});

export const metadata: Metadata = {
  title: 'BUDDY ELITE | DASHBOARD',
  description: 'The world\'s most exclusive premium fitness platform.',
};

import Header from '@/components/Header';
import Navigation from '@/components/Navigation';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark bg-background text-on-surface" suppressHydrationWarning>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body className={`${lexend.variable} ${manrope.variable} antialiased min-h-[100dvh] flex flex-col pb-24`} suppressHydrationWarning>
        <Header />
        {children}
        <Navigation />
      </body>
    </html>
  );
}


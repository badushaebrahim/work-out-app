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

import Header from '@/components/Header';
import Navigation from '@/components/Navigation';
import ServiceWorkerRegistrar from '@/components/ServiceWorkerRegistrar';
import PWAInstallPrompt from '@/components/PWAInstallPrompt';

export const metadata: Metadata = {
  title: 'BUDDY ELITE | DASHBOARD',
  description: "The world's most exclusive premium fitness platform.",
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Buddy Elite',
  },
  other: {
    'mobile-web-app-capable': 'yes',
  },
};





export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark bg-background text-on-surface" suppressHydrationWarning>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#CCFF00" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Buddy Elite" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      </head>
      <body className={`${lexend.variable} ${manrope.variable} antialiased min-h-[100dvh] flex flex-col pb-24`} suppressHydrationWarning>
        <Header />
        <ServiceWorkerRegistrar />
        <PWAInstallPrompt />
        {children}
        <Navigation />
      </body>
    </html>
  );
}


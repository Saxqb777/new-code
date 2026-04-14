import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://freebucks.com'),
  title: {
    default: 'FreeBucks — Get Paid to Watch Ads',
    template: '%s | FreeBucks',
  },
  description:
    'Earn real rewards just by watching ads and completing simple offers. Join 250,000+ members who have earned over $1.2M in PayPal cash and gift cards.',
  keywords: [
    'earn money watching ads',
    'get paid to watch ads',
    'reward points app',
    'freebucks',
    'earn gift cards online',
    'watch ads earn cash',
    'GPT site',
  ],
  openGraph: {
    siteName: 'FreeBucks',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans bg-white text-slate-900 antialiased">
        <Header />
        <main>{children}</main>
        <Footer />
        {/*
          To activate Google AdSense, add this Script tag:

          <Script
            async
            src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXX"
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        */}
      </body>
    </html>
  )
}

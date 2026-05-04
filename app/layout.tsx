import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import CustomCursor from '@/components/layout/CustomCursor'
import PageTransition from '@/components/layout/PageTransition'
import ConciergePod from '@/components/layout/ConciergePod'
import SmoothScroll from '@/components/layout/SmoothScroll'

export const metadata: Metadata = {
  title: {
    default: 'Zazu Safaris — Feel the Wild',
    template: '%s | Zazu Safaris',
  },
  description: "East Africa's premier safari concierge. Bespoke journeys across Kenya & Tanzania — from private conservancies to social group adventures.",
  keywords: ['safari', 'Kenya', 'Tanzania', 'Maasai Mara', 'Serengeti', 'luxury safari', 'wildlife'],
  openGraph: {
    title: "Zazu Safaris — Don't Just See the Wild. Feel It.",
    description: "Bespoke safari experiences across Kenya & Tanzania for every traveller.",
    type: 'website',
    locale: 'en_US',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400;1,600&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap"
          rel="stylesheet"
        />
        <link
          href='https://api.mapbox.com/mapbox-gl-js/v3.6.0/mapbox-gl.css'
          rel='stylesheet'
        />
      </head>
      <body>
        <SmoothScroll>
          <CustomCursor />
          <PageTransition />
          <Navbar />
          <main>{children}</main>
          <Footer />
          <ConciergePod />
        </SmoothScroll>
      </body>
    </html>
  )
}

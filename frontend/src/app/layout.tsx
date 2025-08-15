import type { Metadata } from 'next'
import { Inter, Poppins } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
})

export const metadata: Metadata = {
  title: 'Ai.D NEWS - AI-Powered News Curation',
  description: 'Stay updated with the latest in IT/TECH, AI, Marketing, and Design through our AI-curated weekly newsletters and podcasts.',
  keywords: ['AI', 'Tech News', 'Marketing', 'Design', 'Newsletter', 'Podcast'],
  authors: [{ name: 'Ai.D NEWS Team' }],
  creator: 'Ai.D NEWS',
  publisher: 'Ai.D NEWS',
  metadataBase: new URL('https://aid-news.com'),
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: 'https://aid-news.com',
    title: 'Ai.D NEWS - AI-Powered News Curation',
    description: 'Stay updated with the latest in IT/TECH, AI, Marketing, and Design',
    siteName: 'Ai.D NEWS',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ai.D NEWS - AI-Powered News Curation',
    description: 'Stay updated with the latest in IT/TECH, AI, Marketing, and Design',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko" className={`${inter.variable} ${poppins.variable}`}>
      <body className="font-sans antialiased bg-white text-gray-900">
        {children}
      </body>
    </html>
  )
}
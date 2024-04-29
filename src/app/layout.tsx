import type { Metadata } from 'next'
import '@/styles/globals.css'
import dynamic from 'next/dynamic'
import { inter, satoshi } from './styles/fonts'
import NavWrapper from './components/NavWrapper'
import QueryProvider from './components/QueryProvider'
import ThemeProvider from './components/ThProvider'
import Provider from './components/Provider'
import type { ReactNode } from 'react'
const ToastProvider = dynamic(() => import('@/components/ToastProvider'))

export const metadata: Metadata = {
  title: 'JW Centrs',
  description: 'Make the world a better place',
  keywords: ['jw', 'witnessing', 'centrs'],
  metadataBase: new URL(process.env.BASE_URL!),
  openGraph: {
    url: process.env.BASE_URL,
    images: [
      {
        url: `${process.env.BASE_URL}/opengraph-image.png`,
        width: 180,
        height: 180,
        alt: 'JW Centrs stands',
      },
    ],
    title: 'JW Centrs',
    description: 'Make the world a better place',
    locale: 'ru_RU',
    type: 'website',
  },
  manifest: '/manifest.json',
  //themeColor: '#f5f3f0',
}

export const viewport = {
  themeColor: '#f5f3f0',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang='ru' suppressHydrationWarning>
      <body className={`${inter.variable} ${satoshi.variable}`}>
        <Provider>
          <QueryProvider>
            <ToastProvider />
            <ThemeProvider>
              <NavWrapper />
              <main className='app'>{children}</main>
              <div id='modal-container'></div>
            </ThemeProvider>
          </QueryProvider>
        </Provider>
      </body>
    </html>
  )
}

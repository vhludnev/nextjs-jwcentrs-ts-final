import type { Metadata } from 'next'
import '@/styles/globals.css'
import dynamic from 'next/dynamic'
import { inter, satoshi } from '../../styles/fonts'
import NavWrapper from '../../components/NavWrapper'
import QueryProvider from '../../components/QueryProvider'
import ThemeProvider from '../../components/ThProvider'
import Provider from '../../components/Provider'
import type { ReactNode } from 'react'
import { i18n, Locale } from '../../../i18n.config'
import { unstable_setRequestLocale } from 'next-intl/server'
import { NextIntlClientProvider /* , useMessages */ } from 'next-intl'
import { getMessages, getTranslations } from 'next-intl/server'

const ToastProvider = dynamic(() => import('@/components/ToastProvider'))

// export const metadata: Metadata = {
//   title: 'JW Centrs',
//   description: 'Make the world a better place',
//   keywords: ['jw', 'witnessing', 'centrs'],
//   metadataBase: new URL(process.env.BASE_URL!),
//   openGraph: {
//     url: process.env.BASE_URL,
//     images: [
//       {
//         url: `${process.env.BASE_URL}/opengraph-image.png`,
//         width: 180,
//         height: 180,
//         alt: 'JW Centrs',
//       },
//     ],
//     title: 'JW Centrs',
//     description: 'Make the world a better place',
//     locale: 'ru_RU',
//     type: 'website',
//   },
//   manifest: '/manifest.json',
//   //themeColor: '#f5f3f0',
// }

export async function generateMetadata({ params: { locale } }: { params: { locale: Locale } }) {
  const t = await getTranslations({ locale, namespace: 'HomePage' })

  return {
    title: 'JW Centrs',
    description: t('make-world-better'),
    keywords: ['jw', 'witnessing', 'centrs'],
    metadataBase: new URL(process.env.BASE_URL!),
    openGraph: {
      url: process.env.BASE_URL,
      images: [
        {
          url: `${process.env.BASE_URL}/opengraph-image.png`,
          width: 180,
          height: 180,
          alt: 'JW Centrs',
        },
      ],
      title: 'JW Centrs',
      description: t('make-world-better'),
      locale,
      type: 'website',
    },
    manifest: '/manifest.json',
    //themeColor: '#f5f3f0',
  }
}

export const viewport = {
  themeColor: '#f5f3f0',
}

export async function generateStaticParams() {
  return i18n.locales.map(locale => ({ locale }))
}

export default async function RootLayout({
  children,
  params: { locale },
}: {
  children: ReactNode
  params: { locale: Locale }
}) {
  // Enable static rendering
  unstable_setRequestLocale(locale)
  const messages = await getMessages()
  //const messages = useMessages()

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={`${inter.variable} ${satoshi.variable}`}>
        <NextIntlClientProvider locale={locale} messages={messages}>
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
        </NextIntlClientProvider>
      </body>
    </html>
  )
}

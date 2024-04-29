import { NextResponse } from 'next/server'
import type { NextFetchEvent, NextRequest } from 'next/server'
import acceptLanguage from 'accept-language'
import { i18n, fallbackLng, locales } from '../i18n.config'

//import { match as matchLocale } from '@formatjs/intl-localematcher'
//import Negotiator from 'negotiator'

import { CustomMiddleware } from './chain'

acceptLanguage.languages(locales)

//export function getLocale(request: NextRequest): string | undefined {
// const negotiatorHeaders: Record<string, string> = {}
// request.headers.forEach((value, key) => (negotiatorHeaders[key] = value))

// // @ts-ignore locales are readonly
// const locales: string[] = i18n.locales
// const languages = new Negotiator({ headers: negotiatorHeaders }).languages()

// const locale = matchLocale(languages, locales, i18n.defaultLocale)

// return locale
//}

export function getLocale(request: NextRequest): string | undefined {
  let lng
  if (request.cookies.has('lang')) lng = acceptLanguage.get(request.cookies.get('lang')?.value)
  if (!lng) lng = acceptLanguage.get(request.headers.get('Accept-Language'))
  if (!lng) lng = fallbackLng

  return lng
}

export function middleware(request: NextRequest) {}

export function withI18nMiddleware(middleware: CustomMiddleware) {
  return async (request: NextRequest, event: NextFetchEvent, response: NextResponse) => {
    // do i18n stuff
    const pathname = request.nextUrl.pathname
    const pathnameIsMissingLocale = i18n.locales.every(
      locale => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
    )

    // Redirect if there is no locale
    if (pathnameIsMissingLocale) {
      const locale = getLocale(request)

      //const callbackUrl = request.nextUrl.searchParams.get('callbackUrl')
      //const signInUrl = new URL(`${locale}${pathname}`, request.url)
      //callbackUrl && signInUrl.searchParams.set('callbackUrl', callbackUrl)

      if (locale === i18n.defaultLocale) {
        return NextResponse.rewrite(
          new URL(`/${locale}${pathname.startsWith('/') ? '' : '/'}${pathname}${request.nextUrl.search}`, request.url)
        )
      }

      //return NextResponse.redirect(signInUrl)
      return NextResponse.redirect(
        new URL(`/${locale}${pathname.startsWith('/') ? '' : '/'}${pathname}${request.nextUrl.search}`, request.url)
      )
    }

    return middleware(request, event, response)
  }
}

import createMiddleware from 'next-intl/middleware'
import { i18n, /* pathnames, */ localePrefix } from '../i18n.config'
import { NextResponse } from 'next/server'
import type { NextFetchEvent, NextRequest } from 'next/server'
import { CustomMiddleware } from './chain'

//import {pathnames, locales, localePrefix, defaultLocale} from './config';

export function withNextIntlMiddleware(middleware: CustomMiddleware) {
  return async (request: NextRequest, event: NextFetchEvent /* , response: NextResponse */) => {
    const response = NextResponse.next()

    createMiddleware({
      defaultLocale: i18n.defaultLocale,
      locales: i18n.locales,
      //pathnames,
      localePrefix,
    })

    return middleware(request, event, response)
  }
}
// export default createMiddleware({
//   defaultLocale: i18n.defaultLocale,
//   locales: i18n.locales,
//   pathnames,
//   localePrefix,
// })

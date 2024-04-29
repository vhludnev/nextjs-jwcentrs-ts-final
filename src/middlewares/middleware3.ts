import { NextFetchEvent, NextRequest, NextResponse } from 'next/server'

import { getToken } from 'next-auth/jwt'
import { Locale, i18n /* , pathCheck */ } from '../i18n.config'
import { CustomMiddleware } from './chain'
import { getLocale } from './middleware2'

const protectedPaths = ['/', '/users', '/stand', '/territories']

function getProtectedRoutes(protectedPaths: string[], locales: Locale[]) {
  let protectedPathsWithLocale = [...protectedPaths]

  protectedPaths.forEach(route => {
    locales.forEach(locale => (protectedPathsWithLocale = [...protectedPathsWithLocale, `/${locale}${route}`]))
  })

  return protectedPathsWithLocale
}

export function withAuthMiddleware(middleware: CustomMiddleware) {
  return async (request: NextRequest, event: NextFetchEvent, response: NextResponse) => {
    // Create a response object to pass down the chain
    //const response = NextResponse.next()

    const token = await getToken({ req: request })

    // @ts-ignore
    request.nextauth = request.nextauth || {}
    // @ts-ignore
    request.nextauth.token = token

    const locale = getLocale(request)
    //console.log(request.nextUrl.pathname.startsWith(`${locale}/users`))
    //console.log(`${locale}/users`)

    if (token) {
      const name = token.name as string
      const verified = token.verified as boolean
      const status = token.status as string

      if (!!request.nextUrl.pathname && (!name || !verified)) {
        return NextResponse.rewrite(new URL(`/${locale}/wait`, request.url))
      }

      if (
        (request.nextUrl.pathname.startsWith(`/${locale}/users`) ||
          request.nextUrl.pathname.startsWith(`/${locale}/territories`)) &&
        status !== 'admin'
      ) {
        return NextResponse.rewrite(new URL('/not-found', request.url))
      }

      // if (!!request.nextUrl.pathname && (!name || !verified)) {
      //   return NextResponse.rewrite(new URL('/wait', request.url))
      // }
      // if (
      //   (request.nextUrl.pathname.startsWith(pathCheck(locale, '/users')) ||
      //     request.nextUrl.pathname.startsWith(pathCheck(locale, '/territories'))) &&
      //   status !== 'admin'
      // ) {
      //   return NextResponse.rewrite(new URL('/not-found', request.url))
      // }
    }

    const pathname = request.nextUrl.pathname

    const protectedPathsWithLocale = getProtectedRoutes(protectedPaths, [...i18n.locales])
    //console.log(request.nextUrl.search, pathname)
    if (!token && protectedPathsWithLocale.includes(pathname)) {
      const signInUrl = new URL('/api/auth/signin', request.url)
      signInUrl.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(signInUrl)
    }

    return middleware(request, event, response)
  }
}

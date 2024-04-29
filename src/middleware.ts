// import { withAuth } from 'next-auth/middleware'
// import { NextResponse } from 'next/server'

// export default withAuth(
//   function middleware(req) {
//     const name = req.nextauth.token?.name as string
//     const verified = req.nextauth.token?.verified as boolean
//     const status = req.nextauth.token?.status as string

//     if (!!req.nextUrl.pathname && (!name || !verified)) {
//       return NextResponse.rewrite(new URL('/wait', req.url))
//     }

//     if (
//       (req.nextUrl.pathname.startsWith('/users') || req.nextUrl.pathname.startsWith('/territories')) &&
//       status !== 'admin'
//     ) {
//       return NextResponse.rewrite(new URL('/not-found', req.url))
//     }
//   },
//   {
//     callbacks: {
//       authorized: ({ token }) => !!token,
//     },
//   }
// )

// export const config = {
//   matcher: ['/', '/stand', '/users', '/territories'],
// }

import { chain } from './middlewares/chain'
import { withNextIntlMiddleware } from './middlewares/middleware1'
import { withI18nMiddleware } from './middlewares/middleware2'
import { withAuthMiddleware } from './middlewares/middleware3'

export default chain([withNextIntlMiddleware, withI18nMiddleware, withAuthMiddleware])

export const config = {
  matcher: ['/((?!api|_next/static|favicon.ico|.*\\..*).*)'],
  //matcher: ['/', '/(lv|ru)/:path*'],
}

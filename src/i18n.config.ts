//import { Pathnames } from 'next-intl/navigation'

export const i18n = {
  defaultLocale: 'ru',
  locales: ['ru', 'lv'],
} as const

export type Locale = (typeof i18n)['locales'][number]

export const fallbackLng = 'ru'
export const locales = [fallbackLng, 'lv']

export const pathnames: Record<string, string> = {
  '/': '/',
  '/stand': '/stand',
  '/users': '/users',
  '/auth': '/auth',
  '/territories': '/territories',
}

// export const pathnames = {
//   '/': '/',
//   '/stand': {
//     ru: '/стенды',
//     lv: '/stendi',
//   },
//   '/users': {
//     ru: '/пользователи',
//     lv: '/lietotāji',
//   },
//   '/auth': {
//     ru: '/авторизация',
//     lv: '/autorizācija',
//   },
//   '/territories': {
//     ru: '/участки',
//     lv: '/teritorijas',
//   },
// } satisfies Pathnames<typeof i18n.locales>

// Use the default: `always`
export const localePrefix = /* "as-needed"  */ undefined

//export type AppPathnames = keyof typeof pathnames

// export function pathCheck(locale: string = i18n.defaultLocale, path: keyof typeof pathnames): string {
//   const pathValue = pathnames[path]

//   if (typeof pathValue === 'string') {
//     return `/${locale}${pathValue}`
//   } else {
//     return `/${locale}${(pathValue as Record<string, string>)[locale]}`
//   }
// }

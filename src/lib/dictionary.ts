// import 'server-only'
// import { locales, type Locale } from '../i18n.config'
// import { notFound } from 'next/navigation'

// const dictionaries = {
//   ru: () => import('../dictionaries/ru.json').then(module => module.default),
//   lv: () => import('../dictionaries/lv.json').then(module => module.default),
// }

// export const getDictionary = async (locale: Locale) => {
//   if (!locales.includes(locale as any)) notFound()
//   return dictionaries[locale]()
// }

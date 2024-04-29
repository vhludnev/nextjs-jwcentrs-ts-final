import { notFound } from 'next/navigation'
import { getRequestConfig } from 'next-intl/server'
import { i18n } from './i18n.config'

export default getRequestConfig(async ({ locale }) => {
  // Validate that the incoming `locale` parameter is valid
  //console.log('locale: ', locale)
  if (!i18n.locales.includes(locale as any)) notFound()

  // return {
  //   messages: (await import(`../messages/${locale}.json`)).default,
  // }

  return {
    messages: (
      await (locale === 'ru'
        ? // When using Turbopack, this will enable HMR for `en`
          import('../messages/ru.json')
        : import(`../messages/${locale}.json`))
    ).default,
  }
})

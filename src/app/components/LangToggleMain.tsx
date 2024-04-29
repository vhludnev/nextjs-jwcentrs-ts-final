import '@/styles/mainlangtoggle.css'

import { useParams, usePathname /* useSelectedLayoutSegments */, useRouter } from 'next/navigation'
import { ChangeEvent, useCallback, useEffect, useTransition } from 'react'
import Cookies from 'js-cookie'
import { i18n, locales /* , pathnames */ } from '../../i18n.config'
//import { usePathname, useRouter } from '../../navigation'

const LangToggleMain = () => {
  const [isPending, startTransition] = useTransition()
  //const urlSegments = useSelectedLayoutSegments()

  const router = useRouter()
  const params = useParams()
  const pathname = usePathname()

  /* Update Lang cookie if user changes lang in url */
  useEffect(() => {
    const pathPart = pathname.split('/')[1]
    const newLocale = locales.includes(pathPart) ? pathPart : i18n.defaultLocale
    const existingCookie = Cookies.get('lang')
    if (existingCookie && existingCookie === newLocale) {
      return
    } else {
      Cookies.set('lang', newLocale, { expires: 30 })
    }
  }, [])

  // Updated URL
  const redirectedPathName = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const newLocale = e.target.checked ? 'ru' : 'lv'
      Cookies.set('lang', newLocale, { expires: 30 }) // Set language cookie with a 30-day expiration

      // startTransition(() =>
      //   // @ts-expect-error
      // setTimeout(() => router.push(urlSegments.length ? `/${newLocale}/${urlSegments.join('/')}` : `/${newLocale}`), 800)
      // )

      // Split the path into segments and remove any empty strings
      const segments = pathname.split('/').filter(Boolean)
      const currentLocale = locales.includes(segments[0]) ? segments[0] : null

      let newPath: any /* | keyof typeof pathnames */

      if (newLocale === i18n.defaultLocale) {
        // If defaultLocale is specified, remove the locale if it's already part of the URL
        if (currentLocale) {
          // Remove the first segment which is the locale
          segments.shift()
        }
        newPath = `/${segments.join('/')}`
      } else {
        // For 'lv' or other locales, add or replace with that locale (example: 'lv')
        if (currentLocale) {
          // Replace existing locale
          segments[0] = newLocale
        } else {
          // Add other (example: 'lv') locale at the start
          segments.unshift(newLocale)
        }
        newPath = `/${segments.join('/')}`
      }

      startTransition(() => {
        // to see animation on lang toggle
        let timeoutId: null | ReturnType<typeof setTimeout> = null
        timeoutId = setTimeout(() => router.push(newPath), 700)

        //router.replace(
        // TypeScript will validate that only known `params`
        // are used in combination with a given `pathname`. Since the two will
        // always match for the current route, we can skip runtime checks.
        //   { pathname, params },
        //   { locale: newLocale }
        //),
        //  500
      })
    },
    [router, pathname]
  )

  return (
    <div className='tg-item'>
      <input
        defaultChecked={params.locale === i18n.defaultLocale}
        disabled={isPending}
        className='tgl tgl-flip'
        id='cb5'
        type='checkbox'
        onChange={redirectedPathName}
      />
      <label className='tgl-btn' data-tg-off='LAT' data-tg-on='РУС' htmlFor='cb5'></label>
    </div>
  )
}

export default LangToggleMain

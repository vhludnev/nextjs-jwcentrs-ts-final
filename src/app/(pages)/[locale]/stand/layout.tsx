import type { ReactNode } from 'react'
import { getTranslations } from 'next-intl/server'
import type { Locale } from '../../../../i18n.config'

// export const metadata = {
//   title: 'Служение со стендами | JW Centrs',
// }

type Props = {
  children: ReactNode
  //params: { locale: Locale }
}

export async function generateMetadata({ params: { locale } }: { params: { locale: Locale } }) {
  const t = await getTranslations({ locale, namespace: 'StandPage' })

  return {
    title: `${t('stand-service')} | JW Centrs`,
  }
}

export default function StandLayout({ children /* , params */ }: Props) {
  //console.log(params)

  return <section className='w-full flex-center flex-col relative sm:container'>{children}</section>
}

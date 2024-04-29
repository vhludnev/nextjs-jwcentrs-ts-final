import type { ReactNode } from 'react'
import { getTranslations } from 'next-intl/server'
import type { Locale } from '../../../../i18n.config'

// export const metadata = {
//   title: "Территории | JW Centrs",
// };

type Props = {
  children: ReactNode
}

export async function generateMetadata({ params: { locale } }: { params: { locale: Locale } }) {
  const t = await getTranslations({ locale, namespace: 'HomePage' })

  return {
    title: `${t('territories')} | JW Centrs`,
  }
}

export default function TerritoryLayout({ children }: Props) {
  return (
    <section className='flex flex-start flex-col relative xxs:w-[94dvw] sm:w-full sm:container'>{children}</section>
  )
}

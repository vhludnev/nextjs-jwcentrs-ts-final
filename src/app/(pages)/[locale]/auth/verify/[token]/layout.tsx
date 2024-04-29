import type { ReactNode } from 'react'
import { getTranslations } from 'next-intl/server'
import type { Locale } from '../../../../../../i18n.config'

// export const metadata = {
//   title: "Проверка | JW Centrs",
// };

type Props = {
  children: ReactNode
}

export async function generateMetadata({ params: { locale } }: { params: { locale: Locale } }) {
  const t = await getTranslations({ locale, namespace: 'AuthPage' })

  return {
    title: `${t('verification')} | JW Centrs`,
  }
}

export default function VerifySignupTokenLayout({ children }: Props) {
  return <div className='flex flex-col justify-center min-h-[70vh] w-full bg-primary-white'>{children}</div>
}

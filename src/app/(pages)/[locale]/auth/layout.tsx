import type { ReactNode } from 'react'
import { getTranslations } from 'next-intl/server'
import type { Locale } from '../../../../i18n.config'

type Props = {
  children: ReactNode
}

// export const metadata = {
//   title: "Авторизация | JW Centrs",
// };

export async function generateMetadata({ params: { locale } }: { params: { locale: Locale } }) {
  const t = await getTranslations({ locale, namespace: 'AuthPage' })

  return {
    title: `${t('authorization')} | JW Centrs`,
  }
}

export default function AuthLayout({ children }: Props) {
  return <section className='flex flex-col text-center mb-16 max-w-[25rem] p-4 container'>{children}</section>
}

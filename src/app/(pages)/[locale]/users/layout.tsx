import type { ReactNode } from 'react'
import { getTranslations } from 'next-intl/server'
import type { Locale } from '../../../../i18n.config'

type Props = {
  children: ReactNode
}

// export const metadata = {
//   title: "Список зарегистрированных возвещателей | JW Centrs",
// };

export async function generateMetadata({ params: { locale } }: { params: { locale: Locale } }) {
  const t = await getTranslations({ locale, namespace: 'UsersPage' })

  return {
    title: `${t('registered-users')} | JW Centrs`,
  }
}

export default function AllUsersListLayout({ children }: Props) {
  return <section className='flex-start flex-col relative xxs:w-[94dvw] sm:w-full sm:container'>{children}</section>
}

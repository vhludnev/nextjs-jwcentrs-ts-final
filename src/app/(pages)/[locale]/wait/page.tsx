import { useTranslations } from 'next-intl'

const page = () => {
  const t = useTranslations('AuthPage')
  return <div className='text-center mt-[38vh] text-2xl md:text-3xl'>{t('wait-confirmation')}</div>
}

export default page

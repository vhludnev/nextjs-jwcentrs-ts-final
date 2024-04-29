import { useTranslations } from 'next-intl'

const notFound = () => {
  const t = useTranslations('AuthPage')

  return (
    <div className='grid min-h-[80vh] place-items-center w-full z-30 bg-primary-white'>
      <div className='text-center'>
        <p className='text-xl font-semibold text-emerald-700 dark:text-emerald-500'>{t('error.page-not-found')}</p>

        <div className='mt-10 text-base leading-7 text-zinc-500 dark:text-zinc-400'>
          <button className='bg-transparent hover:bg-blue-500 text-blue-500 hover:text-white font-semibold py-2 px-4 border border-blue-500 hover:border-transparent rounded transition ease-in-out duration-250'>
            <a href='/' className='link link-accent'>
              {t('error.return-to-main')}
            </a>
          </button>
        </div>
      </div>
    </div>
  )
}

export default notFound

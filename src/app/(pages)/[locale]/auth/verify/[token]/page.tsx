import { getTranslations, unstable_setRequestLocale } from 'next-intl/server'
import { Locale } from '../../../../../../i18n.config'

async function getData(token: string) {
  const res = await fetch(`${process.env.BASE_URL}/api/auth/signup-verify/${token}`)
  if (!res.ok) {
    throw new Error('Failed to fetch data')
  }

  return res.json()
}

const VerifySignupToken = async ({ params: { token, locale } }: { params: { token: string; locale: Locale } }) => {
  const { data, error } = await getData(token)

  unstable_setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'AuthPage' })

  return (
    <>
      {data ? (
        <>
          <p className='text-xl font-semibold text-emerald-700 dark:text-emerald-500'>
            {t('confirm.registration-success')}
          </p>

          <div className='mt-10 text-base leading-7 text-zinc-500 dark:text-zinc-400'>
            <button className='bg-transparent hover:bg-blue-500 text-blue-500 hover:text-white font-semibold py-2 px-4 border border-blue-500 hover:border-transparent rounded transition ease-in-out duration-250'>
              <a href='/' className='link link-accent'>
                {t('sign-in')}
              </a>
            </button>
          </div>
        </>
      ) : (
        <p className='text-xl font-semibold text-rose-600 dark:text-rose-500'>{error}</p>
      )}
    </>
  )
}

export default VerifySignupToken

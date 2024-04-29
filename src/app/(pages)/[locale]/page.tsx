//import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/session'
import { permission } from '@/lib/permissions'
//import { getDictionary } from '../../../lib/dictionary'
import type { Locale } from '../../../i18n.config'
import CustomLink from '@/components/CustomLink'
import { getTranslations, unstable_setRequestLocale } from 'next-intl/server'

const Home = async ({ params: { locale } }: { params: { locale: Locale } }) => {
  const session = await getCurrentUser()
  //const { nav } = await getDictionary(params.locale)

  // Enable static rendering
  unstable_setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'HomePage' })

  //if (!session) return redirect(`${locale}/auth`)
  if (!session) return redirect('/auth')

  return (
    <section className='xxs:w-full sm:w-10/12 lg:w-9/12 grid grid-cols-[190px] xxs:grid-cols-autoSquares justify-center px-5 gap-x-6 sm:gap-x-20 lg:gap-x-24 gap-y-8 md:gap-y-20'>
      <div className='sm:min-w-[12rem] md:min-w-[12rem]'>
        <h2 className='font-satoshi font-semibold text-center text-xl sm:text-2xl text-gray-700 dark:text-gray-200 mb-2 sm:mb-4 lg:mb-6'>
          {t('stands')}
        </h2>
        <div className='my-0 mx-auto sm:p-2.5 rounded-2xl sm:border-4 border-gray-600 dark:border-gray-400 cursor-pointer'>
          <CustomLink href='/stand' /* lang={params.locale} */ className='cursor-none md:cursor-pointer'>
            <div className='lg:-mr-2.5 rounded-2xl lg:rounded-l-2xl lg:rounded-r hover:bg-[#f7f382] transition ease-in-out duration-200'>
              <div className='w-full lg:w-auto max-w-[22rem] rounded-2xl border-2 md:border-4 border-gray-600 dark:border-gray-400 p-7 sm:p-8 md:p-8 lg:-mr-4.5'>
                <img width={194} height={194} src='/icons/trolley.svg' alt='trolley' className='main-icon lg:pr-3' />
              </div>
            </div>
          </CustomLink>
        </div>
      </div>

      {permission('admin', session?.user) && (
        <>
          <div className='sm:min-w-[12rem] md:min-w-[12rem]'>
            <h2 className='font-satoshi font-semibold text-center text-xl sm:text-2xl text-gray-700 dark:text-gray-200 mb-2 sm:mb-4 lg:mb-6'>
              {t('territories')}
            </h2>
            <div className='my-0 mx-auto sm:p-2.5 rounded-2xl sm:border-4 border-gray-600 dark:border-gray-400 cursor-pointer relative'>
              <CustomLink
                href='/territories'
                //lang={params.locale}
                prefetch={false}
                className='cursor-none md:cursor-pointer'
              >
                <div className='lg:-mr-2.5 rounded-2xl lg:rounded-l-2xl lg:rounded-r hover:bg-[#f9b9d3] transition ease-in-out duration-200'>
                  <div className='w-full lg:w-auto max-w-[22rem] rounded-2xl border-2 md:border-4 border-gray-600 dark:border-gray-400 p-7 sm:p-8 md:p-8 lg:-mr-4.5'>
                    <img
                      width={194}
                      height={194}
                      src='/icons/territories.svg'
                      alt='territory'
                      className='main-icon lg:pr-3'
                    />
                  </div>
                </div>
                <span className='absolute top-3 sm:top-6 right-3 sm:right-6 lg:right-2 w-5 sm:w-6'>
                  <img width={24} height={24} alt='bust' src='/icons/elder.svg' />
                </span>
              </CustomLink>
            </div>
          </div>
          <div className='sm:min-w-[12rem] md:min-w-[12rem]'>
            <h2 className='font-satoshi font-semibold text-center text-xl sm:text-2xl text-gray-700 dark:text-gray-200 mb-2 sm:mb-4 lg:mb-6'>
              {t('users')}
            </h2>
            <div className='my-0 mx-auto sm:p-2.5 rounded-2xl sm:border-4 border-gray-600 dark:border-gray-400 cursor-pointer relative'>
              <CustomLink
                href='/users'
                /* lang={params.locale} */ prefetch={false}
                className='cursor-none md:cursor-pointer'
              >
                <div className='lg:-mr-2.5 rounded-2xl lg:rounded-l-2xl lg:rounded-r hover:bg-[#82f7eb] transition ease-in-out duration-200'>
                  <div className='w-full lg:w-auto max-w-[22rem] rounded-2xl border-2 md:border-4 border-gray-600 dark:border-gray-400 p-7 sm:p-8 md:p-8 lg:-mr-4.5'>
                    <img width={194} height={194} src='/icons/users.svg' alt='users' className='main-icon lg:pr-3' />
                  </div>
                </div>
                <span className='absolute top-3 sm:top-6 right-3 sm:right-6 lg:right-2 w-5 sm:w-6'>
                  <img width={24} height={24} alt='bust' src='/icons/elder.svg' />
                </span>
              </CustomLink>
            </div>
          </div>
        </>
      )}
    </section>
  )
}

export default Home

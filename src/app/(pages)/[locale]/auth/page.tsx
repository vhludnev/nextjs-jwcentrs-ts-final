'use client'

import { useState, useRef, /* useEffect, */ FormEvent } from 'react'
import { useSession, signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { FcGoogle, TbLoader, MdOutlineVisibility, MdOutlineVisibilityOff } from '@/lib/icons'
import { toast } from 'react-toastify'
import Link from 'next/link'
import { useTranslations } from 'next-intl'

const AuthForm = () => {
  const nameInputRef = useRef<HTMLInputElement>(null)
  const emailInputRef = useRef<HTMLInputElement>(null)
  const passwordInputRef = useRef<HTMLInputElement>(null)
  const [loading, setLoading] = useState(false)
  const [signingUp, setSigningUp] = useState(false)
  const [isLogin, setIsLogin] = useState(true)
  const [loginError, setLoginError] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const { data: session, status } =
    useSession(/* {
    required: true,
    onUnauthenticated() {},
  } */)

  const t = useTranslations('AuthPage')

  const router = useRouter()

  const searchParams = useSearchParams()

  const callbackUrl = searchParams.get('callbackUrl') ?? '/'

  // useEffect(() => {
  //   session && router.replace('/')
  // }, [session])

  const switchAuthModeHandler = () => {
    setIsLogin(prevState => !prevState)
  }

  const submitHandler = async (event: FormEvent) => {
    event.preventDefault()

    const name = nameInputRef.current?.value.trim()
    const email = emailInputRef.current?.value
    const password = passwordInputRef.current?.value

    if (!email || !password) {
      toast.error(t('error.need-all-fields'))
      return
    }

    if (!/^(\w[-._+\w]*\w@\w[-._\w]*\w\.\w{2,3})$/.test(email)) {
      toast.error(t('error.check-email'))
      return
    }
    // optional: Add validation
    const alreadyRegisteredMsg = t('error.email-already-registered')

    if (isLogin) {
      setLoading(true)
      const { error }: any = await signIn('credentials', {
        redirect: false, // overiding default redirect to error page
        email,
        password,
      })

      if (error) {
        toast.error(t(`error.${error}`))
        setLoading(false)
        error !== alreadyRegisteredMsg && setLoginError(true)
        return
      } else {
        setLoading(false)
        router.push(callbackUrl) // redirecting to initiated page if success
      }
    } else {
      if (!name) {
        toast.error(t('error.need-full-name'))
        return
      }

      try {
        //Verify email message
        setLoading(true)

        const response = await fetch('/api/auth/signup-verify', {
          method: 'POST',
          body: JSON.stringify({ name, email, password }),
          headers: {
            'Content-Type': 'application/json',
          },
        })
        const { error, data } = await response.json()

        if (error) {
          setLoading(false)
          toast.error(t(`error.${error}`))
          error === alreadyRegisteredMsg && setIsLogin(true)
        }

        if (data) {
          setLoading(false)
          setSigningUp(true)
          setTimeout(() => {
            setSigningUp(false)
            setIsLogin(true)
            setLoginError(false)
            return
          }, 10000)
        }
      } catch (error) {
        toast.error(t('error.error-happened'))
        setLoading(false)
      }
    }
  }

  if (session || status === 'loading') return null

  if (signingUp && !loading) {
    return (
      <div className='flex flex-col justify-center gap-4 h-[70vh] place-items-center'>
        <h1 className='font-extrabold leading-[1.15]'>
          <span className='blue_gradient'>{t('thanks')}</span>
        </h1>
        <span className='md:text-lg'>{t('confirm.link-sent')}</span>
      </div>
    )
  }

  return (
    <>
      <h1 className='text-center mb-4'>
        <span className='blue_gradient'>{isLogin ? t('enter') : t('registration')}</span>
      </h1>

      <div className='cursor-pointer transition duration-300 ease-in-[cubic-bezier(0.95,0.05,0.795,0.035)] flex justify-center mx-auto w-fitContent p-1 bg-[#FAF9F6] border-2 rounded-full border-transparent hover:animate-spin-slow hover:shadow-none hover:bg-transparent shadow-lg'>
        <FcGoogle size={30} onClick={() => signIn('google', { callbackUrl })} />
      </div>
      <p className='pt-2 pb-4'>{t('or')}</p>
      <form onSubmit={submitHandler} /* action="/api/auth/callback/credentials" method="post" */>
        {!isLogin && (
          <div className='mb-2'>
            <label className='block mb-2 font-bold' htmlFor='name'>
              {t('full-name')}
            </label>
            <input
              className='auth_form_input px-3 text-center tracking-wider'
              type='text'
              id='name'
              ref={nameInputRef}
              autoComplete='name'
            />
          </div>
        )}
        <div className='mb-2'>
          <label className='block mb-2 font-bold' htmlFor='email'>
            {t('email')}
          </label>
          <input
            className='auth_form_input px-3 text-center tracking-wider'
            type='email'
            id='email'
            ref={emailInputRef}
            autoComplete='email'
          />
        </div>
        <div className='mb-2'>
          <label className='block mb-2 font-bold' htmlFor='password'>
            {t('password')}
          </label>
          <div className='relative'>
            <input
              className='auth_form_input pl-8 pe-8 text-center tracking-wider'
              type={showPassword ? 'text' : 'password'}
              id='password'
              ref={passwordInputRef}
              autoComplete='current-password'
            />
            {showPassword ? (
              <MdOutlineVisibilityOff
                className='absolute top-1.5 right-2'
                color='#999'
                cursor='pointer'
                size={22}
                onClick={() => setShowPassword(prevState => !prevState)}
              />
            ) : (
              <MdOutlineVisibility
                className='absolute top-1.5 right-2'
                color='#999'
                cursor='pointer'
                size={22}
                onClick={() => setShowPassword(prevState => !prevState)}
              />
            )}
          </div>
        </div>
        <div className='flex flex-col items-center mt-6'>
          <button
            disabled={loading}
            className={
              !loading
                ? 'text-white rounded px-10 py-2 bg-[#6992ca] border-[#6992ca] hover:bg-[#3171c9] hover:border-[#3171c9]'
                : 'p-1 outline-none'
            }
          >
            {loading ? (
              <TbLoader size={32} color='#3171c9' className='animate-spin-slow' />
            ) : !loading && isLogin ? (
              t('enter')
            ) : (
              t('register')
            )}
          </button>
          <button
            type='button'
            className='mt-6 bg-transparent border-0 text-[#6992ca] px-6 py-1 hover:text-[#3171c9]'
            onClick={switchAuthModeHandler}
          >
            {isLogin ? t('no-account-yet') : t('have-account')}
          </button>
          {isLogin && loginError && (
            <Link href='/auth/forgot-password' prefetch={false} className='cursor-pointer mt-3.5 text-yellow-600'>
              {t('lost-password')}
            </Link>
          )}
        </div>
      </form>
    </>
  )
}

export default AuthForm

'use client'

import dynamic from 'next/dynamic'
import { useState, useEffect, useRef, useLayoutEffect } from 'react'
import { signOut } from 'next-auth/react'
import { usePathname } from 'next/navigation'
import type { Session } from 'next-auth'
//import Link from 'next/link'
import Image from 'next/image'
import { FcKey, VscSignOut, BiMenu, TbTrolley, TbUsers, BsPinMap } from '@/lib/icons'
import ThemeSwitcher from './ThemeSwitcher'
import ProfilePopup from './popups/ProfilePopup'
import { cc, permissionClient } from '@/utils'
//import { Locale } from '../../i18n.config'
import CustomLink from './CustomLink'
import { useTranslations } from 'next-intl'

const LangToggleMain = dynamic(() => import('./LangToggleMain'))

interface Props {
  session: Session | null
  //lang: Locale
}

const Nav = ({ session }: Props) => {
  const menuRef = useRef<HTMLDivElement>(null)
  const burgerRef = useRef<HTMLDivElement>(null)
  const [toggleDropdown, setToggleDropdown] = useState(false)
  const [scrollingDown, setScrollingDown] = useState(false)

  const closeNavBar = () => setToggleDropdown(false)

  const t = useTranslations('HomePage')
  const pathname = usePathname()

  useLayoutEffect(() => {
    document.documentElement.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [pathname])

  const changeNavbarColor = () => {
    if (window.scrollY >= 80) {
      setScrollingDown(true)
    } else {
      setScrollingDown(false)
    }
  }

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', changeNavbarColor)
    }
  })

  const activeStyle = (path: string) =>
    pathname == path
      ? 'nav_btn cursor-default'
      : 'text-gray-700 hover:text-blue-400 dark:text-gray-300 dark:hover:text-blue-400'

  useEffect(() => {
    let handler = (e: MouseEvent): void => {
      if (
        e.target instanceof HTMLElement &&
        !menuRef.current?.contains(e.target) &&
        !burgerRef.current?.contains(e.target)
      ) {
        setToggleDropdown(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  })

  return (
    <div
      className={cc(
        'nav-wrapper border-b-2',
        'fixed top-0 z-20 w-dvw h-18 sm:h-20',
        scrollingDown ? 'border-slate-200 dark:border-slate-500' : 'border-transparent'
      )}
    >
      <nav className='px-3.5 md:container md:mx-auto h-full flex items-center justify-between'>
        <div>
          <CustomLink href={'/'} onClick={closeNavBar}>
            <Image src='/icons/logo50.png' alt='logo' width={34} height={34} className='object-contain' priority />
          </CustomLink>
        </div>

        {/* <div className="-mr-2 md:mr-0"> */}
        <div className='-mr-2 md:mr-0'>
          <div className={cc('flex relative', toggleDropdown && 'active')}>
            <div
              ref={burgerRef}
              className={`z-50 rounded-full p-1.5 bg-primary-white transition-all duration-300 ease-in-out ${
                toggleDropdown ? 'dark:bg-slate-600' : 'dark:bg-transparent delay-300'
              }`}
            >
              <BiMenu
                size={36}
                color='dodgerblue'
                className={toggleDropdown ? 'dark:text-white' : 'text-[#1e90ff]'}
                cursor='pointer'
                onClick={() => setToggleDropdown(prev => !prev)}
              />
              {/* <div
                className={toggleDropdown ? "is-open" : "is-closed"}
                onClick={() => setToggleDropdown((prev) => !prev)}
              >
                <div
                  className={`menu-bar ${
                    toggleDropdown
                      ? "dark:bg-white bg-[#1e90ff]"
                      : "bg-[#1e90ff]"
                  }`}
                ></div>
                <div
                  className={`menu-bar ${
                    toggleDropdown
                      ? "dark:bg-white bg-[#1e90ff]"
                      : "bg-[#1e90ff]"
                  }`}
                ></div>
                <div
                  className={`menu-bar ${
                    toggleDropdown
                      ? "dark:bg-white bg-[#1e90ff]"
                      : "bg-[#1e90ff]"
                  }`}
                ></div>
              </div> */}
            </div>

            <div className='dropdown z-40' ref={menuRef}>
              <div
                className={`item ${
                  session?.user ? 'animation-delay-1000' : 'animation-delay-700'
                } animation-duration-1000 h-6 md:h-8 mx-auto`}
              >
                <ThemeSwitcher />
              </div>
              {session?.user && (
                <>
                  {/* <p className='item animation-delay-200 text-sm font-inter font-medium text-gray-700 dark:text-gray-300'>
                    {t('hello')},{' '}
                  </p>
                  <div className='item animation-delay-200 -mt-2 text-sm font-inter font-medium text-gray-700 dark:text-gray-300'>
                    {session.user?.name?.split(' ')[0] || 'Возвещатель'}
                  </div> */}
                  <div className='item animation-delay-200 text-end text-sm font-inter font-medium text-gray-700 dark:text-gray-300'>
                    {t.rich('hello', {
                      p: chunks => <p className='mt-1'>{chunks}</p>,
                      name: session.user?.name?.split(' ')[0] || t('publisher'),
                    })}
                  </div>
                  <div className='item animation-delay-200' onClick={closeNavBar}>
                    <ProfilePopup data={session.user} roundedSize='lg' />
                  </div>
                </>
              )}
              {permissionClient('publisher', session?.user) && (
                <>
                  <hr className='item w-full animation-delay-300' />
                  <CustomLink
                    href='/stand'
                    className={`item animation-delay-400 dropdown_link ${activeStyle('/stand')}`}
                    onClick={closeNavBar}
                  >
                    {t('stands')}
                    <TbTrolley size={22} color='lightgreen' />
                  </CustomLink>
                </>
              )}
              {permissionClient('admin', session?.user) && (
                <>
                  <CustomLink
                    href='/territories'
                    prefetch={false}
                    className={`item animation-delay-500 dropdown_link ${activeStyle('/territories')}`}
                    onClick={closeNavBar}
                  >
                    {t('territories')}
                    <BsPinMap size={20} className='text-yellow-600' />
                  </CustomLink>
                  <CustomLink
                    href='/users'
                    prefetch={false}
                    className={`item animation-delay-600 dropdown_link ${activeStyle('/users')}`}
                    onClick={closeNavBar}
                  >
                    {t('users')}
                    <TbUsers size={20} className='text-red-400' />
                  </CustomLink>
                </>
              )}
              <hr className={`item w-full ${session?.user ? 'animation-delay-700' : 'animation-delay-300'}`} />
              <div className='flex justify-between items-center w-full mt-3 gap-2'>
                <div className={cc('item', session?.user ? 'animation-delay-800' : 'item animation-delay-400')}>
                  <LangToggleMain />
                </div>
                {session?.user ? (
                  <button
                    type='button'
                    onClick={() => {
                      closeNavBar()
                      signOut({
                        callbackUrl: '/auth',
                      })
                    }}
                    className='item animation-delay-800'
                  >
                    <VscSignOut size={20} className='text-gray-700 hover:text-orange-500 dark:text-gray-300' />
                  </button>
                ) : (
                  <CustomLink
                    href='/auth'
                    prefetch={false}
                    className='item animation-delay-400 text-sm font-inter font-medium text-gray-700 hover:text-gray-500 dark:text-gray-300 flex gap-1'
                    onClick={closeNavBar}
                  >
                    {t('enter')}
                    <FcKey size={20} color='lightsalmon' cursor='pointer' />
                  </CustomLink>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>
    </div>
  )
}

export default Nav

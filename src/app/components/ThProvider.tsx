'use client'

import { ThemeProvider } from 'next-themes'
import { /* useEffect, */ useLayoutEffect, type ReactNode } from 'react'

type Props = {
  children: ReactNode
}

export default function ThProvider({ children }: Props) {
  useLayoutEffect(() => {
    if (
      localStorage.theme === 'dark' ||
      (!('theme' in localStorage) &&
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-color-scheme: dark)').matches)
    ) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [])
  //typeof window !== 'undefined' && console.log(window.matchMedia('(prefers-color-scheme: dark)').matches)

  return (
    <ThemeProvider attribute='class' defaultTheme='system' enableSystem>
      {children}
    </ThemeProvider>
  )
}

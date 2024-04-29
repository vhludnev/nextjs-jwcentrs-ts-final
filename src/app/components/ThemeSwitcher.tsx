'use client'

import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'
import ThemeIcon from './ThemeIcon'
import Image from 'next/image'

const ThemeSwitcher = () => {
  const [mounted, setMounted] = useState(false)
  const { resolvedTheme, setTheme } = useTheme()

  useEffect(() => setMounted(true), [])

  if (!mounted)
    return (
      <Image
        src='data:image/svg+xml;base64,PHN2ZyBzdHJva2U9IiNGRkZGRkYiIGZpbGw9IiNGRkZGRkYiIHN0cm9rZS13aWR0aD0iMCIgdmlld0JveD0iMCAwIDI0IDI0IiBoZWlnaHQ9IjIwMHB4IiB3aWR0aD0iMjAwcHgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiB4PSIyIiB5PSIyIiBmaWxsPSJub25lIiBzdHJva2Utd2lkdGg9IjIiIHJ4PSIyIj48L3JlY3Q+PC9zdmc+Cg=='
        width={20}
        height={20}
        sizes='20x20'
        alt='Loading Light/Dark Toggle'
        priority={false}
        title='Loading Light/Dark Toggle'
      />
    )

  return (
    <>
      <ThemeIcon />
      <div
        id='sunmoon'
        className={resolvedTheme === 'light' ? 'sun' : ''}
        onClick={() => setTheme(resolvedTheme === 'light' ? 'dark' : 'light')}
      ></div>
    </>
  )
}

export default ThemeSwitcher

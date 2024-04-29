import Link from 'next/link'
//import Cookies from 'js-cookie'
import { /* i18n, */ pathnames } from '../../i18n.config'
//import { Link } from '../../navigation'

interface CustomLinkProps {
  href: keyof typeof pathnames
  children: React.ReactNode
  [key: string]: any
}

// CustomLink.getInitialProps = async (context) => {
//   return {
//     locale: await getLocale(context)
//   }
// }

export default function CustomLink({ href, ...props }: CustomLinkProps) {
  //const lang = Cookies.get('lang') || i18n.defaultLocale

  //const isDefaultLang = lang === i18n.defaultLocale
  //const path = isDefaultLang ? href : `/${lang}${href}`

  return <Link href={href} {...props} />
}

// import { ComponentProps } from 'react'
// import { AppPathnames /* , i18n, pathnames */ } from '../../i18n.config'
// import { Link } from '../../navigation'

// // interface CustomLinkProps {
// //   href: keyof typeof pathnames
// //   lang: string
// //   children: React.ReactNode
// //   [key: string]: any
// // }

// export default function CustomLink<Pathname extends AppPathnames>({
//   href,
//   ...props
// }: ComponentProps<typeof Link<Pathname>>) {
//   // const isDefaultLang = lang === i18n.defaultLocale
//   // const path = isDefaultLang ? href : (`/${lang}${href}` as keyof typeof pathnames)
//   // return <Link href={path} {...props} />
//   return <Link href={href} {...props} />
// }

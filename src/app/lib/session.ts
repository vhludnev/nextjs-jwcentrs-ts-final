import { getServerSession, NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import User from '../models/user'
import connectDb from './connectDb'
import { verifyPassword } from './auth'
import { BLACKLIST_EMAILS } from '../constants'
import { TUser } from '../types/user'

export const authOptions = {
  session: {
    strategy: 'jwt',
    maxAge: 7 * 24 * 60 * 60, // t.i. 7 days
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials) {
          throw new Error('no-credentials')
        }
        const { email, password } = credentials

        if (BLACKLIST_EMAILS.includes(email.toLowerCase())) {
          throw new Error('email-already-registered')
        }

        await connectDb()
        const user: TUser | null = await User.findOne({
          email: {
            $regex: new RegExp('^' + email.toLowerCase(), 'i'),
          },
        })

        if (user?.provider === 'google') {
          throw new Error('login-with-google')
        }

        if (!user) {
          throw new Error('wrong-data')
        } else {
          const isValid = await verifyPassword(password, user.password)

          if (!isValid) {
            throw new Error('wrong-data')
          }

          return { email: user.email, id: user.id }
        }
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/auth',
  },
  theme: {
    // colorScheme: 'light',
    logo: '/icons/logo50.png',
  },

  debug: process.env.NODE_ENV === 'development',

  callbacks: {
    async signIn({ account, profile }) {
      const { provider } = account as {
        provider: string
      }
      if (provider === 'google') {
        const { name, picture, email } = profile as {
          name: string
          picture: string
          email: string
        }

        if (BLACKLIST_EMAILS.includes(email.toLowerCase())) {
          throw new Error('google-already-registered')
        }

        await connectDb()
        const userExists = await User.findOne({ email })

        // if not, create a new document and save user in MongoDB
        if (!userExists) {
          try {
            const username = email.split('@')[0].toLowerCase()

            const newUser = new User({
              email,
              name,
              username:
                username.length > 6 ? username : `${username}${Math.floor(Math.random() * (10000 - 1000) + 1000)}`,
              image: picture,
              provider: account?.provider,
            })
            await newUser.save()
          } catch (error) {
            error instanceof Error && console.log('Ошибка: ', error.message)
          }
        } else {
          if (userExists.provider === 'credentials') throw new Error('login-with-email')
          return userExists
        }
      }

      return true
    },
    //// @ts-expect-error
    // async error(error) {
    //   // Redirect to the custom error page with error message
    //   throw new Error(
    //     `/auth/error?error=${encodeURIComponent(
    //       error instanceof Error && error.message
    //     )}`
    //   );
    // },

    async session({ session, token }) {
      if (token && session.user) {
        session.user.name = token.name
        session.user.email = token.email
        session.user.image = token.picture
        session.user.id = token.id
        session.user.status = token.status
        session.user.provider = token.provider
        session.user.verified = token.verified
      }

      return session
    },

    // async redirect({ url, baseUrl }) {
    //   console.log(url, baseUrl)

    //   // Allows relative callback URLs
    //   if (url.startsWith('/')) return `${baseUrl}${url}`
    //   // Allows callback URLs on the same origin
    //   else if (new URL(url).origin === baseUrl) return url
    //   return baseUrl
    // },

    async jwt({ token, user, trigger, session }) {
      if (trigger === 'update') {
        return { ...token, ...session.user }
      }

      await connectDb()

      const dbUser = await User.findOne({ email: token.email })

      if (!dbUser) {
        token.id = user.id
        return token
      }

      return {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        picture: dbUser.image,
        status: dbUser.status,
        provider: dbUser.provider || 'credentials',
        verified: dbUser.verified,
      }
    },
  },
} satisfies NextAuthOptions

export const getCurrentUser = async () => {
  const session = await getServerSession(authOptions)

  return session
}

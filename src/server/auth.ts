import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { type GetServerSidePropsContext } from 'next';
import { getServerSession, type DefaultSession, type NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import DiscordProvider from 'next-auth/providers/discord';
import GithubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';
import { env } from '~/env.mjs';
import { verifyPassword } from '~/helpers/bcrypt';
import { isEmail } from '~/helpers/validation/isEmail';
import { prisma } from '~/server/db';

/**
 * Module augmentation for `next-auth` types. Allows to add custom properties to the `session` object
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module 'next-auth' {
  interface Session extends DefaultSession {
    user: {
      id: string;
      // password?: string;
      // role: UserRole;
    } & DefaultSession['user'];
  }
  // interface User {
  //   // role: UserRole;
  // }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  callbacks: {
    // eslint-disable-next-line @typescript-eslint/require-await
    async jwt({ token, account }) {
      if (account) {
        token.id = account.id;
      }
      return token;
    },
    session: ({ session, user, token }) => ({
      ...session,
      user: {
        ...session.user,
        id: user?.id || token?.sub,
      },
    }),
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      // type: 'credentials',
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      authorize: async (credentials) => {
        const email = credentials?.email ?? '';
        const password = credentials?.password ?? '';

        try {
          if (!isEmail(email)) {
            throw new Error('NotValidEmail'); //Email is not a valid email address
          }
          const user = await prisma.user.findUnique({
            where: { email: email },
            include: { accounts: true },
          });

          if (!user) {
            throw new Error('NotFound'); //User account does not exist
          }
          if (!user.password) {
            const accounts = user.accounts.map((a) => a.provider).join(', ');
            throw new Error(`WrongProvider: ${accounts}`);
            // throw new Error(`Try to sign in with different provider: ${accounts}`);
          }

          const isMatch = await verifyPassword(password, user.password);
          if (!isMatch) {
            throw new Error('WrongPassword'); //Password is wrong
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image,
          };
        } catch (error) {
          console.error((error as Error).message);
          // if (  error instanceof PrismaClientInitializationError ||  error instanceof PrismaClientKnownRequestError ) {
          //   throw new Error('Database error');
          // }
          throw error;
        }
      },
    }),
    DiscordProvider({
      clientId: env.DISCORD_CLIENT_ID,
      clientSecret: env.DISCORD_CLIENT_SECRET,
    }),
    GithubProvider({
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
    }),
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      // allowDangerousEmailAccountLinking: true,
    }),
    /* ^ providers here  */
  ],
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/auth/signin',
    newUser: '/auth/signup',
    // error: '/auth/error',
  },
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext['req'];
  res: GetServerSidePropsContext['res'];
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions);
};

import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import bcrypt from 'bcryptjs';

// In-memory user store (replace with database in production)
const users = [];

export const authOptions = {
  providers: [
    // Only include Google provider if credentials are configured
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          }),
        ]
      : []),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        isSignUp: { label: "Is Sign Up", type: "text" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password required');
        }

        // Sign up
        if (credentials.isSignUp === 'true') {
          // Check if user exists
          const existingUser = users.find(u => u.email === credentials.email);
          if (existingUser) {
            throw new Error('User already exists');
          }

          // Hash password
          const hashedPassword = await bcrypt.hash(credentials.password, 10);
          
          // Create new user
          const newUser = {
            id: Date.now().toString(),
            email: credentials.email,
            password: hashedPassword,
            name: credentials.email.split('@')[0],
          };
          
          users.push(newUser);
          
          return {
            id: newUser.id,
            email: newUser.email,
            name: newUser.name,
          };
        }

        // Sign in
        const user = users.find(u => u.email === credentials.email);
        if (!user) {
          throw new Error('Invalid credentials');
        }

        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) {
          throw new Error('Invalid credentials');
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
        };
      },
    }),
  ],
  pages: {
    signIn: '/',
    error: '/',
  },
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      // Handle Google OAuth sign-in
      if (account?.provider === 'google') {
        // Check if user exists in our store
        let existingUser = users.find(u => u.email === user.email);
        
        if (!existingUser) {
          // Create new user from Google profile
          const newUser = {
            id: user.id || Date.now().toString(),
            email: user.email,
            name: user.name || user.email.split('@')[0],
            googleId: user.id,
          };
          users.push(newUser);
        }
      }
      return true;
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.email = token.email;
        session.user.name = token.name;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

import jwt from "jsonwebtoken";
import { NextAuthOptions } from "next-auth";

const JWT_SECRET = process.env.JWT_SECRET || "fallback_jwt_secret_sohoj_upai";

export const generateToken = (payload: object, expiresIn: string = "7d"): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: expiresIn as jwt.SignOptions["expiresIn"] });
};

export const verifyToken = <T = any>(token: string): T | null => {
  try {
    return jwt.verify(token, JWT_SECRET) as T;
  } catch (error) {
    return null;
  }
};

export const authOptions: NextAuthOptions = {
  providers: [],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/signin",
  },
  callbacks: {
    async session({ session, token }) {
      if (session.user) {
        (session.user as Record<string, unknown>).id = token.sub;
        (session.user as Record<string, unknown>).role = token.role;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as unknown as Record<string, unknown>).role;
      }
      return token;
    },
  },
};

import type { NextAuthConfig } from "next-auth";

import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import Facebook from "next-auth/providers/facebook";

import { MongoDBAdapter } from "@auth/mongodb-adapter";
import { isValidObjectId } from "mongoose";


import { connectDB } from "@/lib/db/connectDB";

import User, {
  UserRole,
  type IUser,
} from "@/lib/models/User";

import { LoginSchema } from "@/lib/validation";

import type { AppRole } from "./next.auth";
import clientPromise from "./mongo-adapter";

// ─── Roles ─────────────────────────────────────────────────

const APP_ROLES: readonly AppRole[] = [
  "user",
  "admin",
  "moderator",
];

function toAppRole(value: unknown): AppRole {
  return APP_ROLES.find((role) => role === value) ?? "user";
}

// ─── Types ─────────────────────────────────────────────────

type SocialProvider = "google" | "facebook";

type SessionUserFields = Pick<
  IUser,
  | "name"
  | "email"
  | "phone"
  | "profileImage"
  | "role"
  | "permissions"
>;

// ─── Phone Normalization ───────────────────────────────────

function normalizePhoneForLookup(
  value: string,
): string | null {
  const digits = value.trim().replace(/\D/g, "");

  if (digits.length === 11 && digits.startsWith("01")) {
    return digits;
  }

  if (digits.length === 13 && digits.startsWith("880")) {
    return digits.slice(2);
  }

  if (digits.length === 10 && digits.startsWith("1")) {
    return "0" + digits;
  }

  return null;
}

// ─── Save OAuth User in Mongoose ──────────────────────────

async function saveSocialUser({
  provider,
  providerAccountId,
  email,
  name,
  image,
}: {
  provider: SocialProvider;
  providerAccountId: string;
  email: string;
  name?: string | null;
  image?: string | null;
}) {
  await connectDB();

  const normalizedEmail = email.trim().toLowerCase();

  const socialField =
    provider === "google" ? "googleId" : "facebookId";

  const normalizedName =
    name?.trim().slice(0, 50) || "User";

  console.log("[AUTH] Saving social user:", {
    provider,
    email: normalizedEmail,
    database: User.db.name,
    collection: User.collection.name,
  });

  // Check email ownership.
  const existingEmailUser = await User.findOne({
    email: normalizedEmail,
  });

  // Check social account ownership.
  const existingSocialUser = await User.findOne({
    [socialField]: providerAccountId,
  });

  // Never overwrite a different social identity.
  if (
    existingEmailUser?.get(socialField) &&
    existingEmailUser.get(socialField) !== providerAccountId
  ) {
    throw new Error(
      "This email is linked to another social account.",
    );
  }

  if (
    existingSocialUser &&
    existingSocialUser.email !== normalizedEmail
  ) {
    throw new Error(
      "This social account belongs to another email.",
    );
  }

  const filter = {
    $or: [
      { email: normalizedEmail },
      { [socialField]: providerAccountId },
    ],
  };

  const update = {
    $set: {
      name: normalizedName,
      email: normalizedEmail,
      [socialField]: providerAccountId,
      isEmailVerified: true,
      isActive: true,
      lastLogin: new Date(),
      ...(image ? { profileImage: image } : {}),
    },

    $setOnInsert: {
      role: UserRole.USER,
      isPhoneVerified: false,
    },
  };

  const savedUser = await User.findOneAndUpdate(
    filter,
    update,
    {
      upsert: true,
      new: true,
      runValidators: true,
      setDefaultsOnInsert: true,
    },
  );

  if (!savedUser) {
    throw new Error("MongoDB user save failed.");
  }

  console.log("[AUTH] USER SAVED SUCCESSFULLY:", {
    id: savedUser._id.toString(),
    email: savedUser.email,
    role: savedUser.role,
    collection: User.collection.name,
  });

  return savedUser;
}

// ─── Auth Configuration ───────────────────────────────────

export const authConfig: NextAuthConfig = {
  // MongoDB Adapter
  adapter: MongoDBAdapter(clientPromise, {
    collections: {
      Users: "auth_users",
      Accounts: "auth_accounts",
      Sessions: "auth_sessions",
      VerificationTokens: "auth_verification_tokens",
    },
  }),

  providers: [
    // ─── Credentials Login ────────────────────────────────

    Credentials({
      id: "credentials",

      credentials: {
        emailOrPhone: {
          label: "ইমেইল বা ফোন নম্বর",
          type: "text",
          placeholder: "example@email.com বা 01XXXXXXXXX",
        },

        password: {
          label: "পাসওয়ার্ড",
          type: "password",
        },
      },

      async authorize(credentials) {
        try {
          if (
            !credentials?.emailOrPhone ||
            !credentials?.password
          ) {
            throw new Error(
              "ইমেইল/ফোন এবং পাসওয়ার্ড প্রয়োজন",
            );
          }

          const validated = LoginSchema.parse({
            emailOrPhone: String(
              credentials.emailOrPhone,
            ).trim(),

            password: String(credentials.password),
          });

          await connectDB();

          const emailOrPhone =
            validated.emailOrPhone.trim();

          const normalizedPhone =
            normalizePhoneForLookup(emailOrPhone);

          const query = normalizedPhone
            ? {
                $or: [
                  { email: emailOrPhone.toLowerCase() },
                  { phone: normalizedPhone },
                  { phone: "+88" + normalizedPhone },
                ],
              }
            : {
                email: emailOrPhone.toLowerCase(),
              };

          const dbUser = await User.findOne(query)
            .select("+password");

          if (!dbUser) {
            throw new Error(
              "ব্যবহারকারী খুঁজে পাওয়া যায়নি",
            );
          }

          if (!dbUser.isActive) {
            throw new Error(
              "আপনার অ্যাকাউন্ট নিষ্ক্রিয়। সহায়তার জন্য যোগাযোগ করুন।",
            );
          }

          if (!dbUser.password) {
            throw new Error(
              "আপনার অ্যাকাউন্ট সামাজিক লগইন ব্যবহার করে তৈরি করা হয়েছে।",
            );
          }

          const passwordMatch =
            await dbUser.comparePassword(
              String(credentials.password),
            );

          if (!passwordMatch) {
            throw new Error("ভুল পাসওয়ার্ড");
          }

          dbUser.lastLogin = new Date();

          await dbUser.save();

          return {
            id: dbUser._id.toString(),
            name: dbUser.name,
            email: dbUser.email,
            role: toAppRole(dbUser.role),
            phone: dbUser.phone ?? undefined,
            image: dbUser.profileImage ?? undefined,
            permissions: Array.isArray(
              dbUser.permissions,
            )
              ? [...dbUser.permissions]
              : [],
          };
        } catch (error) {
          console.error(
            "[AUTH] Credentials error:",
            error,
          );

          if (error instanceof Error) {
            throw error;
          }

          throw new Error("লগইনে ত্রুটি হয়েছে");
        }
      },
    }),

    // ─── Google ──────────────────────────────────────────

    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),

    // ─── Facebook ────────────────────────────────────────

    Facebook({
      clientId: process.env.AUTH_FACEBOOK_ID!,
      clientSecret: process.env.AUTH_FACEBOOK_SECRET!,
    }),
  ],

  // ─── Callbacks ──────────────────────────────────────────

  callbacks: {
    // ─── OAuth Sign In ────────────────────────────────────

    async signIn({ user, account, profile }) {
      if (account?.type !== "oauth") {
        return true;
      }

      if (
        account.provider !== "google" &&
        account.provider !== "facebook"
      ) {
        return false;
      }

      try {
        const provider = account.provider;

        const email = user.email?.trim().toLowerCase();

        if (!email) {
          throw new Error("OAuth email is missing.");
        }

        if (
          provider === "google" &&
          profile?.email_verified !== true
        ) {
          throw new Error(
            "Google email is not verified.",
          );
        }

        // Do not claim Facebook email verification without
        // a verified email claim from the provider.
        if (
          provider === "facebook" &&
          profile?.verified !== true
        ) {
          throw new Error(
            "Facebook email verification could not be confirmed.",
          );
        }

        // Save directly to the application users collection.
        await saveSocialUser({
          provider,
          providerAccountId: account.providerAccountId,
          email,
          name: user.name,
          image: user.image,
        });

        return true;
      } catch (error) {
        console.error(
          "[AUTH] SOCIAL LOGIN FAILED:",
          error,
        );

        return false;
      }
    },

    // ─── JWT ──────────────────────────────────────────────

    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.email = user.email ?? undefined;
        token.role = toAppRole(user.role);
        token.phone = user.phone ?? null;

        token.permissions = Array.isArray(
          user.permissions,
        )
          ? [...user.permissions]
          : [];
      }

      // Fetch application user after OAuth login.
      if (
        account?.type === "oauth" &&
        user?.email
      ) {
        await connectDB();

        const dbUser = await User.findOne({
          email: user.email.toLowerCase(),
        });

        if (!dbUser) {
          throw new Error(
            "OAuth user was not found in application database.",
          );
        }

        token.id = dbUser._id.toString();
        token.email = dbUser.email;
        token.role = toAppRole(dbUser.role);
        token.phone = dbUser.phone ?? null;

        token.permissions = Array.isArray(
          dbUser.permissions,
        )
          ? [...dbUser.permissions]
          : [];
      }

      if (account) {
        token.provider = account.provider;
      }

      return token;
    },

    // ─── Session ──────────────────────────────────────────

    async session({ session, token }) {
      session.user.id = String(token.id ?? "");
      session.user.role = toAppRole(token.role);
      session.user.phone = token.phone ?? null;

      session.user.permissions = Array.isArray(
        token.permissions,
      )
        ? (token.permissions as string[])
        : [];

      if (
        token.id &&
        isValidObjectId(String(token.id))
      ) {
        try {
          await connectDB();

          const dbUser = await User.findById(token.id)
            .select(
              "name email phone profileImage role permissions",
            )
            .lean<SessionUserFields>();

          if (dbUser) {
            session.user.name =
              dbUser.name ?? session.user.name;

            session.user.email =
              dbUser.email ?? session.user.email;

            session.user.phone =
              dbUser.phone ?? null;

            session.user.image =
              dbUser.profileImage ??
              session.user.image;

            session.user.role = toAppRole(
              dbUser.role ?? token.role,
            );

            session.user.permissions =
              dbUser.permissions ?? [];
          }
        } catch (error) {
          console.error(
            "[AUTH] Session error:",
            error,
          );
        }
      }

      return session;
    },
  },

  // ─── Pages ──────────────────────────────────────────────

  pages: {
    signIn: "/login",
    error: "/login",
  },

  // ─── Events ─────────────────────────────────────────────

  events: {
    async signOut() {
      console.log("[AUTH] User signed out.");
    },
  },

  // ─── Session ────────────────────────────────────────────

  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60,
    updateAge: 24 * 60 * 60,
  },

  jwt: {
    maxAge: 7 * 24 * 60 * 60,
  },

  trustHost: true,

  debug: process.env.NODE_ENV === "development",
};
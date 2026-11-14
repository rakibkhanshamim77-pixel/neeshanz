import type { DefaultSession } from "next-auth";

export type AppRole = "user" | "admin" | "moderator";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: AppRole;
      phone: string | null;
      permissions: string[];
    } & DefaultSession["user"];
  }

  // id, name, email, image already exist on the base User type
  interface User {
    id:string;
    role?: AppRole;
    phone?: string | null;
    permissions?: string[];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: AppRole;
    phone?: string | null;
    permissions?: string[];
    provider?: string;
  }
}
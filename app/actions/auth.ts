
"use server";

import { connectDB } from "@/lib/db/connectDB";
import User, { UserRole } from "@/lib/models/User";
import type { IUser } from "@/lib/models/User";

export interface SocialLoginResult {
  success: boolean;
  message?: string;
  user?: {
    id: string;
    email?: string;
    name?: string;
    role: string;
    phone?: string;
  };
}

function sanitizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function sanitizeName(name: string): string {
  return name.trim().slice(0, 50) || "User";
}

export async function socialLoginOrRegister(
  provider: "google" | "facebook",
  profile: {
    id: string;
    name: string;
    email: string;
    image?: string | null;
  },
): Promise<SocialLoginResult> {
  try {
    await connectDB();

    const socialId = profile.id?.trim();
    const email = sanitizeEmail(profile.email || "");
    const name = sanitizeName(profile.name || "");
    const image = profile.image?.trim() || undefined;

    if (!socialId || !email) {
      return {
        success: false,
        message: "ইমেইল অথবা Social ID পাওয়া যায়নি।",
      };
    }

    const socialField =
      provider === "google" ? "googleId" : "facebookId";

    const update: Partial<IUser> = {
      name,
      email,
      isEmailVerified: true,
      isActive: true,
      lastLogin: new Date(),
      [socialField]: socialId,
    };

    // Only replace profile image when a new one is available.
    if (image) {
      update.profileImage = image;
    }

    console.log("[SOCIAL AUTH] Starting:", {
      provider,
      email,
      socialId,
    });

    const user = await User.findOneAndUpdate(
      {
        $or: [
          { [socialField]: socialId },
          { email },
        ],
      },
      {
        $set: update,
        $setOnInsert: {
          role: UserRole.USER,
          isPhoneVerified: false,
        },
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
        setDefaultsOnInsert: true,
      },
    );

    if (!user) {
      return {
        success: false,
        message: "MongoDB user তৈরি বা update করা যায়নি।",
      };
    }

    console.log("[SOCIAL AUTH] User saved:", {
      id: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    return {
      success: true,
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        role: user.role,
        phone: user.phone ?? undefined,
      },
    };
  } catch (error) {
    console.error("[SOCIAL AUTH] Error:", error);

    if (
      error instanceof Error &&
      (error.message.includes("E11000") ||
        error.message.includes("duplicate key"))
    ) {
      return {
        success: false,
        message: "এই Email অথবা Social Account ইতিমধ্যে অন্য account-এর সাথে যুক্ত।",
      };
    }

    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Social login failed.",
    };
  }
}
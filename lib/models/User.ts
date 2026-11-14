import mongoose, {
  Document,
  Model,
  Schema,
  Types,
} from "mongoose";
import bcryptjs from "bcryptjs";

// ─── User Roles ─────────────────────────────────────────────

export enum UserRole {
  USER = "user",
  ADMIN = "admin",
  MODERATOR = "moderator",
}

// ─── Address ────────────────────────────────────────────────

export interface IAddress {
  _id?: Types.ObjectId;
  label: string;
  name: string;
  phone: string;
  address: string;
  district: string;
  city: string;
  isDefault: boolean;
}

// ─── User Interface ─────────────────────────────────────────

export interface IUser {
  name: string;
  email: string;
  phone?: string;
  password?: string;
  role: UserRole;
  permissions?: string[];
  profileImage?: string;
  bio?: string;

  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  isActive: boolean;

  addresses?: IAddress[];

  googleId?: string;
  facebookId?: string;

  emailVerificationToken?: string;
  emailVerificationExpires?: Date;
  passwordResetToken?: string;
  passwordResetExpires?: Date;

  createdAt: Date;
  updatedAt: Date;
  lastLogin?: Date;
}

export interface IUserDocument extends IUser, Document {
  comparePassword(password: string): Promise<boolean>;
  hashPassword(): Promise<void>;
}

export interface IUserModel extends Model<IUserDocument> {
  findByEmail(email: string): Promise<IUserDocument | null>;

  findByPhoneAndEmail(
    phone: string,
    email: string,
  ): Promise<IUserDocument | null>;

  findBySocialId(
    provider: "google" | "facebook",
    id: string,
  ): Promise<IUserDocument | null>;
}

// ─── Schema ─────────────────────────────────────────────────

const UserSchema = new Schema<IUserDocument, IUserModel>(
  {
    name: {
      type: String,
      required: [true, "নাম প্রয়োজন"],
      trim: true,
      minlength: 2,
      maxlength: 50,
    },

    email: {
      type: String,
      required: [true, "ইমেইল প্রয়োজন"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "অনুগ্রহ করে একটি বৈধ ইমেইল ঠিকানা প্রদান করুন",
      ],
    },

    phone: {
      type: String,
      unique: true,
      sparse: true,
      match: [
        /^(\+88)?01[0-9]{9}$/,
        "বৈধ বাংলাদেশি ফোন নম্বর প্রদান করুন",
      ],
    },

    password: {
      type: String,
      select: false,
      minlength: 8,
    },

    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.USER,
    },

    permissions: {
      type: [String],
      default: [],
    },

    profileImage: {
      type: String,
      default: undefined,
    },

    bio: {
      type: String,
      maxlength: 500,
    },

    isEmailVerified: {
      type: Boolean,
      default: false,
    },

    isPhoneVerified: {
      type: Boolean,
      default: false,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    googleId: {
      type: String,
      unique: true,
      sparse: true,
    },

    facebookId: {
      type: String,
      unique: true,
      sparse: true,
    },

    emailVerificationToken: {
      type: String,
      select: false,
    },

    emailVerificationExpires: {
      type: Date,
      select: false,
    },

    passwordResetToken: {
      type: String,
      select: false,
    },

    passwordResetExpires: {
      type: Date,
      select: false,
    },

    lastLogin: {
      type: Date,
      default: null,
    },

    addresses: {
      type: [
        {
          label: {
            type: String,
            required: true,
            trim: true,
            maxlength: 50,
          },
          name: {
            type: String,
            required: true,
            trim: true,
            maxlength: 50,
          },
          phone: {
            type: String,
            required: true,
            trim: true,
            match: /^(\+88)?01[0-9]{9}$/,
          },
          address: {
            type: String,
            required: true,
            trim: true,
            maxlength: 500,
          },
          district: {
            type: String,
            default: "",
            maxlength: 80,
          },
          city: {
            type: String,
            default: "",
            maxlength: 80,
          },
          isDefault: {
            type: Boolean,
            default: false,
          },
        },
      ],
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

// ─── Indexes ─────────────────────────────────────────────────

// unique fields already create their own indexes.
// Do not declare duplicate indexes for those fields.

UserSchema.index({ createdAt: -1 });

// ─── Password Methods ─────────────────────────────────────────

UserSchema.methods.comparePassword = async function (
  password: string,
): Promise<boolean> {
  if (!this.password) return false;

  return bcryptjs.compare(password, this.password);
};

UserSchema.methods.hashPassword = async function (): Promise<void> {
  if (!this.password) return;

  this.password = await bcryptjs.hash(this.password, 12);
};

// ─── Static Methods ───────────────────────────────────────────

UserSchema.statics.findByEmail = function (
  email: string,
) {
  return this.findOne({
    email: email.trim().toLowerCase(),
  });
};

UserSchema.statics.findByPhoneAndEmail = function (
  phone: string,
  email: string,
) {
  return this.findOne({
    $or: [
      { email: email.trim().toLowerCase() },
      { phone },
    ],
  });
};

UserSchema.statics.findBySocialId = function (
  provider: "google" | "facebook",
  id: string,
) {
  const field =
    provider === "google" ? "googleId" : "facebookId";

  return this.findOne({
    [field]: id,
  });
};

// ─── Model Export ─────────────────────────────────────────────

const User =
  (mongoose.models.User as IUserModel) ||
  mongoose.model<IUserDocument, IUserModel>(
    "User",
    UserSchema,
  );

export default User;
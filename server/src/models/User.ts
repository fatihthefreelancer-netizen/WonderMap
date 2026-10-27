import { Schema, model, type InferSchemaType, type HydratedDocument, type Model } from 'mongoose';
import bcrypt from 'bcryptjs';

interface UserMethods {
  comparePassword(candidate: string): Promise<boolean>;
}

const lessonProgressSchema = new Schema(
  {
    lesson: { type: Schema.Types.ObjectId, ref: 'Lesson', required: true },
    completed: { type: Boolean, default: false },
    stars: { type: Number, default: 0, min: 0, max: 3 },
    bestScore: { type: Number, default: 0, min: 0, max: 100 },
    completedAt: { type: Date },
  },
  { _id: false },
);

const progressSchema = new Schema(
  {
    xp: { type: Number, default: 0 },
    coins: { type: Number, default: 50 },
    streak: { type: Number, default: 0 },
    lives: { type: Number, default: 5, min: 0, max: 5 },
    energy: { type: Number, default: 100, min: 0, max: 100 },
    worldUnlocked: [{ type: Schema.Types.ObjectId, ref: 'World' }],
    lessonUnlocked: [{ type: Schema.Types.ObjectId, ref: 'Lesson' }],
    lessonProgress: [lessonProgressSchema],
    achievements: [{ type: Schema.Types.ObjectId, ref: 'Achievement' }],
    currentWorld: { type: Schema.Types.ObjectId, ref: 'World' },
    currentLesson: { type: Schema.Types.ObjectId, ref: 'Lesson' },
    dailyGoal: { type: Number, default: 50 },
    weeklyGoal: { type: Number, default: 300 },
    // --- Milo-story systems ---
    tier: { type: String, enum: ['junior', 'pro'], default: 'junior' },
    notebook: [{ type: String }],
    badges: [{ type: String }],
    mirror: [
      new Schema({ key: String, value: String }, { _id: false }),
    ],
    encounters: [{ type: String }],
  },
  { _id: false },
);

const userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    password: { type: String, required: true, select: false },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    avatar: { type: String, default: 'fox' },
    inventory: [{ type: String }],
    progress: { type: progressSchema, default: () => ({}) },
  },
  { timestamps: true },
);

userSchema.pre('save', async function hashPassword(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = function comparePassword(candidate: string) {
  return bcrypt.compare(candidate, this.password);
};

export type UserSchemaType = InferSchemaType<typeof userSchema>;
type UserModel = Model<UserSchemaType, Record<string, never>, UserMethods>;
export type UserDocument = HydratedDocument<UserSchemaType, UserMethods>;

export const User = model<UserSchemaType, UserModel>('User', userSchema);

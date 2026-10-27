import { Schema, model, type InferSchemaType } from 'mongoose';

const achievementSchema = new Schema(
  {
    key: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true },
    description: { type: String, default: '' },
    icon: { type: String, default: '🏆' },
    xpReward: { type: Number, default: 0 },
    coinReward: { type: Number, default: 0 },
    /** simple rule engine: e.g. { type: 'lessons_completed', value: 5 } */
    rule: {
      type: new Schema(
        { type: { type: String, required: true }, value: { type: Number, default: 0 } },
        { _id: false },
      ),
      required: true,
    },
  },
  { timestamps: true },
);

export type AchievementSchemaType = InferSchemaType<typeof achievementSchema>;

export const Achievement = model('Achievement', achievementSchema);

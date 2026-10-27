import { Schema, model, type InferSchemaType } from 'mongoose';
import { LESSON_TYPES } from '@wondermap/shared';

const lessonSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    world: { type: Schema.Types.ObjectId, ref: 'World', required: true, index: true },
    order: { type: Number, required: true },
    x: { type: Number, required: true },
    y: { type: Number, required: true },
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard', 'expert'],
      default: 'easy',
    },
    type: { type: String, enum: LESSON_TYPES, default: 'lesson' },
    xp: { type: Number, default: 20 },
    coins: { type: Number, default: 10 },
    estimatedMinutes: { type: Number, default: 5 },
    prerequisites: [{ type: Schema.Types.ObjectId, ref: 'Lesson' }],
    // --- Milo-story fields ---
    storyId: { type: String },
    minigame: { type: String },
    comingSoon: { type: Boolean, default: false },
    notebookTerm: { type: String },
    badge: { type: String },
  },
  { timestamps: true },
);

lessonSchema.index({ world: 1, order: 1 });

export type LessonSchemaType = InferSchemaType<typeof lessonSchema>;

export const Lesson = model('Lesson', lessonSchema);

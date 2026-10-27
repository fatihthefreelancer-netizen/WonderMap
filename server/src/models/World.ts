import { Schema, model, type InferSchemaType } from 'mongoose';
import { WORLD_THEMES, type DecorationKind } from '@wondermap/shared';

const decorationSchema = new Schema(
  {
    kind: { type: String, required: true },
    x: { type: Number, required: true },
    y: { type: Number, required: true },
    scale: { type: Number, default: 1 },
    flip: { type: Boolean, default: false },
  },
  { _id: true },
);

const vec2Schema = new Schema(
  { x: { type: Number, required: true }, y: { type: Number, required: true } },
  { _id: false },
);

const pathSchema = new Schema(
  {
    from: { type: vec2Schema, required: true },
    to: { type: vec2Schema, required: true },
    control: { type: vec2Schema },
  },
  { _id: true },
);

const worldSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    subtitle: { type: String, default: '' },
    order: { type: Number, required: true, index: true },
    theme: { type: String, enum: WORLD_THEMES, required: true },
    background: { type: String, default: '' },
    music: { type: String, default: '' },
    requiredXP: { type: Number, default: 0 },
    decorations: { type: [decorationSchema], default: [] },
    paths: { type: [pathSchema], default: [] },
  },
  { timestamps: true },
);

export type WorldSchemaType = InferSchemaType<typeof worldSchema> & {
  decorations: Array<{ kind: DecorationKind; x: number; y: number; scale?: number; flip?: boolean }>;
};

export const World = model('World', worldSchema);

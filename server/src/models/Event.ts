import { Schema, model, type Types } from 'mongoose';

/**
 * A learning event, as reported by the client.
 *
 * Deliberately schemaless in `props` — the point is to be able to add a new
 * measurement to a chapter without a migration. The index is on (name, at) so
 * the obvious question ("where do children stop?") is a single scan.
 */
export interface EventDocument {
  user?: Types.ObjectId;
  name: string;
  at: Date;
  props?: Record<string, unknown>;
}

const eventSchema = new Schema<EventDocument>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', index: true },
    name: { type: String, required: true },
    at: { type: Date, required: true },
    props: { type: Schema.Types.Mixed },
  },
  { versionKey: false },
);

eventSchema.index({ name: 1, at: -1 });

export const Event = model<EventDocument>('Event', eventSchema);

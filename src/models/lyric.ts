import mongoose, { type HydratedDocument, type Model, type Types } from "mongoose";

export interface LyricDocument {
  song?: Types.ObjectId;
  likes: number;
  content?: string;
}

export interface LyricModel extends Model<LyricDocument> {
  like(id: string): Promise<HydratedDocument<LyricDocument>>;
}

const LyricSchema = new mongoose.Schema<LyricDocument, LyricModel>({
  song: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "song",
  },
  likes: { type: Number, default: 0 },
  content: { type: String },
});

LyricSchema.statics.like = async function (id: string) {
  const lyric = await this.findById(id);

  if (!lyric) {
    throw new Error(`Lyric ${id} was not found`);
  }

  lyric.likes += 1;
  return lyric.save();
};

export const Lyric = mongoose.model<LyricDocument, LyricModel>(
  "lyric",
  LyricSchema,
);

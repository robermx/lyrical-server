import mongoose, { type HydratedDocument, type Model, type Types } from "mongoose";
import { Lyric, type LyricDocument } from "./lyric.ts";

export interface SongDocument {
  title?: string;
  user?: Types.ObjectId;
  lyrics: Types.ObjectId[];
}

export interface SongModel extends Model<SongDocument> {
  addLyric(
    id: string,
    content: string,
  ): Promise<HydratedDocument<SongDocument>>;
  findLyrics(id: string): Promise<Array<HydratedDocument<LyricDocument>>>;
}

const SongSchema = new mongoose.Schema<SongDocument, SongModel>({
  title: { type: String },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  lyrics: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "lyric",
    },
  ],
});

SongSchema.statics.addLyric = async function (id: string, content: string) {
  const song = await this.findById(id);

  if (!song) {
    throw new Error(`Song ${id} was not found`);
  }

  const lyric = new Lyric({ content, song: song._id });
  song.lyrics.push(lyric._id);

  await Promise.all([lyric.save(), song.save()]);
  return song;
};

SongSchema.statics.findLyrics = async function (id: string) {
  const song = await this.findById(id).populate<{
    lyrics: Array<HydratedDocument<LyricDocument>>;
  }>("lyrics");

  if (!song) {
    throw new Error(`Song ${id} was not found`);
  }

  return song.lyrics;
};

export const Song = mongoose.model<SongDocument, SongModel>(
  "song",
  SongSchema,
);

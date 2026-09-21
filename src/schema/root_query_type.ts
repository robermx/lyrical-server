import * as graphql from "graphql";
import { SongType } from "./song_type.ts";
import LyricType from "./lyric_type.ts";
import { Lyric, Song } from "../models/index.ts";

const { GraphQLObjectType, GraphQLList, GraphQLID, GraphQLNonNull } = graphql;

export const RootQueryType = new GraphQLObjectType({
  name: "RootQueryType",
  fields: () => ({
    songs: {
      type: new GraphQLList(SongType),
      resolve() {
        return Song.find({});
      },
    },
    song: {
      type: SongType,
      args: { id: { type: new GraphQLNonNull(GraphQLID) } },
      resolve(parentValue, { id }) {
        return Song.findById(id);
      },
    },
    lyric: {
      type: LyricType,
      args: { id: { type: new GraphQLNonNull(GraphQLID) } },
      resolve(parnetValue, { id }) {
        return Lyric.findById(id);
      },
    },
  }),
});

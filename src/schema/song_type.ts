import * as graphql from "graphql";
import LyricType from "./lyric_type.ts";
import { Song } from "../models/index.ts";

const { GraphQLObjectType, GraphQLString, GraphQLID, GraphQLList } = graphql;

export const SongType: graphql.GraphQLObjectType = new GraphQLObjectType({
  name:  'SongType',
  fields: () => ({
    id: { type: GraphQLID },
    title: { type: GraphQLString },
    lyrics: {
      type: new GraphQLList(LyricType),
      resolve(parentValue) {
        return Song.findLyrics(parentValue.id);
      }
    }
  })
});

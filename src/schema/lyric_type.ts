import * as graphql from "graphql";
import { SongType } from "./song_type.ts";
import { Song } from "../models/index.ts";

const {
  GraphQLObjectType,
  GraphQLList,
  GraphQLID,
  GraphQLInt,
  GraphQLString
} = graphql;

const LyricType: graphql.GraphQLObjectType = new GraphQLObjectType({
  name:  'LyricType',
  fields: () => ({
    id: { type: GraphQLID },
    likes: { type: GraphQLInt },
    content: { type: GraphQLString },
    song: {
      type: SongType,
      resolve(parentValue) {
        return Song.findById(parentValue.song);
      }
    }
  })
});

export default LyricType;

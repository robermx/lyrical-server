import _ from "lodash";
import * as graphql from "graphql";
const { GraphQLSchema } = graphql;

import { RootQueryType } from "./root_query_type.ts";
import mutation from "./mutations.ts";


export const schema = new GraphQLSchema({
  query: RootQueryType,
  mutation,
});

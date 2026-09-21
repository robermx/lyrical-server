import express, { type Express } from "express";
import mongoose from "mongoose";
import { createYoga } from "graphql-yoga";
import bodyParser from "body-parser";
import { schema } from "./schema/schema.ts";

const app: Express = express();
const mongoDB = process.env.MONGODB_URI;

if (!mongoDB) {
  throw new Error("You must provide a Mongo Atlas URI");
}

mongoose.Promise = global.Promise;
mongoose.connect(mongoDB);
mongoose.connection
  .once("open", () => console.log("Connected to Mongo Atlas instance."))
  .on("error", (error) =>
    console.log("Error connecting to Mongo Atlas:", error),
  );

app.use(bodyParser.json());
const yoga = createYoga({
  schema,
  graphiql: true,
});

app.use('/graphql', yoga)

app.listen(3000);

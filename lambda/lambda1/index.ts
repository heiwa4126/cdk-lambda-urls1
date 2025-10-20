// Migrated from @vendia/serverless-express to @codegenie/serverless-express
import serverlessExpress from "@codegenie/serverless-express";
import app from "./app";

export const handler = serverlessExpress({ app });

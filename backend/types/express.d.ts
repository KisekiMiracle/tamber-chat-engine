import "express";
import { relations, type InferSelectModel } from "drizzle-orm";

declare module "express-serve-static-core" {
  interface Request {
    user?: InferSelectModel<typeof users>;
  }
}

import "express";

declare module "express-serve-static-core" {
  interface Request {
    user?: {
      id: string;
      user_id: string;
      displayname: string;
      status: string;
      status_emote: string;
      badges: string[];
      created_at: Date;
    };
  }
}

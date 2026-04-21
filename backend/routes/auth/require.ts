import jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";
import { SECRET_KEY } from "~/index";
import { Client, db } from "~/utils/db";
import { profiles, users } from "~/db/schema";
import { eq, getTableColumns } from "drizzle-orm";

export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { accessToken, refreshToken } = req.cookies;
  const profilesCols = getTableColumns(profiles);

  if (!accessToken) {
    if (!refreshToken) {
      return res.status(401).send({
        success: false,
        message: "Not authenticated.",
      });
    }

    try {
      const decoded = jwt.verify(refreshToken, SECRET_KEY) as { id: string };
      // NOTE: Create a new AccessToken if the Refresh Token has not expired.
      const access_token = jwt.sign({ id: decoded.id }, SECRET_KEY, {
        expiresIn: "15m",
      });

      res.cookie("accessToken", access_token, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        maxAge: 1000 * 60 * 15,
      });

      await db.transaction(async (tx) => {
        const [user] = await tx
          .select({ ...profilesCols })
          .from(profiles)
          .where(eq(profiles.userId, decoded.id));
        if (!user) {
          return res.status(401).send({
            success: false,
            message: "User no longer exists.",
          });
        }
        req.user = user;
      });
      return next();
    } catch {
      return res.status(401).send({
        success: false,
        message: "Invalid or expired refresh token.",
      });
    }
  }

  try {
    const decoded = jwt.verify(accessToken, SECRET_KEY) as { id: string };

    await db.transaction(async (tx) => {
      const [user] = await tx
        .select({ ...profilesCols })
        .from(profiles)
        .where(eq(profiles.userId, decoded.id));

      if (!user) {
        return res.status(401).send({
          success: false,
          message: "User no longer exists.",
        });
      }
      req.user = user;
    });
    return next();
  } catch (error) {
    return res.status(401).send({
      success: false,
      message: "Invalid or expired token.",
    });
  }
}

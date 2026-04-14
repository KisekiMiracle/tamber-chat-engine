import jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";
import { SECRET_KEY } from "~/index";
import { Client } from "~/utils/db";

export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { accessToken, refreshToken } = req.cookies;

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

      const user = (
        await Client.query(
          /* sql */ `
        SELECT * FROM profiles
        WHERE user_id=$1;
      `,
          [decoded.id],
        )
      ).rows[0];

      if (!user) {
        return res.status(401).send({
          success: false,
          message: "User no longer exists.",
        });
      }
      req.user = user;
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
    const user = (
      await Client.query(
        /* sql */ `
        SELECT * FROM profiles
        WHERE user_id=$1;
      `,
        [decoded.id],
      )
    ).rows[0];

    if (!user) {
      return res.status(401).send({
        success: false,
        message: "User no longer exists.",
      });
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).send({
      success: false,
      message: "Invalid or expired token.",
    });
  }
}

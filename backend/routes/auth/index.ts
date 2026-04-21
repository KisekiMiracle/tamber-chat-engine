import { app, SECRET_KEY } from "~/index";
import { Client, db } from "~/utils/db";
import bcrypt from "bcrypt";
import { DatabaseError } from "pg";
import jwt from "jsonwebtoken";
import { requireAuth } from "./require";
import { profiles, users } from "~/db/schema";
import { eq } from "drizzle-orm";
import { sendWelcomeEmail } from "~/utils/email/welcome";

export function AuthRouteSetup() {
  app.post("/api/auth/signup", async (req, res) => {
    const { name, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(
      password,
      await bcrypt.genSalt(10),
    );

    try {
      await db.transaction(async (tx) => {
        const [newUser] = await tx
          .insert(users)
          .values({
            name,
            email,
            password: hashedPassword,
          })
          .returning({ id: users.id });

        if (!newUser) throw new Error("User creation failed");

        await tx.insert(profiles).values({
          userId: newUser.id,
          displayname: name,
        });
      });

      sendWelcomeEmail(email, {
        name: name,
        loginUrl: "https://tamber.kiseki-miracle.dev",
      }).catch((err) => console.error("Mail delivery failed:", err));

      return res.status(201).send({
        success: true,
        message: "Account created successfully.",
      });
    } catch (error: any) {
      const errorCode = error?.code || error?.err?.code || error?.cause?.code;

      if (errorCode === "23505") {
        return res.status(409).send({
          success: false,
          message: "An account registered with that email already exists.",
        });
      }

      return res.status(500).send({
        success: false,
        message: "We had problems to create that user. Please, try again.",
      });
    }
  });
  app.post("/api/auth/signin", async (req, res) => {
    const { email, password } = req.body;

    try {
      await db.transaction(async (tx) => {
        const [user] = await tx
          .select({ id: users.id, password: users.password })
          .from(users)
          .where(eq(users.email, email));

        if (!user) {
          return res.status(400).send({
            success: false,
            message: "Incorrect Credentials.",
          });
        }

        const passwordsMatch = await bcrypt.compare(password, user.password);

        if (!passwordsMatch) {
          return res.status(400).send({
            success: false,
            message: "Incorrect Credentials.",
          });
        }

        const access_token = jwt.sign({ id: user.id }, SECRET_KEY, {
          expiresIn: "15m",
        });
        const refresh_token = jwt.sign({ id: user.id }, SECRET_KEY, {
          expiresIn: "1w",
        });

        res.cookie("accessToken", access_token, {
          httpOnly: true,
          sameSite: "lax",
          secure: process.env.NODE_ENV === "production",
          maxAge: 1000 * 60 * 15,
        });
        res.cookie("refreshToken", refresh_token, {
          httpOnly: true,
          sameSite: "lax",
          secure: process.env.NODE_ENV === "production",
          maxAge: 1000 * 60 * 60 * 24 * 7,
        });
      });
      return res.status(200).send({
        success: true,
      });
    } catch (error) {
      return res.status(500).send({
        success: false,
        message:
          "We had problems to authenticate that user. Please, try again.",
      });
    }
  });
  app.get("/api/auth/me", requireAuth, async (req, res) => {
    return res.status(200).send({
      success: true,
      user: req.user,
    });
  });
  app.get("/api/auth/signout", async (_req, res) => {
    res.clearCookie("accessToken", {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });
    res.clearCookie("refreshToken", {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });

    return res.status(200).send({
      success: true,
      message: "Signed out successfully.",
    });
  });
}

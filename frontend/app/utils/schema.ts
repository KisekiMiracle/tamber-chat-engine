import * as z from "zod";

const passwordSchema = z
  .string()
  .min(8, { message: "Password must be at least 8 characters long" })
  .max(20, { message: "Password can be at much 20 characters long." })
  .refine((password) => /[A-Z]/.test(password), {
    message: "Password must include at least one Uppercase character.",
  })
  .refine((password) => /[a-z]/.test(password), {
    message: "Password must include at least one Lowercase character.",
  })
  .refine((password) => /[0-9]/.test(password), {
    message: "Password must include at least one Number.",
  })
  .refine((password) => /[!@#$%^&*]/.test(password), {
    message: "Password must include at least one Special character.",
  });

export const baseAuthObject = z.object({
  name: z
    .string()
    .min(2, "Name too short")
    .regex(/^[a-zA-Z0-9]+$/, {
      message:
        "Name must be a single word and cannot contain spaces or special characters.",
    }),
  email: z.string().email("Invalid email"),
  password: passwordSchema,
  confirmPassword: z.string(),
});

export const AuthSchema = baseAuthObject.refine(
  (data) => data.password === data.confirmPassword,
  {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  },
);

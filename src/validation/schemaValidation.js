import { z } from "zod";

export const userRegisterSchema = z.object({
  username: z
    .string()
    .min(3, { message: "username must be at least three characters long!" })
    .max(30, { message: "username must be at most 30 characters long!" })
    .regex(/^[a-zA-Z0-9_]+$/, {
      message: "username can contain letters, numbers and underscores",
    }),
  fullname: z
    .string()
    .min(5, { message: "full name must be at least 5 characters long" }),
  email: z.string().email({ message: "Invalid email address." }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 8 characters long!" })
    .max(15, { message: "Password cannot exceed 15 characters" })
    .regex(/[a-z]/, {
      message: "Password must contain at least one lowercase letter",
    })
    .regex(/[0-9]/, { message: "Password must contain at least one number" }),
  phonenumber: z.string().optional(),
  age: z
    .number()
    .min(10, { message: "You must be at least 10 years old." })
    .max(40, { message: "Age limit is 40" }),
  role: z.string(),
  location: z.string(),
});

export const courseValidation = z.object({
  title: z.string().toLowerCase(),
  description: z
    .string()
    .min(7, { message: "Description must contain at least 7 characters long" }),
  agelimit: z
    .number()
    .min(10, { message: "Minimum age is 10" })
    .max(40, { message: "Maximimum age is 40" }),
  subject: z.string(),
  duration: z.string(),
});

export const reviewValidationSchema = z.object({
  comment: z
    .string()
    .min(4, { message: "review must contain at least 4 characters." }),
  reviewerId: z.string(),
  rate: z
    .number()
    .min(1, { message: "Rate should be at least 1." })
    .max(5, { message: "Rank must be at most 5." }),
});

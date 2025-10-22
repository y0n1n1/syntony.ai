import { z } from "zod"


export const SignupValidation = z.object({
    name: z.string().min(2, {message:'Too short'}),
    occupation: z.string(),
    organization: z.string(),
    country:z.string(),
    username: z.string().min(2, {message:'Too short'}),
    email:z.string().email(),
    password:z.string().min(8, {message:'Password must be at least 8 characters'})
});

export const SigninValidation = z.object({
    identifier: z.string().min(1, {message:"Please enter your username or email"}),
  password: z.string()});


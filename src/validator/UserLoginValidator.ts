import * as z from "zod";

export const UserLoginSchema = z.object({
    email:z.email("Invalid email address"),
    password:z.string().min(8, "Password must be at least 8 characters long")
})

export type UserLoginPayload = z.infer<typeof UserLoginSchema>;
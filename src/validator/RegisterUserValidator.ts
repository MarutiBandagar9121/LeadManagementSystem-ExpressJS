import * as z from "zod";
import UserTypeEnum from "../constants/UserTypeEnum";

export const RegisterUserSchema = z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().optional(),
    email: z.email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters long"),
    role: z.enum(Object.values(UserTypeEnum) as [string, ...string[]], {
      error: "Role is invalid",
    }).optional(),
});

export type RegisterUserPayload = z.infer<typeof RegisterUserSchema>;

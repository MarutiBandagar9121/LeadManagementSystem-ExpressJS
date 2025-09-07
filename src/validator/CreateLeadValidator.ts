import { z } from "zod";

export const createLeadSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().optional(),
  email: z.email("Invlaid email Id"),
  phone: z.string(),
  message: z.string().optional(),
  source: z.string().optional(),
  organizationName: z.string().optional(),
});

export type CreateLeadPayload = z.infer<typeof createLeadSchema>;

import * as z from "zod";
import LeadStatusEnum from "../constants/LeadStatusEnum";


export const UpdateLeadSchema = z.object({
    id: z.string().min(1, "ID cannot be empty"),
    status: z.enum(Object.values(LeadStatusEnum) as [string, ...string[]],{
      error: "Status is invalid",
    }),
});

export type UpdateLeadPayload = z.infer<typeof UpdateLeadSchema>;  
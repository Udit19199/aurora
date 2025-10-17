import * as z from "zod";

export const CreateGoalSchema = z.object({
    title: z.string().min(1),
    description: z.string().optional(),
    deadline: z.coerce.date().optional(),
});

export const UpdateGoalSchema = CreateGoalSchema.partial();

export const GetGoalsQuerySchema = z.object({
    limit: z.coerce.number().min(1).max(100).default(10),
    offset: z.coerce.number().min(0).default(0)
})








export type CreateGoal = z.infer<typeof CreateGoalSchema>;
export type UpdateGoal = z.infer<typeof UpdateGoalSchema>;

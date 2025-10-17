import * as z from "zod";

export const userSchema = z.object({
    email: z.email(),
    password: z.string().min(8, "Password must be 8 characters long"),
});

export type UserInput = z.infer<typeof userSchema>;

declare global {
    namespace Express {
        interface Request {
            userId?: string;
        }
    }
}

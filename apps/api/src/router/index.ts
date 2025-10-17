import { Router } from "express";
import authRouter from "./auth";
import goalRouter from "./goal";
import { authMiddleware } from "../middleware/auth";
const mainRouter = Router();

mainRouter.use("/auth", authRouter);
mainRouter.use("/goals", authMiddleware, goalRouter);

export default mainRouter;

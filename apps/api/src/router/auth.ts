import { Router } from "express";
import { userSchema, type UserInput } from "../types/user";
import { prisma } from "@aurora/database";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";

const authRouter: Router = Router();
const saltRounds = process.env.BYCRYPT_SALT_ROUNDS!;

authRouter.post("/signup", async (req, res) => {
    const inputBody: UserInput = req.body;
    const result = userSchema.safeParse(inputBody);

    if (!result.success) {
        return res.status(400).json({
            message: "Incorrect Inputs",
        });
    }

    let existingUser;
    try {
        existingUser = await prisma.user.findUnique({
            where: {
                email: result.data.email,
            },
        });
    } catch (e) {
        return res.status(500).json({
            message: "An internal server error occurred.",
        });
    }

    if (existingUser) {
        return res.status(409).json({
            message: "User with this email already exists",
        });
    }

    try {
        const hash = await bcrypt.hash(result.data.password, saltRounds);
        const User = await prisma.user.create({
            data: {
                email: result.data.email,
                password: hash,
            },
        });
        const userId = User.id
        const token = jwt.sign({ userId: userId }, process.env.JWT_SECRET!);
        res.status(201).json({
            message: "User created sucessfully",
            token: token,
        });
    } catch (e) {
        res.status(500).json({
            message: "An internal server error occurred.",
        });
    }
});

authRouter.post("/signin", async (req, res) => {
    const inputBody: UserInput = req.body;
    const result = userSchema.safeParse(inputBody);

    if (!result.success) {
        return res.status(400).json({
            message: "Incorrect Inputs",
        });
    }
    const { email, password } = result.data;
    let currentUser;
    try {
        currentUser = await prisma.user.findUnique({
            where: {
                email: email,
            },
        });
    } catch (e) {
        return res.status(500).json({
            message: "An internal server error occurred.",
        });
    }

    if (!currentUser) {
        return res.status(411).json({
            message: "User not found",
        });
    }

    const isPasswordCorrect = await bcrypt.compare(
        password,
        currentUser.password,
    );
    if (!isPasswordCorrect) {
        return res.status(401).json({
            message: "Incorrect Password",
        });
    }

    const token = jwt.sign({ userId: currentUser.id }, process.env.JWT_SECRET!);

    res.status(200).json({
        message: "Sign in successful",
        token: token,
    });
});

export default authRouter;

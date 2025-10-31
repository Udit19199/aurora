import { Router } from "express";
import { CreateGoalSchema, UpdateGoalSchema, UpdateGoal, CreateGoal, GetGoalsQuerySchema } from "../types/goal";
import { prisma } from "@aurora/database";

const goalRouter = Router();

goalRouter.post("/", async (req, res) => {
    const inputBody: CreateGoal = req.body;
    const result = CreateGoalSchema.safeParse(inputBody);

    if (!result.success) {
        return res.status(400).json({
            message: "Incorrect Inputs",
        });
    }

    if (!req.userId) {
        return res.status(401).json({
            "message": "Authentication Error"
        })
    }

    const { title, description, deadline } = result.data
    try {
        const createdGoal = await prisma.goal.create({
            data: {
                title,
                description,
                deadline,
                userId: req.userId
            }
        })

        res.status(201).json(createdGoal)
    } catch (e) {
        res.status(500).json({
            "message": "An internal server error occurred."
        })
    }
});

goalRouter.get("/", async (req, res) => {

    const result = GetGoalsQuerySchema.safeParse(req.query);
    if (!result.success) {
        return res.status(400).json({
            "message": "Bad Request"
        })
    }

    if (!req.userId) {
        return res.status(401).json({
            "message": "Authentication Error"
        })
    }

    const { limit, offset } = result.data

    try {
        const [goals, totalCount] = await prisma.$transaction([
            prisma.goal.findMany({
                skip: offset,
                take: limit,
                where: {
                    userId: req.userId,
                    deletedAt: null

                },
                orderBy: {
                    createdAt: 'desc'
                }
            }),
            prisma.goal.count({
                where: {
                    userId: req.userId,
                    deletedAt: null
                }
            })
        ])

        res.status(200).json({
            "data": goals,
            "total": totalCount
        })
    } catch (e) {
        return res.status(500).json({
            "message": "Internal Server Error"
        })
    }
})



goalRouter.put('/:goalId', async (req, res) => {

    const goal = await prisma.goal.findUnique({
        where: {
            userId: req.userId,
            id: req.params.goalId
        }
    })

})




export default goalRouter;

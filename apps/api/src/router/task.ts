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
  // fetch the goal, if it exists update it with the new info else tell the user it doesn't exist
  if (!req.userId) {
    return res.status(401).json({
      "message": "Authentication Error"
    })
  }
  const inputBody: UpdateGoal = req.body
  const result = UpdateGoalSchema.safeParse(inputBody)
  if (!req.params.goalId || !result.success) {
    return res.status(400).json({
      "message": "Incorrect inputs"
    })
  }


  let goal = await prisma.goal.findUnique({
    where: {
      userId: req.userId,
      id: req.params.goalId
    }
  })

  if (!goal || goal.deletedAt) {
    return res.status(404).json({
      "message": "Goal not found"
    })
  }

  try {
    let updatedGoal = await prisma.goal.update({
      where: {
        userId: req.userId,
        id: req.params.goalId
      }, data: result.data
    })
    return res.status(200).json(updatedGoal)
  } catch (e) {
    return res.status(500).json({
      "message": "Internal Server Error"
    })
  }
})

goalRouter.delete("/:goalId", async (req, res) => {
  if (!req.userId) {
    return res.status(401).json({
      "message": "Authentication Error"
    })
  }

  if (!req.params.goalId) {
    return res.status(400).json({
      "message": "Incorrect inputs"
    })
  }

  let goal = await prisma.goal.findUnique({

    where: {
      userId: req.userId,
      id: req.params.goalId
    }
  })

  if (!goal || goal.deletedAt) {
    return res.status(404).json({
      "message": "Goal not found"
    })
  }

  try {
    await prisma.goal.update({
      where: {
        userId: req.userId,
        id: req.params.goalId
      }, data: {
        deletedAt: new Date()
      }
    })
    return res.status(200).json({
      "message": "Goal Deleted"
    })
  } catch (e) {
    return res.status(500).json({
      "message": "Internal Server Error"
    })
  }


})



export default goalRouter;

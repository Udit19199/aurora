import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export function authMiddleware(
	req: Request,
	res: Response,
	next: NextFunction,
) {
	const authHeader = req.headers.authorization;

	if (!authHeader || !authHeader.startsWith("Bearer ")) {
		return res.status(401).json({
			message: "Unauthorized: No token provided",
		});
	}

	const token = authHeader.split(" ")[1];

	jwt.verify(token, process.env.JWT_SECRET!, (err, decoded) => {
		if (err) {
			return res
				.status(403)
				.json({ message: "Forbidden: Invalid or expired token" });
		}
		if (typeof decoded === "object" && decoded && "userId" in decoded) {
			req.userId = (decoded as { userId: string }).userId;
			next();
		} else {
			return res
				.status(403)
				.json({ message: "Forbidden: Invalid token payload" });
		}
	});
}

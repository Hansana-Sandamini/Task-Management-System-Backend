import { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"

dotenv.config()

const JWT_SECRET = process.env.JWT_SECRET as string

export interface AuthRequest extends Request {
    user?: { id: string }
}

export const authenticate = (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Unauthorized" })
    }

    // Bearer <token>
    const token = authHeader.split(" ")[1]

    if (!token) {
        return res.status(401).json({ message: "Token missing" })
    }

    try {
        const payload = jwt.verify(token, JWT_SECRET) as { id: string }
        req.user = payload
        next()
    } catch {
        return res.status(403).json({ message: "Invalid or expired token" })
    }
}

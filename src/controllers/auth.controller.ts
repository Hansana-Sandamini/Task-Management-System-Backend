import { Request, Response } from "express"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
import bcrypt from "bcryptjs"
import { signAccessToken, signRefreshToken } from "../utils/tokens"
import { IUSER, User } from "../models/user.model"

dotenv.config()

const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET as string
const SALT_ROUNDS = 10

export const registerUser = async (req: Request, res: Response) => {
    try {
        let { firstname, lastname, email, password } = req.body

        // Sanitize inputs
        firstname = firstname?.trim()
        lastname = lastname?.trim()
        email = email?.toLowerCase().trim()

        // Validate required fields
        if (!firstname || !lastname || !email || !password) {
            return res.status(400).json({
                message: "Firstname, lastname, email and password are required",
            })
        }

        // Check duplicate email
        const existingUser = await User.findOne({ email })

        if (existingUser) {
            return res.status(400).json({
                message: "Email already exists",
            })
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS)

        // Create user
        const user = await User.create({
            firstname,
            lastname,
            email,
            password: hashedPassword,
        })

        return res.status(201).json({
            message: "User registered successfully",
            data: {
                id: user._id,
                email: user.email,
            }
        })
    } catch (error: unknown) {
        return res.status(500).json({ message: "Internal server error" })
    }
}

export const login = async (req: Request, res:Response) => {
    try {
        let { email, password } = req.body

        email = email?.toLowerCase().trim()

        // Required fields
        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required",
            })
        }

        const user = await User.findOne({ email })

        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password",
            })
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if (!isMatch) {
            return res.status(401).json({
                message: "Invalid email or password",
            })
        }

        // Generate tokens
        const accessToken = signAccessToken(user)
        const refreshToken = signRefreshToken(user)

        return res.status(200).json({
            message: "Login successful",
            data: {
                accessToken,
                refreshToken,
                user: {
                    id: user._id,
                    firstname: user.firstname,
                    lastname: user.lastname,
                    email: user.email,
                }
            }
        })
    } catch (error: unknown) {
        return res.status(500).json({ message: "Internal server error" })
    }
}

export const refreshToken = async (req: Request, res: Response) => {
    try {
        const { token } = req.body

        if (!token) {
            return res.status(400).json({ message: "Refresh token required" })
        }

        const payload = jwt.verify(token, JWT_REFRESH_SECRET) as { sub: string }

        const user = await User.findById(payload.sub)

        if (!user) {
            return res.status(403).json({ message: "Invalid refresh token" })
        }

        const newAccessToken = signAccessToken(user)

        return res.status(200).json({
            data: {
                accessToken: newAccessToken
            }
        })
    } catch {
        return res.status(403).json({ message: "Invalid or expired token"})
    }
}

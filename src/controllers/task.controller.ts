import { Request, Response } from "express"
import { AuthRequest } from "../middleware/auth.middleware"

export const getTasks = async (req: AuthRequest, res: Response) => {}

export const createTask = async (req: AuthRequest, res: Response) => {}

export const updateTask = async (req: AuthRequest, res: Response) => {}

export const deleteTask = async (req: AuthRequest, res: Response) => {}

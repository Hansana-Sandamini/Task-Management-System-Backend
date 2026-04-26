import { Request, Response } from "express"
import { AuthRequest } from "../middleware/auth.middleware"
import { Task } from "../models/task.model"

export const getTasks = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.id

        const tasks = await Task.find({ userId }).sort({ createdAt: -1 })

        return res.status(200).json({
            message: "Tasks fetched successfully",
            data: tasks
        })
    } catch {
        return res.status(500).json({ message: "Server error" })
    }
}

export const createTask = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.id
        const { title, description } = req.body

        if (!title) {
            return res.status(400).json({ message: "Title is required" })
        }

        const task = await Task.create({
            userId,
            title: title.trim(),
            description: description?.trim() || ""
        })

        return res.status(201).json({
            message: "Task created successfully",
            data: task
        })
    } catch {
        return res.status(500).json({ message: "Server error" })
    }
}

export const updateTask = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.id
        const taskId = req.params.id

        const task = await Task.findById(taskId)

        if (!task) {
            return res.status(404).json({ message: "Task not found" })
        }

        // ownership check
        if (task.userId.toString() !== userId) {
            return res.status(403).json({ message: "Forbidden" })
        }

        const { title, description, status } = req.body

        if (title) task.title = title.trim()
        if (description !== undefined) task.description = description.trim()
        if (status) task.status = status

        await task.save()

        return res.status(200).json({
            message: "Task updated successfully",
            data: task
        })
    } catch {
        return res.status(500).json({ message: "Server error" })
    }
}

export const deleteTask = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.id
        const taskId = req.params.id

        const task = await Task.findById(taskId)

        if (!task) {
            return res.status(404).json({ message: "Task not found" })
        }

        // ownership check
        if (task.userId.toString() !== userId) {
            return res.status(403).json({ message: "Forbidden" })
        }

        await task.deleteOne()

        return res.status(200).json({
            message: "Task deleted successfully"
        })
    } catch {
        return res.status(500).json({ message: "Server error" })
    }
}

import { Router } from "express"
import { registerUser, login, refreshToken } from "../controllers/auth.controller"

const router = Router()

router.post("/register", registerUser)
router.post("/login", login)
router.post("/refresh", refreshToken)

export default router

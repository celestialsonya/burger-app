import express, {Request, Response} from "express";
import {AuthController} from "./auth.controller";
import {AuthService} from "./auth.service";
import {check} from "express-validator";
import {AuthMiddleware} from "./middleware/auth.middleware"
import {cartService} from "../cart/cart.router";
import {AuthRepository} from "./auth.repository";
import db from "../db";
import {ValidationMiddleware} from "./validation/Validation.middleware";

const authRouter = express.Router()
const authRepository = new AuthRepository(db)
export const authService = new AuthService(authRepository)
const authController = new AuthController(authService, cartService)

authRouter.post("/register", ValidationMiddleware, authController.register)
authRouter.post("/login", authController.login)
authRouter.get("/getUsers", AuthMiddleware, authController.getUsers)

export default authRouter
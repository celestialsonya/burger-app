import express, {Request, Response} from "express";
import {AuthController} from "./auth.controller";
import {AuthService} from "./auth.service";
import {check} from "express-validator";
import {AuthMiddleware} from "./middleware/auth.middleware"
import {cartService} from "../cart/cart.router";

const authRouter = express.Router()
const authService = new AuthService()
const authController = new AuthController(authService,cartService)


authRouter.post("/register", [
    check('login', "имя не может быть пустым").notEmpty(),
    check('password', "пароль не может быть меньше 5").isLength({min: 5})
], (req: Request, res: Response) => {
    authController.register(req, res)
})
authRouter.post("/login", authController.login)
authRouter.get("/getUsers", AuthMiddleware, authController.getUsers)

export default authRouter
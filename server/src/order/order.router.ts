import express from "express";
import db from "../db";
import {OrderRepository} from "./order.repository";
import {OrderService} from "./order.service";
import {OrderController} from "./order.controller";
import {authRepository} from "../auth/auth.router";
import {cartRepository} from "../cart/cart.router";
import {validationResult} from "express-validator";
import {ValidationMiddleware} from "../auth/validation/Validation.middleware";
import {AuthMiddleware} from "../auth/middleware/auth.middleware";

const orderRouter = express.Router()
const orderRepository = new OrderRepository(db, cartRepository)
const orderService = new OrderService(orderRepository, authRepository, cartRepository)
const orderController = new OrderController(orderService, orderRepository)

orderRouter.post("/createOrder", ValidationMiddleware, orderController.createOrder)
orderRouter.get("/getLastOrderById", AuthMiddleware, orderController.getLastOrderById)

export default orderRouter
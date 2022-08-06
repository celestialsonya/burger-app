import express from "express";
import db from "../db";
import {OrderRepository} from "./order.repository";
import {OrderService} from "./order.service";
import {OrderController} from "./order.controller";
import {authRepository} from "../auth/auth.router";
import {cartRepository} from "../cart/cart.router";
import {ValidationMiddleware} from "../auth/validation/Validation.middleware";

const orderRouter = express.Router()
const orderRepository = new OrderRepository(db)
const orderService = new OrderService(orderRepository, authRepository, cartRepository)
const orderController = new OrderController(orderService, orderRepository)

orderRouter.post("/createOrder", ValidationMiddleware, orderController.createOrder)

export default orderRouter
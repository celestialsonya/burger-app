import express from "express";
import db from "../db";
import {OrderRepository} from "./order.repository";
import {OrderService} from "./order.service";
import {OrderController} from "./order.controller";
import {authService} from "../auth/auth.router";
import {cartRepository} from "../cart/cart.router";

const orderRouter = express.Router()
const orderRepository = new OrderRepository(db, cartRepository, authService)
const orderService = new OrderService(orderRepository)
const orderController = new OrderController(orderService, orderRepository)

orderRouter.post("/createOrder", orderController.createOrder)

export default orderRouter
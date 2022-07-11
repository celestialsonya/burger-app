import express from "express";
import db from "../db";
import {OrderRepository} from "./order.repository";
import {OrderService} from "./order.service";
import {OrderController} from "./order.controller";

const orderRouter = express.Router()
const orderRepository = new OrderRepository(db)
const orderService = new OrderService(orderRepository)
const orderController = new OrderController(orderService)

orderRouter.post("/createOrder")

export default orderRouter
import {OrderService} from "./order.service";
import {OrderRepository} from "./order.repository";
import {Request, Response} from "express";
import {Order} from "../entities/Order";
import {SpamOrders} from "./order.errors";

export class OrderController{

    private orderService: OrderService
    private orderRepository: OrderRepository
    constructor(orderService: OrderService, orderRepository: OrderRepository) {
        this.orderService = orderService
        this.orderRepository = orderRepository
        this.createOrder = this.createOrder.bind(this)
        this.getLastOrderById = this.getLastOrderById.bind(this)
    }

    async createOrder(req: Request, res: Response){
        const dto = req.body

        try {
            const order: Order = await this.orderService.createOrder(dto)
            return res.status(200).send({order})
        } catch (e){
            console.log(e)
            if (e instanceof SpamOrders){
                return res.status(e.statusCode).send(e.message)
            }
            return res.status(400).send("error creating order!!")
        }
    }

    async getLastOrderById(req: Request, res: Response){

        const {userId} = req.userData

        try {
            const orders: Order = await this.orderService.getLastOrderById(userId)
            return res.status(200).send({orders})
        } catch (e){
            console.log(e)
            return res.status(400).send("error getting orders!!")
        }
    }
}
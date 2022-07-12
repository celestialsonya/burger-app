import {CartRepository} from "../cart/cart.repository";
import {OrderRepository} from "./order.repository";
import {CreateOrderDto} from "./dto/create-order.dto";

export class OrderService{

    private orderRepository: OrderRepository

    constructor(orderRepository: OrderRepository) {
        this.orderRepository = orderRepository
    }

    async createOrder(dto: any){


    }
}
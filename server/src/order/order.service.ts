import {CartRepository} from "../cart/cart.repository";
import {OrderRepository} from "./order.repository";

export class OrderService{

    private orderRepository: OrderRepository

    constructor(orderRepository: OrderRepository) {
        this.orderRepository = orderRepository
    }

}
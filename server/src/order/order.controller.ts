import {OrderService} from "./order.service";

export class OrderController{

    private orderService: OrderService
    constructor(orderService: OrderService) {
        this.orderService = orderService
    }

}
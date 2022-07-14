import {Client} from "pg";
import {Order} from "../entities/Order";
import client from "../db";
import {User} from "../entities/User";
import {CreateOrderDto} from "./dto/create-order.dto";

export class OrderRepository{

    private client: Client

    constructor(db: Client) {
        this.client = db
    }

    async createOrder(dto: CreateOrderDto, user: User, cartId: number, userId: number, cartProducts: any, amount: number, delivery: boolean, deliveryDetails: any, data: string): Promise<Order>{

        // create order:

        const sqlCreateOrder = `insert into orders (user_id, cart, username,
                phone_number, amount, delivery, delivery_details, status, data) values ($1, $2, $3, 
                $4, $5, $6, $7, $8, $9) returning *`

        const valuesCreateOrder = [userId, cartProducts, dto.username, dto.phone_number, amount, delivery, deliveryDetails, "not confirmed", data]
        const orderData = await this.client.query(sqlCreateOrder, valuesCreateOrder)
        console.log(data)
        const order = orderData.rows[0]

        return order

    }

    async getLastOrderById(userId: number): Promise<Order>{
        const sql = "select * from orders where user_id = $1"
        const values = [userId]
        const {rows} = await this.client.query(sql, values)
        const orders: Order = rows[rows.length - 1]

        return orders
    }

    async calculateAmount(cartId: number): Promise<any>{

        const sqlAmount = "select price, quantity from cart_product cp join product p on cp.product_id = p.id where cp.cart_id = $1"
        const valuesAmount = [cartId]
        const data = await client.query(sqlAmount, valuesAmount);
        const price = data.rows

        return price
    }

    async addedProductsByCart(dto: CreateOrderDto, cartId: number){

        // added to cart_product:

        dto.cart.map(async (p: any) => {
            const sql = `insert into cart_product (cart_id, product_id, quantity) values ($1, $2, $3) returning *`
            const values = [cartId, p.product_id, p.quantity]
            const {rows} = await this.client.query(sql, values)
        })

    }


}

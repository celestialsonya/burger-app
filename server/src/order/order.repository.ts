import {Client} from "pg";
import {CreateOrderDto} from "./dto/create-order.dto";
import {Order} from "../entities/Order";
import {AuthRepository} from "../auth/auth.repository";
import {CartRepository} from "../cart/cart.repository";
import {AuthService} from "../auth/auth.service";
import {CartProduct} from "../entities/CartProduct";
import client from "../db";
import db from "../db";

export class OrderRepository{

    private client: Client
    private cartRepository: CartRepository
    private authService: AuthService

    constructor(db: Client, cartRepository: CartRepository, authService: AuthService) {
        this.client = db
        this.cartRepository = cartRepository
        this.authService = authService
    }

    async createOrder(dto: any){
        console.log(1)
        const {cart, username, phone_number, delivery, delivery_details} = dto

        // checking whether the user exists:

        const sqlCheck = "select id from users where phone_number = $1"
        const valuesCheck = [phone_number]
        const {rows} = await this.client.query(sqlCheck, valuesCheck)

        if (!rows.length){

            // create new user:
            const sqlCreateUser = "insert into users (username, phone_number) values ($1, $2) returning id"
            const valuesCreateUser = [username, phone_number]

            const {rows} = await this.client.query(sqlCreateUser, valuesCreateUser)
            const userId = rows[0].id

            // create cart:
            const cartId = await this.cartRepository.createCart(userId)

            // generate token:
            const token = this.authService.generateAccessToken(userId, cartId)

            // from localStorage we get all products and put body =>
            // example cart = cart = [ {"product_id": 1, "quantity": 2}, {"product_id": 2, "quantity": 5} ]

            const cartProducts = cart.map((p: any) => {
                return JSON.stringify(p)
            })

            // added to cart_product:

            cart.map(async (p: CartProduct) => {
                const values = [cartId, p.product_id, p.quantity]
                const sql = `insert into cart_product (cart_id, product_id, quantity) values ($1, $2, $3) returning *`
                const {rows} = await this.client.query(sql, values)
            })

            // calculate amount:

            async function calculateAmount(){

                const sqlAmount = "select price, quantity from cart_product cp join product p on cp.product_id = p.id where cp.cart_id = $1"
                const valuesAmount = [cartId]
                const data = await client.query(sqlAmount, valuesAmount)
                const price = data.rows

                // we get: [ { price: 210, quantity: 2 }, { price: 270, quantity: 5 } ]

                let amount: number = 0
                price.map((o) => {
                    amount += o.price * o.quantity
                })

                return amount
            }
            const amount = await calculateAmount()

            // getting current data:

            async function currentData(){
                const sql = "select current_date"
                const {rows} = await client.query(sql)
                const {current_date} = rows[0]

                return current_date
            }

            const data = await currentData()

            // create order:

            const sqlCreateOrder = `insert into orders (user_id, cart, username,
                phone_number, amount, delivery, status, data) values ($1, $2, $3, 
                $4, $5, $6, $7, $8, $9) returning *`

            const valuesCreateOrder = [userId, cartProducts, username, phone_number, amount, true, "not confirmed", data]
            const orderData = await this.client.query(sqlCreateOrder, valuesCreateOrder)
            const order = orderData.rows
            console.log(order)

            return order
        }

        // if user already exist:

        return null
    }

}

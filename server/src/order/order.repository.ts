import {Client} from "pg";
import {Order} from "../entities/Order";
import {CartRepository} from "../cart/cart.repository";
import {AuthService} from "../auth/auth.service";
import {CartProduct} from "../entities/CartProduct";
import {DeliveryDetails} from "../entities/DeliveryDetails";
import {calculateAmount} from "../hooks/calculateAmount";
import {getCurrentData} from "../hooks/getCurrentData";

export class OrderRepository{

    private client: Client
    private cartRepository: CartRepository
    private authService: AuthService

    constructor(db: Client, cartRepository: CartRepository, authService: AuthService) {
        this.client = db
        this.cartRepository = cartRepository
        this.authService = authService
    }

    async createOrder(dto: any): Promise<Order>{

        const {cart, username, phone_number, delivery} = dto
        let delivery_details: DeliveryDetails = dto.delivery_details

        // checking whether the user exists:

        const sqlCheck = "select id from users where phone_number = $1"
        const valuesCheck = [phone_number]
        const {rows} = await this.client.query(sqlCheck, valuesCheck)

        // if user does not exist:

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
            const amount = await calculateAmount(cartId)

            // getting current data:
            const data = await getCurrentData()

            // checking whether delivery is needed:

            let delivery: boolean = false
            if (delivery_details){
                delivery = true
            }

            let deliveryDetails = null
            if (delivery){
                deliveryDetails = JSON.stringify(delivery_details)
            }

            // create order:

            const sqlCreateOrder = `insert into orders (user_id, cart, username,
                phone_number, amount, delivery, delivery_details, status, data) values ($1, $2, $3, 
                $4, $5, $6, $7, $8, $9) returning *`

            const valuesCreateOrder = [userId, cartProducts, username, phone_number, amount, delivery, deliveryDetails, "not confirmed", data]
            const orderData = await this.client.query(sqlCreateOrder, valuesCreateOrder)
            const order = orderData.rows[0]

            // clearing cart_product tables:

            const sqlClear = "delete from cart_product where cart_id = $1"
            const valuesClear = [cartId]
            const clear = await this.client.query(sqlClear, valuesClear)

            return order
        }

        // if user already exist:

        if (rows.length){

            // getting userId and cartId:

            const userId = rows[0].id
            const cartId = await this.cartRepository.getCart(userId)

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

            const amount = await calculateAmount(cartId)

            // getting current data:

            const data = await getCurrentData()

            // checking whether delivery is needed:

            let delivery: boolean = false
            if (delivery_details){
                delivery = true
            }

            let deliveryDetails = null
            if (delivery){
                deliveryDetails = JSON.stringify(delivery_details)
            }

            // create order:

            const sqlCreateOrder = `insert into orders (user_id, cart, username,
                phone_number, amount, delivery, delivery_details, status, data) values ($1, $2, $3, 
                $4, $5, $6, $7, $8, $9) returning *`

            const valuesCreateOrder = [userId, cartProducts, username, phone_number, amount, delivery, deliveryDetails, "not confirmed", data]
            const orderData = await this.client.query(sqlCreateOrder, valuesCreateOrder)
            const order = orderData.rows[0]

            // clearing cart_product tables:

            const sqlClear = "delete from cart_product where cart_id = $1"
            const valuesClear = [cartId]
            const clear = await this.client.query(sqlClear, valuesClear)

            return order
        }

    }

}

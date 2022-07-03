import client from "../db"
import {Client} from "pg";
import {CreateProductDto} from "./dto/create-product.dto";

export class CartRepository{

    private client: Client

    constructor(db: Client) {
        this.client = db
    }

    async createCart(userId: number){
        const sql = "insert into cart (user_id) values ($1) returning id"
        const values = [userId]
        const {rows} = await client.query(sql, values)
        const {id} = rows[0]

        return id
    }

    async getCart(userId: number){

        const sql = "select id from cart where user_id = $1"
        const values = [userId]
        const {rows} = await client.query(sql, values)
        const {id} = rows[0]

        return id

    }

    async addNewProduct(body: CreateProductDto): Promise<number>{

        const {name, description, price, category} = body
        const sql = "insert into product (name, description, price, category) values ($1, $2, $3, $4) returning id"
        const values = [name, description, price, category]
        const {rows} = await client.query(sql, values)
        const {id} = rows[0]

        return id

    }

    async addProductByCart(cartId: number, productId: number){

        // checking if there is a product
        const sqlChecking = "select * from cart_product where cart_id = $1 and product_id = $2"
        const valuesChecking = [cartId, productId]
        const {rows} = await client.query(sqlChecking, valuesChecking)

        if (rows.length) {
            const sql = "update cart_product set quantity = quantity + 1 where cart_id = $1 and product_id = $2 returning *"
            const {rows} = await client.query(sql, valuesChecking)
            const {cart_id, product_id, quantity} = rows[0]

            return {cart_id, product_id, quantity}
        }

        // if product is not found:

        if (!rows.length) {
            const sql = "insert into cart_product (cart_id, product_id, quantity) values ($1, $2, $3) returning *"
            const quantityDefault: number = 1
            const values = [cartId, productId, quantityDefault]

            const {rows} = await client.query(sql, values)
            const {cart_id, product_id, quantity} = rows[0]

            return {cart_id, product_id, quantity}
        }

    }

    async deleteProductByCart(cartId: number, productId: number){

        // checking for quantity

        const sql = `delete from cart_product
            where cart_id = $1 and product_id = $2 returning cart_id, product_id limit 1
        `

        const values = [cartId, productId]
        const {rows} = await client.query(sql, values)
        const {cart_id, product_id} = rows[0]

        return {cart_id, product_id}
    }

}
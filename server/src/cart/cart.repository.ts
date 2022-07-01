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

        const {name, description, price, type} = body
        const sql = "insert into product (name, description, price, type) values ($1, $2, $3, $4) returning id"
        const values = [name, description, price, type]
        const {rows} = await client.query(sql, values)
        const {id} = rows[0]

        return id

    }

    async addProductByCart(cartId: number, productId: number){
        const sql  = ``
        const values = [cartId, productId, 1]
        const {rows} = await client.query(sql, values)
        const {cart_id, product_id, quantity} = rows[0]
        console.log(cart_id, product_id, quantity)

        return {cart_id, product_id, quantity}
    }

    async deleteProductByCart(cartId: number, productId: number){
        const sql = `UPDATE `
        const values = [cartId, productId]
        const {rows} = await client.query(sql, values)
        const {cart_id, product_id} = rows[0]

        return {cart_id, product_id}
    }

}
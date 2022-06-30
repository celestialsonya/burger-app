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
        const sql = "insert into cart_product (cart_id, product_id, quantity) values ($1,$2,$3) on conflict (product_id) do update set quantity = quantity + 1 where cart_id = $1 and product_id = $2"
        const values = [cartId, productId, 1]
        const {rows} = await client.query(sql, values)
        const {cart_id, product_id, quantity} = rows[0]
        console.log(cart_id, product_id, quantity)

        return {cart_id, product_id, quantity}
    }

    async deleteProductByCart(cartId: number, productId: number){
        const sql = "delete from cart_product where cart_id = $1 and product_id = $2 returning cart_id, product_id limit 1"
        const values = [cartId, productId]
        const {rows} = await client.query(sql, values)
        const {cart_id, product_id} = rows[0]

        return {cart_id, product_id}
    }

}
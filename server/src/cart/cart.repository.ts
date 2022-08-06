import client from "../db"
import {Client} from "pg";
import {CreateProductDto} from "../product/dto/create-product.dto";
import {Product} from "../entities/Product";
import {CartProduct} from "../entities/CartProduct";

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

    async getCart(userId: number): Promise<number>{

        const sql = "select id from cart where user_id = $1"
        const values = [userId]
        const {rows} = await client.query(sql, values)
        const {id} = rows[0]

        return id

    }

    async clearCart(cartId: number): Promise<CartProduct[]>{

        const sql = "delete from cart_product where cart_id = $1 returning *"
        const values = [cartId]
        const {rows} = await client.query(sql, values)
        const deletedProducts: CartProduct[] = rows
        console.log(deletedProducts)
        return deletedProducts

    }

    async getProductsByCart(cartId: number): Promise<Product[]>{

        const sql = `select p.id, p.name, p.description, p.price, p.category, cp.quantity from product p join cart_product cp on cp.product_id = p.id where cp.cart_id = $1`
        const values = [cartId]
        const data = await client.query(sql, values)
        const products: Product[] = data.rows

        return products
    }

}
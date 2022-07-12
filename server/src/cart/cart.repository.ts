import client from "../db"
import {Client} from "pg";
import {CreateProductDto} from "./dto/create-product.dto";
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

    async getCart(userId: number){

        const sql = "select id from cart where user_id = $1"
        const values = [userId]
        const {rows} = await client.query(sql, values)
        const {id} = rows[0]

        return id

    }

    async addNewProduct(body: CreateProductDto): Promise<Product>{

        const {name, description, price, category} = body
        const sql = "insert into product (name, description, price, category) values ($1, $2, $3, $4) returning *"
        const values = [name, description, price, category]
        const {rows} = await client.query(sql, values)
        const product: Product = rows[0]

        return product

    }

    async addProductByCart(cartId: number, productId: number): Promise<CartProduct>{

        // checking if there is a product:

        const sqlChecking = "select * from cart_product where cart_id = $1 and product_id = $2"
        const valuesChecking = [cartId, productId]
        const {rows} = await client.query(sqlChecking, valuesChecking)

        if (rows.length) {
            const sql = "update cart_product set quantity = quantity + 1 where cart_id = $1 and product_id = $2 returning *"
            const {rows} = await client.query(sql, valuesChecking)
            const product: CartProduct = rows[0]

            return product
        }

        // if product is not found:

        if (!rows.length) {
            const sql = "insert into cart_product (cart_id, product_id, quantity) values ($1, $2, $3) returning *"
            const quantityDefault: number = 1
            const values = [cartId, productId, quantityDefault]

            const {rows} = await client.query(sql, values)
            const product: CartProduct = rows[0]

            return product
        }

    }

    async deleteProductByCart(cartId: number, productId: number): Promise<CartProduct>{

        // checking for quantity

        const sql = "select quantity from cart_product where cart_id = $1 and product_id = $2"
        const values = [cartId, productId]

        const {rows} = await client.query(sql, values)
        const {quantity} = rows[0]

        // if the quantity exist and not 0:

        if (quantity){
            const sql = "update cart_product set quantity = quantity - 1 where cart_id = $1 and product_id = $2 returning *"
            const {rows} = await client.query(sql, values)
            const product: CartProduct = rows[0]

            return product
        }

        // if the quantity not exist or equal 0:

        if (!quantity) {
            return null
        }

    }

    async clearCart(cartId: number): Promise<CartProduct[]>{

        const sql = "delete from cart_product where cart_id = $1 returning *"
        const values = [cartId]
        const {rows} = await client.query(sql, values)
        const deletedProducts: CartProduct[] = rows

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
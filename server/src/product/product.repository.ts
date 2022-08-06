import {CreateProductDto} from "./dto/create-product.dto";
import {Product} from "../entities/Product";
import {Client} from "pg";
import {CartProduct} from "../entities/CartProduct";

export class ProductRepository{

    private client: Client;
    constructor(db: Client) {
        this.client = db
    }

    async addNewProduct(body: CreateProductDto): Promise<Product>{

        const {name, description, price, category} = body
        const sql = "insert into product (name, description, price, category) values ($1, $2, $3, $4) returning *"
        const values = [name, description, price, category]
        const {rows} = await this.client.query(sql, values)
        const product: Product = rows[0]

        return product
    }

    async addProductByCart(cartId: number, productId: number): Promise<CartProduct>{

        // checking if there is a product:

        const sqlChecking = "select * from cart_product where cart_id = $1 and product_id = $2"
        const valuesChecking = [cartId, productId]
        const {rows} = await this.client.query(sqlChecking, valuesChecking)

        if (rows.length) {
            const sql = "update cart_product set quantity = quantity + 1 where cart_id = $1 and product_id = $2 returning *"
            const {rows} = await this.client.query(sql, valuesChecking)
            const product: CartProduct = rows[0]

            return product
        }

        // if product is not found:

        if (!rows.length) {
            const sql = "insert into cart_product (cart_id, product_id, quantity) values ($1, $2, $3) returning *"
            const quantityDefault: number = 1
            const values = [cartId, productId, quantityDefault]

            const {rows} = await this.client.query(sql, values)
            const product: CartProduct = rows[0]

            return product
        }

    }

    async deleteProductByCart(cartId: number, productId: number): Promise<CartProduct>{

        // checking for quantity

        const sql = "select quantity from cart_product where cart_id = $1 and product_id = $2"
        const values = [cartId, productId]

        const {rows} = await this.client.query(sql, values)
        const {quantity} = rows[0]

        // if the quantity exist and not 0:

        if (quantity){
            const sql = "update cart_product set quantity = quantity - 1 where cart_id = $1 and product_id = $2 returning *"
            const {rows} = await this.client.query(sql, values)
            const product: CartProduct = rows[0]

            return product
        }

        // if the quantity not exist or equal 0:

        if (!quantity) {
            return null
        }

    }

    async getProductById(id: number): Promise<Product>{
        const sql = "select from product where id = $1"
        const values = [id]
        const {rows} = await this.client.query(sql, values)

        return rows[0]
    }

}
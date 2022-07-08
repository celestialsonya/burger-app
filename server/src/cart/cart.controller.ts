import {CartService} from "./cart.service";
import {Request, Response} from "express";
import {CreateProductDto} from "./dto/create-product.dto";
import {Product} from "../entities/Product";
import {UserAlreadyExists} from "../auth/auth.errors";
import {ProductNotFound} from "./cart.errors";

export class CartController{

    private cartService: CartService
    constructor(cartService: CartService) {
        this.cartService = cartService
        this.createCart = this.createCart.bind(this)
        this.getCart = this.getCart.bind(this)
        this.addNewProduct = this.addNewProduct.bind(this)
        this.addProductByCart = this.addProductByCart.bind(this)
        this.deleteProductByCart = this.deleteProductByCart.bind(this)
        this.clearCart = this.clearCart.bind(this)
        this.getProductsByCart = this.getProductsByCart.bind(this)
    }

    async createCart(req: Request, res: Response, userId: number){

        try {
            return await this.cartService.createCart(userId)
        } catch (e) {
            return res.status(400).send("Error creating cart!!")
        }
        
    }

    async getCart(req: Request, res: Response, id: number){

        try {
            return await this.cartService.getCart(id)
        } catch (e) {
            console.log(e)
            return res.status(404).send("Error getting cart!!")
        }

    }

    async addNewProduct(req: Request, res: Response){

        const body: CreateProductDto = req.body
        try {
            const product = await this.cartService.addNewProduct(body)
            return res.status(200).send({product})
        } catch (e) {
            console.log(e)
            return res.status(404).send("Error adding cart!!")
        }

    }

    async addProductByCart(req: Request, res: Response){

        const {cartId} = req.userData
        const {productId} = req.body

        try {
            const product = await this.cartService.addProductByCart(cartId, productId)
            res.status(200).send({product})
        } catch (e) {
            console.log(e)
            return res.status(404).send("Error adding cart!!")
        }

    }

    async deleteProductByCart(req: Request, res: Response){

        const {cartId} = req.userData
        const {productId} = req.body

        try {
            const deletedProduct = await this.cartService.deleteProductByCart(cartId, productId)
            return res.status(200).send({deletedProduct})
        } catch (e) {
            console.log(e)
            if (e instanceof ProductNotFound){
                return res.status(e.statusCode).send(e.message)
            }

            return res.status(404).send("Error deleting product!!")
        }

    }

    async clearCart(req: Request, res: Response){

        const {cartId} = req.userData

        try {
            const deletedProductsId = await this.cartService.clearCart(cartId)
            return res.status(200).send({deletedProductsId})
        } catch (e) {
            console.log(e)
            return res.status(404).send("Error clearing cart!!")
        }

    }

    async getProductsByCart(req: Request, res: Response){

        const {cartId} = req.userData

        try {
            const products = await this.cartService.getProductsByCart(cartId)
            return res.status(200).send({products})
        } catch (e) {
            console.log(e)
            return res.status(404).send("Error getting products!!")
        }

    }

}
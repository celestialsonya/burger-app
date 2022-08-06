import {CartService} from "./cart.service";
import {Request, Response} from "express";

export class CartController{

    private cartService: CartService
    constructor(cartService: CartService) {
        this.cartService = cartService
        this.getCart = this.getCart.bind(this)
        this.clearCart = this.clearCart.bind(this)
        this.getProductsByCart = this.getProductsByCart.bind(this)
    }

    async getCart(req: Request, res: Response){

        const {userId} = req.body
        try {
            return await this.cartService.getCart(userId)
        } catch (e) {
            console.log(e)
            return res.status(404).send("Error getting cart!!")
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
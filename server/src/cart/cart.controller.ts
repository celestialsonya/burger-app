import {CartService} from "./cart.service";
import {Request, Response} from "express";
import {CreateProductDto} from "./dto/create-product.dto";

export class CartController{

    private cartService: CartService
    constructor(cartService: CartService) {
        this.cartService = cartService
        this.getCart = this.getCart.bind(this)
        this.addNewProduct = this.addNewProduct.bind(this)
        this.addProductByCart = this.addProductByCart.bind(this)
        this.deleteProductByCart = this.deleteProductByCart.bind(this)
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
            const id = await this.cartService.addNewProduct(body)
            return res.status(200).send({id})
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
            console.log(deletedProduct)
            return res.status(200).send({deletedProduct})
        } catch (e) {
            console.log(e)
            return res.status(404).send("Error deleting cart!!")
        }

    }

}
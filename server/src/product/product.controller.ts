import {Request, Response} from "express";
import {CreateProductDto} from "./dto/create-product.dto";
import {ProductService} from "./product.service";
import {ProductNotFound} from "./product.errors";

export class ProductController{

    private productService: ProductService;
    constructor(productService: ProductService) {
        this.productService = productService
        this.addNewProduct = this.addNewProduct.bind(this)
        this.addProductByCart = this.addProductByCart.bind(this)
        this.deleteProductByCart = this.deleteProductByCart.bind(this)
    }

    async addNewProduct(req: Request, res: Response){

        const body: CreateProductDto = req.body
        try {
            const product = await this.productService.addNewProduct(body)
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
            const product = await this.productService.addProductByCart(cartId, productId)
            res.status(200).send({product})
        } catch (e) {
            console.log(e)
            if (e instanceof ProductNotFound){
                return res.status(e.statusCode).send(e.message)
            }

            return res.status(404).send("Error adding cart!!")
        }

    }

    async deleteProductByCart(req: Request, res: Response){

        const {cartId} = req.userData
        const {productId} = req.body

        try {
            const deletedProduct = await this.productService.deleteProductByCart(cartId, productId)
            return res.status(200).send({deletedProduct})
        } catch (e) {
            console.log(e)
            if (e instanceof ProductNotFound){
                return res.status(e.statusCode).send(e.message)
            }

            return res.status(404).send("Error deleting product!!")
        }

    }

}
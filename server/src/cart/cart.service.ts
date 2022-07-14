import {CartRepository} from "./cart.repository";
import {CreateProductDto} from "./dto/create-product.dto";
import {Product} from "../entities/Product";
import {CartProduct} from "../entities/CartProduct";
import {ProductNotFound} from "./cart.errors";

export class CartService{

    private cartRepository: CartRepository
    constructor(cartRepository: CartRepository) {
        this.cartRepository = cartRepository
    }

    async createCart(userId: number){
        return this.cartRepository.createCart(userId)
    }

    async getCart(userId: number){
        return this.cartRepository.getCart(userId)
    }

    async addNewProduct(body: CreateProductDto): Promise<Product>{
        return this.cartRepository.addNewProduct(body)
    }

    async addProductByCart(cartId: number, productId: number): Promise<CartProduct>{
        return this.cartRepository.addProductByCart(cartId, productId)
    }

    async deleteProductByCart(cartId: number, productId: number): Promise<CartProduct>{
        const ok = await this.cartRepository.deleteProductByCart(cartId, productId)
        if (!ok){
            throw new ProductNotFound()
        }

        return ok
    }

    async clearCart(cartId: number): Promise<CartProduct[]>{
        return this.cartRepository.clearCart(cartId)
    }

    async getProductsByCart(cartId: number): Promise<Product[]>{
        return this.cartRepository.getProductsByCart(cartId)
    }

}
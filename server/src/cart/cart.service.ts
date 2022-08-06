import {CartRepository} from "./cart.repository";
import {Product} from "../entities/Product";
import {CartProduct} from "../entities/CartProduct";

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

    async clearCart(cartId: number): Promise<CartProduct[]>{
        return this.cartRepository.clearCart(cartId)
    }

    async getProductsByCart(cartId: number): Promise<Product[]>{
        return this.cartRepository.getProductsByCart(cartId)
    }

}
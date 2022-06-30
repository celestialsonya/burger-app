import {CartRepository} from "./cart.repository";
import {CreateProductDto} from "./dto/create-product.dto";

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

    async addNewProduct(body: CreateProductDto): Promise<number>{
        return this.cartRepository.addNewProduct(body)
    }

    async addProductByCart(cartId: number, productId: number){
        return this.cartRepository.addProductByCart(cartId, productId)
    }

    async deleteProductByCart(cartId: number, productId: number){
        return this.cartRepository.deleteProductByCart(cartId, productId)
    }

}
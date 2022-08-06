import {CreateProductDto} from "./dto/create-product.dto";
import {Product} from "../entities/Product";
import {ProductRepository} from "./product.repository";
import {CartProduct} from "../entities/CartProduct";
import {ProductNotFound} from "./product.errors";

export class ProductService{

    private productRepository: ProductRepository;
    constructor(productRepository: ProductRepository) {
        this.productRepository = productRepository
    }

    async addNewProduct(body: CreateProductDto): Promise<Product>{
        return this.productRepository.addNewProduct(body)
    }

    async addProductByCart(cartId: number, productId: number): Promise<CartProduct>{

        // checking whether the product exists:
        const product = await this.productRepository.getProductById(productId)
        if (!product){
            throw new ProductNotFound()
        }

        return this.productRepository.addProductByCart(cartId, productId)
    }

    async deleteProductByCart(cartId: number, productId: number): Promise<CartProduct>{
        const ok = await this.productRepository.deleteProductByCart(cartId, productId)
        if (!ok){
            throw new ProductNotFound()
        }

        return ok
    }

}
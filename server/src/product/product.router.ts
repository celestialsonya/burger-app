import express, {Request, Response} from "express";
import db from "../db";
import {ProductRepository} from "./product.repository";
import {ProductService} from "./product.service";
import {ProductController} from "./product.controller";
import {AuthMiddleware} from "../auth/middleware/auth.middleware";

const productRouter = express.Router()
const productRepository = new ProductRepository(db)
const productService = new ProductService(productRepository)
const productController = new ProductController(productService)

productRouter.post("/addNewProduct", productController.addNewProduct)
productRouter.post("/addProductByCart", AuthMiddleware, productController.addProductByCart)
productRouter.post("/deleteProductByCart", AuthMiddleware, productController.deleteProductByCart)


export default productRouter
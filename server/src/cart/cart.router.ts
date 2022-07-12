import express, {Request, Response} from "express";
import {CartService} from "./cart.service"
import {CartRepository} from "./cart.repository";
import db from "../db";
import {CartController} from "./cart.controller";
import {AuthMiddleware} from "../auth/middleware/auth.middleware"

const cartRouter = express.Router()
export const cartRepository = new CartRepository(db)
export const cartService = new CartService(cartRepository)
export const cartController = new CartController(cartService)

cartRouter.post("/addNewProduct", cartController.addNewProduct)
cartRouter.post("/addProductByCart", AuthMiddleware, cartController.addProductByCart)
cartRouter.post("/deleteProductByCart", AuthMiddleware, cartController.deleteProductByCart)
cartRouter.delete("/clearCart", AuthMiddleware, cartController.clearCart)
cartRouter.get("/getProductsByCart", AuthMiddleware, cartController.getProductsByCart)


export default cartRouter
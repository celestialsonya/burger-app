import express from "express";
import authRouter from "./auth/auth.router"
import cartRouter from "./cart/cart.router"
import orderRouter from "./order/order.router";

const app = express()
const PORT = 5000
const router = express.Router()

app.use(express.json())
app.use("/users", authRouter)
app.use("/cart" , cartRouter)
app.use("/order", orderRouter)


app.listen(PORT, () => {
    console.log("server started!!")
})

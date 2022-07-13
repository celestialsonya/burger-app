import client from "../db";

export async function calculateAmount(cartId: number){

    const sqlAmount = "select price, quantity from cart_product cp join product p on cp.product_id = p.id where cp.cart_id = $1"
    const valuesAmount = [cartId]
    const data = await client.query(sqlAmount, valuesAmount);
    const price = data.rows

    // we get: [ { price: 210, quantity: 2 }, { price: 270, quantity: 5 } ]

    let amount: number = 0
    price.map((o) => {
        amount += o.price * o.quantity
    })

    return amount
}
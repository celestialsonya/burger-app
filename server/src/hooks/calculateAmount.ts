
export function calculateAmount(price: any): number{

    // we get: [ { price: 210, quantity: 2 }, { price: 270, quantity: 5 } ]

    let amount: number = 0

    price.map((o: any) => {
        amount += o.price * o.quantity
    })

    return amount
}
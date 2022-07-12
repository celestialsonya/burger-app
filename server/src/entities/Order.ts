
export type Order = {
    order_id?: number
    user_id: number
    cart: object
    username: string
    phone_number: string
    amount: number
    delivery: boolean
    delivery_details?: object
    status: string
    data: string
}
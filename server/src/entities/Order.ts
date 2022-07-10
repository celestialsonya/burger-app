
export type Order = {
    order_id?: number
    user_id?: number
    cart_id?: number
    phone_number: string
    amount: number
    delivery: boolean
    delivery_details: object
    comment: string
    username: string
    status: string
    data: string
}
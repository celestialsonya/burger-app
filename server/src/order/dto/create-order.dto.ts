import {DeliveryDetails} from "../../entities/DeliveryDetails";

export class CreateOrderDto{
    cart: object[]
    username: string
    phone_number: string
    delivery: boolean
    delivery_details?: DeliveryDetails
}
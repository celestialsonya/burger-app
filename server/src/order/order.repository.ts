import {Client} from "pg";

export class OrderRepository{

    private client: Client

    constructor(db: Client) {
        this.client = db
    }

}

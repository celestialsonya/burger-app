CREATE TABLE "users"(
    "id" serial primary key,
    "username" varchar(255) not null,
    "phone_number" integer not null
);

CREATE TABLE "product"(
    "id" serial primary key,
    "name" varchar(255) not null,
    "description" varchar(255) not null,
    "price" integer not null,
    "category" varchar(255) not null
);

CREATE TABLE "cart"(
    "id" serial primary key,
    "user_id" integer not null unique,
    CONSTRAINT user_id_fk
        foreign key(user_id)
        references users(id)
        on delete cascade
);

CREATE TABLE "cart_product"(
    "cart_id" integer not null,
    "product_id" integer not null,
    "quantity" integer not null default 0,
    CONSTRAINT cart_id_fk
        foreign key(cart_id)
        references cart(id)
        on delete cascade,
    CONSTRAINT product_id_fk
        foreign key(product_id)
        references product(id)
        on delete cascade
);

CREATE TABLE "orders"(
    "order_id" serial primary key,
    "user_id" integer not null,
    "cart_id" integer not null,
    "phone_number" integer not null,
    "amount" integer not null,
    "delivery" boolean not null,
    "delivery_details" json not null,
    "comment" varchar(255),
    "username" varchar(255) not null,
    "status" varchar(255) not null,
    "data" varchar(255) not null,
    CONSTRAINT user_id_fk
        foreign key (user_id)
        references users(id)
        on delete cascade,
    CONSTRAINT cart_id_fk
        foreign key (cart_id)
        references cart(id)
        on delete cascade
);
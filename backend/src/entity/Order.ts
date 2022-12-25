import { Column, Entity, ManyToOne, OneToMany } from "typeorm";
import { Base } from "./Base";
import { Cart } from "./Cart";
import { OrderItem } from "./OrderItem";
import { Restaurant } from "./Restaurant";
import { User } from "./User";

export enum OrderStatus {
  ORDERED = "ORDERED",
  PREPARING = "PREPARING",
  DELIVERING = "DELIVERING",
  DELIVERED = "DELIVERED",
}

@Entity("order")
export class Order extends Base {
  @ManyToOne(() => User)
  user: User;

  @ManyToOne(() => Cart)
  cart: Cart;

  @Column({
    type: "enum",
    enum: OrderStatus,
    default: OrderStatus.ORDERED,
  })
  status: OrderStatus;

  @OneToMany(() => OrderItem, (oi) => oi.order, { cascade: true })
  items: OrderItem[];

  @ManyToOne(() => Restaurant)
  restaurant: Restaurant;
}

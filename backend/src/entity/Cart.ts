import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { Base } from "./Base";
import { Order } from "./Order";
import { OrderItem } from "./OrderItem";
import { User } from "./User";

export enum CartStatus {
  ORDERED = "ORDERED",
  UNORDERED = "UNORDERED",
}

@Entity("cart")
export class Cart extends Base {
  @ManyToMany(() => OrderItem, { cascade: true })
  @JoinTable({ name: "cart_items" })
  items: OrderItem[];

  @Column({
    type: "enum",
    enum: CartStatus,
    default: CartStatus.UNORDERED,
  })
  status: CartStatus;

  @OneToMany(() => Order, (o) => o.cart, { cascade: true })
  orders: Order[];

  @ManyToOne(() => User)
  user: User;
}

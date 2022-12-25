import { Column, Entity, ManyToOne } from "typeorm";
import { Base } from "./Base";
import { Item } from "./Item";
import { Order } from "./Order";
import { Restaurant } from "./Restaurant";

@Entity("order_item")
export class OrderItem extends Base {
  @ManyToOne(() => Item)
  item: Item;

  @Column({ default: 1 })
  quantity: number;

  @ManyToOne(() => Order, { onDelete: "CASCADE" })
  order: Order;

  @ManyToOne(() => Restaurant)
  restaurant: Restaurant;
}

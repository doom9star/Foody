import { Column, Entity, ManyToOne, OneToMany } from "typeorm";
import { Base } from "./Base";
import { Item } from "./Item";
import { Restaurant } from "./Restaurant";

@Entity("category")
export class Category extends Base {
  @Column()
  name: string;

  @OneToMany(() => Item, (i) => i.category, { cascade: true })
  items: Item[];

  @ManyToOne(() => Restaurant, {
    onDelete: "CASCADE",
    orphanedRowAction: "delete",
  })
  restaurant: Restaurant;
}

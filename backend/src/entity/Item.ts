import { Column, Entity, ManyToOne } from "typeorm";
import { Base } from "./Base";
import { Category } from "./Category";

@Entity("item")
export class Item extends Base {
  @Column()
  name: string;

  @Column()
  price: number;

  @ManyToOne(() => Category, {
    onDelete: "CASCADE",
    orphanedRowAction: "delete",
  })
  category: Category;
}

import { Column, Entity, ManyToOne, OneToMany } from "typeorm";
import { MenuType } from "../types";
import { Base } from "./Base";
import { Category } from "./Category";
import { Comment } from "./Comment";
import { User } from "./User";

export enum RestaurantStatus {
  OPEN = "OPEN",
  CLOSED = "CLOSED",
}

@Entity("restaurant")
export class Restaurant extends Base {
  @Column()
  name: string;

  @Column({
    type: "enum",
    enum: MenuType,
    default: MenuType.SINGLE,
  })
  menuType: MenuType;

  @Column("text")
  address: string;

  @Column("simple-array")
  contact: string[];

  @Column("simple-json")
  ratings: number[];

  @Column({
    type: "enum",
    enum: RestaurantStatus,
    default: RestaurantStatus.CLOSED,
  })
  status: RestaurantStatus;

  @OneToMany(() => Category, (c) => c.restaurant, { cascade: true })
  categories: Category[];

  @ManyToOne(() => User, { onDelete: "SET NULL" })
  owner: User;

  @OneToMany(() => Comment, (c) => c.restaurant, { cascade: true })
  comments: Comment[];
}

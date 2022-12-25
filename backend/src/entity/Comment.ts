import { Column, Entity, ManyToOne } from "typeorm";
import { Base } from "./Base";
import { Restaurant } from "./Restaurant";
import { User } from "./User";

@Entity("comment")
export class Comment extends Base {
  @Column("text")
  body: string;

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  commentator: User;

  @ManyToOne(() => Restaurant, { onDelete: "CASCADE" })
  restaurant: Restaurant;
}

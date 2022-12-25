import { Column, Entity, OneToMany } from "typeorm";
import { Base } from "./Base";
import { Restaurant } from "./Restaurant";

@Entity("user")
export class User extends Base {
  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @OneToMany(() => Restaurant, (r) => r.owner)
  restaurants: Restaurant[];
}

export enum MenuType {
  SINGLE = "SINGLE",
  GROUP = "GROUP",
}

export enum CartStatus {
  ORDERED = "ORDERED",
  UNORDERED = "UNORDERED",
}

export enum RestaurantStatus {
  OPEN = "OPEN",
  CLOSED = "CLOSED",
}

export enum OrderStatus {
  ORDERED = "ORDERED",
  PREPARING = "PREPARING",
  DELIVERING = "DELIVERING",
  DELIVERED = "DELIVERED",
}

interface ICommon {
  id: number;
  createdAt: string;
  updatedAt: string;
}

export interface IUser extends ICommon {
  name: string;
  email: string;
}

export interface IRestaurant extends ICommon {
  owner: IUser;
  name: string;
  address: string;
  ratings: number[];
  contact: string[];
  menuType: MenuType;
  comments: IComment[];
  categories: ICategory[];
  status: RestaurantStatus;
}

export interface ICategory extends ICommon {
  name: string;
  items: IItem[];
}

export interface IItem extends ICommon {
  name: string;
  price: number;
}

export interface IComment extends ICommon {
  body: string;
  commentator: IUser;
  restaurant: IRestaurant;
}

export interface ICart extends ICommon {
  status: CartStatus;
  items: IOrderItem[];
  orders: IOrder[];
}

export interface IOrder extends ICommon {
  user: IUser;
  status: OrderStatus;
  items: IOrderItem[];
  restaurant: IRestaurant;
}

export interface IOrderItem extends ICommon {
  item: IItem;
  quantity: number;
  restaurant: IRestaurant;
}

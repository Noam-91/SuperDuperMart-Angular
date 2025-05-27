import {IProduct, IProductInternal} from "./IProduct";

export default interface IOrder{
  orderId: number,
  userId: number,
  status: OrderStatus,
  createdAt: Date,
  updatedAt: Date,
  products: IProduct[],
  totalQuantity: number,
  totalPrice: number
}

export interface IOrderInternal extends IOrder{
  products: IProductInternal[]
}

type OrderStatus = 'PROCESSING' | 'COMPLETED' | 'CANCELLED';

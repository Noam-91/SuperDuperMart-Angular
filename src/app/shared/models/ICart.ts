import {IProduct} from "./IProduct";

export default interface ICart{
  userId: number,
  products: IProduct[]
}


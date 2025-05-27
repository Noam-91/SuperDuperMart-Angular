import {ICategory, ICategoryInternal} from "./ICategory";
import IInventory from "./IInventory";

export interface IProduct{
  productId: number;
  name: string;
  description: string;
  priceRetail: number;
  imageUrl: string;
  inventory: IInventory
  category: ICategory;
  quantity?:number;
}
export interface IProductInternal extends IProduct{
  isActive?: boolean;
  priceWholesale: number;
  createdAt?: Date;
  updatedAt?: Date;
  createdBy?: number;
  updatedBy?: number;
  category: ICategoryInternal
  stats?: {
    profit: number,
    sales: number
  }
}

import {IProduct, IProductInternal} from "./IProduct";

export default interface IWatchlist{
  watchlistId: number,
  userId: number,
  name: string,
  updatedAt: Date,
  products: IProduct[]
}

export interface IWatchlistInternal extends IWatchlist{
  isActive: boolean,
  products: IProductInternal[]
}

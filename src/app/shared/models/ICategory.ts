export interface ICategory{
  categoryId: number;
  name: string;
}
export interface ICategoryInternal extends ICategory{
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  createdBy: number;
  updatedBy: number;
}

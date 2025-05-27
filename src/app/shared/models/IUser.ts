export default interface IUser{
  username: string,
  password: string,
  email: string,
  firstName?: string,
  lastName?: string,
  address?: string,
  city?: string,
  state?: string,
  country?: string,
  zip?: string,
}
export interface IUserSimple{
  userId: number,
  userRole: string
}
export type UserRole = "ADMIN" | "CLIENT" | "ANONYMOUS";

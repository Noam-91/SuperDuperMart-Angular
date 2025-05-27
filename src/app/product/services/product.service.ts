import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject, Observable, Subject, tap} from "rxjs";
import {IProduct, IProductInternal} from "../../shared/models/IProduct";
import {environment} from "../../../environments/environment";
import {ICategoryInternal} from "../../shared/models/ICategory";

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http:HttpClient) { }

  getAllInStock():Observable<IProduct[]>{
    return this.http.get<IProduct[]>(`${environment.apiUrl}/products/all`,{withCredentials:true});
  }

  getProductById(id:number):Observable<IProduct>{
    return this.http.get<IProduct>(`${environment.apiUrl}/products/${id}`, {withCredentials:true});
  }

  /** Internal api */
  getAllProductsInternal():Observable<IProductInternal[]>{
    return this.http.get<IProductInternal[]>(`${environment.apiUrl}/internal/products/all`, {withCredentials:true});
  }

  /** Internal api */
  getProductByIdInternal(id:number):Observable<IProductInternal>{
    return this.http.get<IProductInternal>(`${environment.apiUrl}/internal/products/${id}`, {withCredentials:true});
  }

  /** Internal api */
  updateProductInternal(product:IProductInternal):Observable<IProductInternal>{
    return this.http.patch<IProductInternal>(`${environment.apiUrl}/internal/products/update/${product.productId}`, product, {withCredentials:true});
  }

  /** Internal api */
  createProductInternal(product:IProductInternal):Observable<IProductInternal>{
    return this.http.post<IProductInternal>(`${environment.apiUrl}/internal/products/create`, product, {withCredentials:true});
  }

  /** Internal api */
  getAllCategoriesInternal():Observable<ICategoryInternal[]>{
    return this.http.get<ICategoryInternal[]>(`${environment.apiUrl}/internal/products/allCategories`,  {withCredentials:true});
  }

}

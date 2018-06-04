import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {IProduct} from '../interfaces/i-product';

@Injectable()
export class ProductsService {
  productsUrl = 'http://localhost:3000/products';
  private _products: BehaviorSubject<IProduct[]>;
  constructor(private http: HttpClient) {
    this._products = new BehaviorSubject([]);
  }

  get products(): BehaviorSubject<IProduct[]> {
    return this._products;
  }

  getAllProducts(): Promise<any> {
    return this.http.get(this.productsUrl)
      .toPromise()
      .then((result: IProduct[]) => {
        this._products.next(result);
        return result;
      });
  }

  getProductById(productId: string) {
    return this.http.get(this.productsUrl + '/' + productId);

  }

  createProduct(product: IProduct) {
    return this.http.post(this.productsUrl, product)
      .toPromise()
      .then(() => {
        this.getAllProducts();
      });
  }

  updateProduct(product: IProduct) {
    return this.http.put(this.productsUrl + '/' + product.id, product).toPromise()
      .then(() => {
        this.getAllProducts();
      });
  }

  deleteProductById(productId: string) {
    return this.http.delete(this.productsUrl + '/' + productId);
  }
}


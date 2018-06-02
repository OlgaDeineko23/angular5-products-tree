import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Injectable()
export class ProductsService {
  productsUrl = 'http://localhost:3000/products';
  constructor(private http: HttpClient) { }

  getAllProducts() {
    return this.http.get(this.productsUrl);
  }

  getProductById(productId: string) {
    return this.http.get(this.productsUrl + '/' + productId);

  }

  createProduct(product) {
    return this.http.post(this.productsUrl, product);
  }

  updateProduct(product){
    return this.http.put(this.productsUrl + '/' + product.id, product);
  }

  deleteProductById(productId: string) {
    return this.http.delete(this.productsUrl + '/' + productId);
  }
}


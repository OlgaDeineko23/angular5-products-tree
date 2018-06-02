import {Component, OnDestroy, OnInit} from '@angular/core';
import {ProductsService} from '../services/products.service';
import {AnonymousSubscription} from 'rxjs/Subscription';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit, OnDestroy {
  products: any;
  private _productsSub: AnonymousSubscription;

  constructor(private $Products: ProductsService) {
  }

  ngOnInit() {
    this._productsSub = this.$Products.getAllProducts().subscribe(res => {
      this.products = res;
      this.products.forEach(product => {
        if (product.expanded === false) {
          this.products.filter(item => item.id === product.parentId)[0].weight += product.weight;
        } else if (product.parentId !== 1) {
          product.weight = this.products.filter(item => item.parentId === product.id).reduce((prev, curr) => {
            return prev + curr.weight;
          }, 0);
        }
      });
      this.products.forEach(product => {
        if (product.expanded && product.parentId === 1) {
            this.products.filter(item => item.id === product.id)[0].weight = this.products
              .filter(item => item.parentId === product.id).reduce((prev, curr) => {
              return prev + curr.weight;
            }, 0);
        }
      });
      this.products.forEach(product => {
        if (product.expanded && product.id === 1) {
            product.weight = this.products.filter(item => item.parentId === product.id).reduce((prev, curr) => {
              return prev + curr.weight;
            }, 0);
        }
      });
      console.log(this.products)
    });
  }

  ngOnDestroy() {
    this._productsSub.unsubscribe();
  }
}

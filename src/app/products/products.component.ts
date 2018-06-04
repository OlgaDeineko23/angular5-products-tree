import {Component, OnDestroy, OnInit} from '@angular/core';
import {ProductsService} from '../services/products.service';
import {AnonymousSubscription} from 'rxjs/Subscription';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import {IProduct} from '../interfaces/i-product';
import {CreateModalComponent} from '../modals/create-modal/create-modal.component';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ORDER_LIST} from '../constants/order-list';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit, OnDestroy {
  products: IProduct[];
  parentArr: number[] = [];

  private _productsSub: AnonymousSubscription;
  orderList = ORDER_LIST;
  order = {
    name: 'WEIGHT_ASC',
    attr: 'weight'
  };

  constructor(private $Products: ProductsService, private $Modal: NgbModal) {
  }

  ngOnInit() {
    this.$Products.getAllProducts();
    this.parentArr = [];
    this._productsSub = this.$Products.products.subscribe(res => {
      if (res.length > 0) {
        this.products = res;
        this.products.forEach(product => {
          if (!product.expanded) {
            if (!this.products.filter(item => item.id === product.parentId)[0].weight) {
              this.products.filter(item => item.id === product.parentId)[0].weight = 0;
              this.products.filter(item => item.id === product.parentId)[0].weight += product.weight;
            } else {
              this.products.filter(item => item.id === product.parentId)[0].weight += product.weight;
            }
            this.parentArr.push(product.parentId);
          }
        });
        while (this.unique(this.parentArr).length > 0) {
          this.calcWeight(this.parentArr, this.products);
        }
        this.addChildToTheCategory(this.products);
        this.setType(this.products);
      }
    });
  }

  unique(arr) {
    let result = [];

    nextItem:
      for (let i = 0; i < arr.length; i++) {
        let str = arr[i];
        for (let j = 0; j < result.length; j++) {
          if (result[j] === str) {
            continue nextItem;
          }
        }
        result.push(str);
      }

    return result;
  }

  calcWeight(parentIdArr, arr) {
    let parentArr = this.unique(parentIdArr);
    this.parentArr = [];
    parentArr.forEach(item => {
      if (item !== 0) {
        arr.filter(i => i.id === item)[0].weight = arr
          .filter(j => j.parentId === item).reduce((prev, curr) => {
            return prev + curr.weight;
          }, 0);
        this.parentArr.push(arr.filter(i => i.id === item)[0].parentId);
      }
    });
  }

  addChildToTheCategory(arr) {
    arr.forEach(item => {
      if (item.expanded) {
        item.children = arr.filter(i => i.parentId === item.id);
        if (item.children[0].children) {
          item.type = 'category';
        } else {
          item.type = 'subcategory';
        }
      } else {
        item.type = 'product';
      }
    });
  }

  setType(arr) {
    arr.forEach(item => {
      if (item.expanded) {
        if (item.children[0].children) {
          item.type = 'category';
        } else {
          item.type = 'subcategory';
        }
      } else {
        item.type = 'product';
      }
    });
  }

  createCategory(product, mode) {
    let idArray = this.products.map(item => item.id);
    let createModal = this.$Modal.open(CreateModalComponent);
    createModal.componentInstance.mode = mode;
    createModal.componentInstance.parent = product;
    createModal.componentInstance.newProductId = Math.max.apply(null, idArray) + 1;
    createModal.result.then((result) => {
      this.$Products.createProduct(result);
    }).catch((error) => {
      console.warn(error);
    });
  }

  changeOrder() {
    if (this.order.name === 'WEIGHT_ASC') {
      this.order = this.orderList[1];
    } else {
      this.order = this.orderList[0];
    }
  }

  ngOnDestroy() {
    this._productsSub.unsubscribe();
  }
}

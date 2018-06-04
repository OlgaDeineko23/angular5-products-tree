import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {CreateModalComponent} from '../../modals/create-modal/create-modal.component';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {AnonymousSubscription} from 'rxjs/Subscription';
import {ProductsService} from '../../services/products.service';
import {IProduct} from '../../interfaces/i-product';
import {ORDER_LIST} from '../../constants/order-list';



@Component({
  selector: 'app-tree',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.scss']
})
export class TreeComponent implements OnInit, OnDestroy {
  @Input() data: IProduct[];
  @Input() order: any;
  products: IProduct[];
  private _productsSub: AnonymousSubscription;
  orderList = ORDER_LIST;
  orderChild = {
    name: 'WEIGHT_DESC',
    attr: 'weight'
  };

  constructor(private $Modal: NgbModal, private $Products: ProductsService) {
  }

  ngOnInit() {
    this._productsSub = this.$Products.products.subscribe(res => {
      this.products = res;
    });
  }

  toggleChildren(node: any) {
    node.visible = !node.visible;

  }

  create(product, mode) {
    let idArray = this.products.map(item => item.id);
    let createModal = this.$Modal.open(CreateModalComponent);
    createModal.componentInstance.mode = mode;
    if (mode === 'changeweight') {
      createModal.componentInstance.product = product;
    } else {
      createModal.componentInstance.parent = product;
      createModal.componentInstance.newProductId = Math.max.apply(null, idArray) + 1;
    }
    createModal.result.then((result) => {
      if (mode === 'changeweight') {
        this.$Products.updateProduct(result);
      } else {
        this.$Products.createProduct(result);
        if (product.type === 'product') {
          let updateParent = product;
          updateParent.expanded = true;
         delete updateParent.type;
         delete updateParent.weight;
          this.$Products.updateProduct(updateParent);
        }
      }
    }).catch((error) => {
      console.warn(error);
    });
  }

  changeOrder() {
    if (this.orderChild.name === 'WEIGHT_ASC') {
      this.orderChild = this.orderList[1];
    } else {
      this.orderChild = this.orderList[0];
    }
  }

  ngOnDestroy() {
    this._productsSub.unsubscribe();
  }
}

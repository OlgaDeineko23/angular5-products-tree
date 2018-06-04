import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {IProduct} from '../../interfaces/i-product';

@Component({
  selector: 'app-create-modal',
  templateUrl: './create-modal.component.html',
  styleUrls: ['./create-modal.component.scss']
})
export class CreateModalComponent implements OnInit {
  createForm: FormGroup;
  mode: string;
  product: IProduct;
  parent: IProduct;
  newProductId: number;

  constructor(public $Modal: NgbActiveModal) {
  }

  ngOnInit() {
    this.createForm = new FormGroup({
      id: new FormControl('', [
        Validators.required
      ]),
      parentId: new FormControl('', [
        Validators.required
      ]),
      title: new FormControl('', [
        Validators.required
      ]),
      weight: new FormControl(0, [
        Validators.required
      ]),
      expanded: new FormControl(false, [
        Validators.required
      ]),
    });

    switch (this.mode) {
      case 'createcategory':
        this.createForm.patchValue(
          {id: this.newProductId, parentId: this.parent.id});
        break;
      case 'createproduct':
        this.createForm.patchValue(
          {id: this.newProductId, parentId: this.parent.id, weight: 0, expanded: false});
        break;
      case 'changeweight':
        this.createForm.patchValue(
          {
            id: this.product.id, parentId: this.product.parentId, title: this.product.title,
            weight: this.product.weight, expanded: this.product.expanded
          });
        break;
    }
  }

  submit() {
    this.$Modal.close(this.createForm.getRawValue());
  }

}

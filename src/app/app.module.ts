import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppComponent } from './app.component';
import { ProductsComponent } from './products/products.component';
import {ProductsService} from './services/products.service';
import { TreeComponent } from './components/tree/tree.component';
import { CreateModalComponent } from './modals/create-modal/create-modal.component';
import { OrderByPipe } from './pipes/order-by.pipe';

@NgModule({
  declarations: [
    AppComponent,
    ProductsComponent,
    TreeComponent,
    CreateModalComponent,
    OrderByPipe
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule.forRoot(),
  ],
  exports: [OrderByPipe],
  providers: [ProductsService],
  entryComponents: [CreateModalComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }

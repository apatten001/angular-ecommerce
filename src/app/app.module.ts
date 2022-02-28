import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { ProductListComponent } from './components/product-list/product-list.component';
// manually put this for the Http client module 
import {HttpClientModule} from '@angular/common/http';
import { ProductService } from './services/product.service';

@NgModule({
  declarations: [
    AppComponent,
    ProductListComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule
  ],
  // allows us to inject that given service into other parts of the application
  providers: [ProductService],
  bootstrap: [AppComponent]
})
export class AppModule { }

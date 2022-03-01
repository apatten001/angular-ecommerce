import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { ProductListComponent } from './components/product-list/product-list.component';
// manually put this for the Http client module 
import {HttpClientModule} from '@angular/common/http';
import { ProductService } from './services/product.service';
import { Routes, RouterModule } from '@angular/router';
import { ProductCategoryMenuComponent } from './components/product-category-menu/product-category-menu.component';


//1.  order of routes important, first match wins
const routes: Routes = [
  {path: 'category/:id', component: ProductListComponent},
  {path: 'category', component: ProductListComponent},
  {path: 'products', component: ProductListComponent},
  {path: '', redirectTo:'/products', pathMatch:'full'},
  {path: '**', redirectTo:'/products', pathMatch:'full'}

] 

@NgModule({
  declarations: [
    AppComponent,
    ProductListComponent,
    ProductCategoryMenuComponent,
    
  ],

  // for routes import RouterModule.forRoot and add the routes you want 
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot(routes)
  ],
  // allows us to inject that given service into other parts of the application
  providers: [ProductService],
  bootstrap: [AppComponent]
})
export class AppModule { }

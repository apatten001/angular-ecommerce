import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/common/product';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  products: Product[] | undefined;
  // inject a product service into this product list component
  constructor(private productService: ProductService) { }

  ngOnInit(): void {

    // this is where i call my listproducts method
    this.listProducts();

  }

  listProducts(){
    this.productService.getProductList().subscribe(
      data => this.products = data);
  }

}

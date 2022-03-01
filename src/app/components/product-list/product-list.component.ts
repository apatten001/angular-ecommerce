import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from 'src/app/common/product';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list-grid.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  products: Product[] | undefined;
  currentCategoryId: number | undefined;

  // inject a product service into this product list component
  // activated route is needed for accessing route parameters
  constructor(private productService: ProductService,
              private route:ActivatedRoute) { }

  ngOnInit(): void {

    this.route.paramMap.subscribe(()=>
    this.listProducts());
    // this is where i call my listproducts method
  }

  listProducts(){
    // check if the id parameter is available
    //route - use the activated route
    // snapshot is the state of the route of the given moment and time
    const hasCategoryId: boolean = this.route.snapshot.paramMap.has("id");

    if (hasCategoryId) {
      // get the id param string(+ in front of number turns it to a string) 
      this.currentCategoryId = +this.route.snapshot.paramMap.get("id");
    }
    else{
      this.currentCategoryId =1;
    }

    this.productService.getProductList(this.currentCategoryId).subscribe(
      data => this.products = data);
  }

}

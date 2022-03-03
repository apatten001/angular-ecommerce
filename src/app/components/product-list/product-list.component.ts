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

  products: Product[] = [];
  currentCategoryId: number = 1;
  previousCategoryId: number =1;
  searchMode: boolean = false;

  thePageNumber: number =1;
  thePageSize:number = 5;
  theTotalElements:number = 0;
  

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
    this.searchMode = this.route.snapshot.paramMap.has('keyword');
    console.log(this.searchMode)

    if (this.searchMode){
      this.handleSearchProducts();
    }else{
    this.handleListProducts();
    }
  }

  handleSearchProducts(){
    // get the heywoord that the user passed in
    const keyword: string = this.route.snapshot.paramMap.get('keyword');

    // now search for products using keyword
    this.productService.searchProducts(keyword).subscribe(
      data => {
        this.products = data;
      }
    )
  }

  handleListProducts(){
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

    // check if we have different category id than the previous
    // Angular will reuse a component if it is currently being viewed

    // if we have different then previous then set the PageNumber back to 1

    if(this.previousCategoryId != this.currentCategoryId){
      this.thePageNumber =1;
    }

    this.previousCategoryId = this.currentCategoryId;
    console.log(`currentCategoryId=${this.currentCategoryId}, thePageNumber=${this.thePageNumber}`)

    this.productService.getProductListPaginate(this.thePageNumber - 1, 
                                               this.thePageSize,
                                               this.currentCategoryId).subscribe(
                                               this.processResult());

  }

  processResult(){
    return (data: any) => {
      this.products = data._embedded.products;
      this.thePageNumber = data.page.number+1;
      this.thePageSize = data.page.size;
      this.theTotalElements = data.page.totalElements;
    }
  }
  updatePageSize(pageSize:number){
    this.thePageSize = pageSize;
    this.thePageNumber =1;
    this.listProducts();
  }

}

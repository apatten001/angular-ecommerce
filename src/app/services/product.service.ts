import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Product } from '../common/product';
import { ProductCategory } from '../common/product-category';

@Injectable({
  providedIn: 'root'
})

export class ProductService {
  


  private baseUrl = 'http://localhost:8080/api/products'
  private categoryUrl = "http://localhost:8080/api/product-category"

  // inject httpCLeint angular injects it for us
  constructor(private httpClient: HttpClient ) { }

  getProductList(theCategoryId:number): Observable<Product[]> {

    // need to build url on category id
    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}`

    return this.getProducts(searchUrl);
    
  }

  getProductCategories(): Observable<ProductCategory[]>{

    return this.httpClient.get<GetResponseProductCategory>(this.categoryUrl).pipe(
      map(response => response._embedded.productCategory)
    )
    
  }

  searchProducts(keyword: string): Observable<Product[]> {
    // need to build url based on keyword
    const searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${keyword}`;
    return this.getProducts(searchUrl);

    
  }


  private getProducts(searchUrl: string): Observable<Product[]> {
    return this.httpClient.get<GetResponseProducts>(searchUrl).pipe(
      map(response => response._embedded.products)
    );
  }
}

// unwraps the json from the spring data rest _embedded entry
interface GetResponseProducts{
  _embedded:{
    products: Product[];
  }
}

interface GetResponseProductCategory{
  _embedded:{
    productCategory: ProductCategory[];
  }
}

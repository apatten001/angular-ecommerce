import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Product } from '../common/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private baseUrl = 'http://localhost:8080/api/products'

  // inject httpCLeint angular injects it for us
  constructor(private httpClient: HttpClient ) { }

  getProductList(theCategoryId:number): Observable<Product[]> {

    // need to build url on category id
    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}`

    return this.httpClient.get<GetResponse>(searchUrl).pipe(
      map(response => response._embedded.products)
    )
  }

}

// unwraps the json from the spring data rest _embedded entry
interface GetResponse{
  _embedded:{
    products: Product[];
  }
}

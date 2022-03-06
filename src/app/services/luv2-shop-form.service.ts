import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Luv2ShopFormService {

  constructor() { }

  

  getCreditCardYears(): Observable<number[]>{

    let data:number[]= [];

    const startYear: number = new Date().getFullYear(); 

    const endYear: number = startYear + 10;

    for (let theYear = startYear; theYear <= endYear; theYear++){
      data.push(theYear);
    }

    // this "of" operator wraps an object as an Observable from rxjs
    return of(data);
  }
  getCreditCardMonths(startMonth: number): Observable<number[]>{
    let data:number[]= [];

    // build an array for Month
    // start at current month and loop unitl  
    for (let theMonth = startMonth; theMonth <= 12; theMonth++){
      data.push(theMonth);

      // this "of" operator wraps an object as an Observable from rxjs
      
    }
    return of(data);
  }
}

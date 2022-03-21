import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Country } from '../common/country';
import { State } from '../common/state';

@Injectable({
  providedIn: 'root'
})
export class Luv2ShopFormService {

  private countriesUrl = environment.luv2shopApiUrl + "/countries";
  private statesUrl = environment.luv2shopApiUrl + "/states"

  constructor(private httpClient: HttpClient) { }

  getCountries(): Observable<Country[]>{

    return this.httpClient.get<GetResponseCountries>(this.countriesUrl).pipe(
      // import map from rxjs
      map(response => response._embedded.countries)
    );
  }

  getStates(countryCode: string): Observable<State[]>{

    //search Url
    const searchStatesUrl = `${this.statesUrl}/search/findByCountryCode?code=${countryCode}`;

    return this.httpClient.get<GetResponseStates>(searchStatesUrl).pipe(
      map(response => response._embedded.states)
    )
  }

  

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

interface GetResponseCountries{
  _embedded:{
    countries:Country[];
  }
}

interface GetResponseStates{
  _embedded:{
    states:State[];
  }
}

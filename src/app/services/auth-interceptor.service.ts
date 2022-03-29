import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { OktaAuthService } from '@okta/okta-angular';
import { from, Observable, lastValueFrom, firstValueFrom} from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor{

  constructor(private oktaAuth: OktaAuthService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return from(this.handleAccess(request,next));
  }


  private async handleAccess(request: HttpRequest<any>, next: HttpHandler): Promise<HttpEvent<any>>{
    // Only add an access token for secured endppoints
    const theEndpoint = environment.luv2shopApiUrl + '/orders'

    const securedEndpoints = [theEndpoint];

    if (securedEndpoints.some(url => request.urlWithParams.includes(url))){

      // get the access token if matches

      // await waits for the process to finish before proceeding
      const accessToken = await this.oktaAuth.getAccessToken();

      // clone a request and add new header, we clone because request is immutable

      request = request.clone(
        {
          setHeaders:{
            Authorization: "Bearer " + accessToken
          }

        }
      );
    }
    return lastValueFrom(next.handle(request));
  }
}

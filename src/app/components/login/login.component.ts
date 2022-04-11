import { Component, OnInit } from '@angular/core';
import { OktaAuthService } from '@okta/okta-angular';
import * as OktaSignIn from '@okta/okta-signin-widget';

import myAppConfig from "../../config/my-app-config";


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  oktaSignin: any;

  constructor(private oktaAuthService: OktaAuthService) {

    this.oktaSignin = new OktaSignIn({
      logo: 'assets/images/HorshamBags.png',
      features:{registration:true},
      baseUrl: myAppConfig.oidc.issuer.split('/oauth2')[0],
      clientId: myAppConfig.oidc.clientId,
      redirectUri:myAppConfig.oidc.redirectUri,
      authParams:{
        //proof key for code exchange- make use of dynamic secrets to pass info between our app and auth server
        pkce:true,
        issuer: myAppConfig.oidc.issuer, 
        scopes: myAppConfig.oidc.scopes

      }

      }
    );
  }

  ngOnInit(): void {

    // removes any thing from the widget
    this.oktaSignin.remove();

    this.oktaSignin.renderEl({
      // renders the element with the given element id rendered in div tag on login.component.html
      el: "#okta-sign-in-widget"},
      (response) => {
        if (response.status === 'SUCCESS'){
          this.oktaAuthService.signInWithRedirect();
        }
      },
      (error) => {
        throw error;
      }

    )
  }

}

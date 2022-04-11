import { Component, OnInit } from '@angular/core';
import { OktaAuthService } from '@okta/okta-angular';

@Component({
  selector: 'app-login-status',
  templateUrl: './login-status.component.html',
  styleUrls: ['./login-status.component.css']
})
export class LoginStatusComponent implements OnInit {

  isAuthenticated: boolean = false;
  userFullName: String;

  storage: Storage = sessionStorage;

  constructor(private oktaAuthService: OktaAuthService) { }

  ngOnInit(): void {

    // Subscribe to the authentication state changes
    this.oktaAuthService.$authenticationState.subscribe(
      (result) => {
        this.isAuthenticated =result;
        this.getUserDetails();
      }
    )
  }
  getUserDetails() {
    if (this.isAuthenticated){
      // fetch logged in user details

      this.oktaAuthService.getUser().then(
        (result) => {
          this.userFullName =result.name;

          // get users email from response
          const theEmail = result.email;

          // stores the email in browser storage
          this.storage.setItem('userEmail', JSON.stringify(theEmail));




        }
      )
    }
    
  }

  logout(){
    // terminate the session
    this.oktaAuthService.signOut();
  }

}

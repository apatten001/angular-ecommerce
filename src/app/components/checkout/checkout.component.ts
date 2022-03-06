import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Country } from 'src/app/common/country';
import { Luv2ShopFormService } from 'src/app/services/luv2-shop-form.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  checkoutFormGroup: FormGroup;

  totalPrice: number = 0;
  totalQuantity: number = 0;

  creditCardYears: number[]= [];
  creditCardMonths: number[]= [];

  countries: Country[] =[];

  // inject our services
  constructor(private formBuilder: FormBuilder,
              private luv2ShopFormService: Luv2ShopFormService) { }

  ngOnInit(): void {
    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({

        firstName: [""], 
        lastName : [""], 
        email: [""]
      }),

      shippingAddress: this.formBuilder.group({
        street: [""],
        city: [""],
        state: [""],
        country: [""],
        zipCode: [""]
      }), 
      billingAddress: this.formBuilder.group({
        street: [""],
        city: [""],
        state: [""],
        country: [""],
        zipCode: [""]
      }),
      creditCard: this.formBuilder.group({
        cardType: [""],
        nameOnCard: [""],
        cardNumber: [""],
        securityCode: [""],
        expirationMonth: [""],
        expirationYear: [""]
      })
      

    })

    // populate credit card months and years

    // +1 because javascripts months are from 0-11
    const startMonth : number = new Date().getMonth() +1;
    console.log("startMonth: " + startMonth)

    this.luv2ShopFormService.getCreditCardMonths(startMonth).subscribe(
      data => {
        console.log("Retrieved credit cards months: " + JSON.stringify(data))
        this.creditCardMonths = data;
      }
    )

    // populate the countries

    this.luv2ShopFormService.getCountries().subscribe(
      data => {
        console.log("Retrieved countries: " + JSON.stringify(data));
        this.countries = data;
      }
    )

    this.luv2ShopFormService.getCreditCardYears().subscribe(
      data => {
        console.log("Retrieved credit cards Years: " + JSON.stringify(data))
        this.creditCardYears = data;
      }
    )

    
  }

  onSubmit(){
    console.log("Handling the submit button")
    console.log(this.checkoutFormGroup.get('customer').value)
    console.log("The email address is" + this.checkoutFormGroup.get('customer').value.email)
  }

  // copies the shipping address to billing address when checked 
  // else clear all info if unchecked
  copyShippingAddressToBillingAddress(event: any){
    if  ((event.target).checked){
      this.checkoutFormGroup.controls['billingAddress']
      .setValue(this.checkoutFormGroup.controls['shippingAddress'].value)
    } else{
      this.checkoutFormGroup.controls['billingAddress'].reset();
    }

  }

  handleMonthsAndYears(){

    // get the handle to the credit card form group
    const creditCardFormGroup = this.checkoutFormGroup.get("creditCard")

    const currentYear: number = new Date().getFullYear();

    const selectedYear: number = Number(creditCardFormGroup.value.expirationYear) ;

    // if the current year equals selected year?

    let startMonth: number;

    if (currentYear === selectedYear){
      startMonth = new Date().getMonth() + 1;
    }else{
      startMonth =1;
    }

    this.luv2ShopFormService.getCreditCardMonths(startMonth).subscribe(
        data => {
          console.log("Retrieved credit card months: " + JSON.stringify(data))
          this.creditCardMonths = data;
        }
    );
  }

}

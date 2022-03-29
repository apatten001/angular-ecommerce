import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Country } from 'src/app/common/country';
import { Order } from 'src/app/common/order';
import { OrderItem } from 'src/app/common/order-item';
import { PaymentInfo } from 'src/app/common/payment-info';
import { Purchase } from 'src/app/common/purchase';
import { State } from 'src/app/common/state';
import { CartService } from 'src/app/services/cart.service';
import { CheckoutService } from 'src/app/services/checkout.service';
import { Luv2ShopFormService } from 'src/app/services/luv2-shop-form.service';
import { Luv2ShopValidators } from 'src/app/validators/luv2-shop-validators';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  checkoutFormGroup: FormGroup;

  totalPrice: number = 0;
  totalQuantity: number = 0;

  creditCardYears: number[] = [];
  creditCardMonths: number[] = [];

  countries: Country[] = [];

  shippingAddressStates: State[] = [];
  billingAddressStates: State[] = [];

  storage: Storage = sessionStorage;

  // initialize Stripe API
  stripe = Stripe(environment.stripePublishableKey)

  paymentInfo: PaymentInfo = new PaymentInfo();
  cardElement: any;
  displayError: any = "";

  isDisabled: boolean = false;

  // inject our services
  constructor(private formBuilder: FormBuilder,
    private luv2ShopFormService: Luv2ShopFormService,
    private cartService: CartService,
    private checkoutService: CheckoutService,
    private router: Router) { }

  ngOnInit(): void {

    // setup Stripe payment form
    this.setupStripePaymentForm();


    this.reviewCartDetails();

    // read email from browser storage
    const theEmail = JSON.parse(this.storage.getItem('userEmail'));


    this.checkoutFormGroup = this.formBuilder.group({

      // Customer form group
      customer: this.formBuilder.group({

        firstName: new FormControl("", [Validators.required, Validators.minLength(2),
        Luv2ShopValidators.notOnlyWhitespace]),

        lastName: new FormControl("", [Validators.required,
        Validators.minLength(2),
        Luv2ShopValidators.notOnlyWhitespace]),
        email: new FormControl(theEmail, [
          Validators.required,
          // reg expression to check email address pattern
          Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$"),
          Luv2ShopValidators.notOnlyWhitespace
        ])
      }),

      shippingAddress: this.formBuilder.group({
        street: new FormControl("", [Validators.required,
        Validators.minLength(2),
        Luv2ShopValidators.notOnlyWhitespace]),

        city: new FormControl("", [Validators.required,
        Validators.minLength(2),
        Luv2ShopValidators.notOnlyWhitespace]),

        state: new FormControl("", [Validators.required]),

        country: new FormControl("", [Validators.required]),

        zipCode: new FormControl("", [Validators.required,
        Validators.minLength(2),
        Luv2ShopValidators.notOnlyWhitespace])
      }),
      billingAddress: this.formBuilder.group({
        street: new FormControl("", [Validators.required,
        Validators.minLength(2),
        Luv2ShopValidators.notOnlyWhitespace]),

        city: new FormControl("", [Validators.required,
        Validators.minLength(2),
        Luv2ShopValidators.notOnlyWhitespace]),

        state: new FormControl("", [Validators.required]),

        country: new FormControl("", [Validators.required]),

        zipCode: new FormControl("", [Validators.required,
        Validators.minLength(2),
        Luv2ShopValidators.notOnlyWhitespace])
      }),
      creditCard: this.formBuilder.group({

      })


    })

    /*
    // populate credit card months and years

    // +1 because javascripts months are from 0-11
    const startMonth: number = new Date().getMonth() + 1;
    console.log("startMonth: " + startMonth)

    this.luv2ShopFormService.getCreditCardMonths(startMonth).subscribe(
      data => {
        console.log("Retrieved credit cards months: " + JSON.stringify(data))
        this.creditCardMonths = data;
      }
    )

    this.luv2ShopFormService.getCreditCardYears().subscribe(
      data => {
        console.log("Retrieved credit cards Years: " + JSON.stringify(data))
        this.creditCardYears = data;
      }
    )
    **/

    // populate the countries

    this.luv2ShopFormService.getCountries().subscribe(
      data => {
        console.log("Retrieved countries: " + JSON.stringify(data));
        this.countries = data;
      }
    )

  }

  setupStripePaymentForm() {

    // get a handle to stripe elements
    var elements = this.stripe.elements();

    // Create card element and hide zipcode with JSON
    this.cardElement = elements.create('card', { hidePostalCode: true });

    // Add an instance of the card UI component into the card element div in html componenet

    this.cardElement.mount("#card-element");

    // Add event binding for the change event on the card element (Validation etc)
    this.cardElement.on('change', (event) => {

      // get a handle to card errors element
      this.displayError = document.getElementById('card-errors');
      if (event.complete) {
        this.displayError.textError = "";
      } else if (event.error) {
        // show validation error
        this.displayError.textContent = event.error.message;

      }
    })


  }

  reviewCartDetails() {
    // subscribe to the cartService.Quantity;
    this.cartService.totalQuantity.subscribe(
      totalQuantity => this.totalQuantity = totalQuantity
    )

    // subscribe to the cartService.Price;

    this.cartService.totalPrice.subscribe(
      totalPrice => this.totalPrice = totalPrice
    )
  }

  // getter methods for our customer
  get firstName() { return this.checkoutFormGroup.get("customer.firstName") };
  get lastName() { return this.checkoutFormGroup.get("customer.lastName") };
  get email() { return this.checkoutFormGroup.get("customer.email") };

  // getter methods for shipping address
  get shippingAddressStreet() { return this.checkoutFormGroup.get("shippingAddress.street") };
  get shippingAddressCity() { return this.checkoutFormGroup.get("shippingAddress.city") };
  get shippingAddressState() { return this.checkoutFormGroup.get("shippingAddress.state") };
  get shippingAddressCountry() { return this.checkoutFormGroup.get("shippingAddress.country") };
  get shippingAddressZipCode() { return this.checkoutFormGroup.get("shippingAddress.zipCode") };

  // getter methods for billing address
  get billingAddressStreet() { return this.checkoutFormGroup.get("billingAddress.street") };
  get billingAddressCity() { return this.checkoutFormGroup.get("billingAddress.city") };
  get billingAddressState() { return this.checkoutFormGroup.get("billingAddress.state") };
  get billingAddressCountry() { return this.checkoutFormGroup.get("billingAddress.country") };
  get billingAddressZipCode() { return this.checkoutFormGroup.get("billingAddress.zipCode") };

  // getter methods for credit card
  get creditCardType() { return this.checkoutFormGroup.get("creditCard.cardType") };
  get creditNameOnCard() { return this.checkoutFormGroup.get("creditCard.nameOnCard") };
  get creditCardNumber() { return this.checkoutFormGroup.get("creditCard.cardNumber") };
  get creditSecurityCode() { return this.checkoutFormGroup.get("creditCard.securityCode") };



  onSubmit() {
    console.log("Handling the submit button")
    if (this.checkoutFormGroup.invalid) {
      this.checkoutFormGroup.markAllAsTouched();
      return;
    }

    // set up order

    let order = new Order();
    order.totalPrice = this.totalPrice;
    order.totalQuantity = this.totalQuantity;

    // get cart items
    const cartItems = this.cartService.cartItems;

    // create orderItems from cartItems
    let orderItems: OrderItem[] = [] = cartItems.map(item => new OrderItem(item));

    //set up purchase
    let purchase = new Purchase();

    //populate purchase -customer shipping and billing address 

    purchase.customer = this.checkoutFormGroup.controls['customer'].value;


    purchase.shippingAddress = this.checkoutFormGroup.controls['shippingAddress'].value;
    const shippingState: State = JSON.parse(JSON.stringify(purchase.shippingAddress.state))
    const shippingCountry: Country = JSON.parse(JSON.stringify(purchase.shippingAddress.country))
    purchase.shippingAddress.state = shippingState.name
    purchase.shippingAddress.country = shippingCountry.name

    purchase.billingAddress = this.checkoutFormGroup.controls['billingAddress'].value;
    const billingState: State = JSON.parse(JSON.stringify(purchase.billingAddress.state))
    const billingCountry: Country = JSON.parse(JSON.stringify(purchase.billingAddress.country))
    purchase.billingAddress.state = billingState.name
    purchase.billingAddress.country = billingCountry.name

    // populate purchase order and order Items

    purchase.order = order;
    purchase.orderItems = orderItems;

    // compute payment info
    this.paymentInfo.amount = Math.round(this.totalPrice * 100);
    this.paymentInfo.currency = "USD";
    this.paymentInfo.receiptEmail = purchase.customer.email;

    console.log(`this.paymentInfo.amount: ${this.paymentInfo.amount}`)

    //if form valid then 
    // 1. create payment intent 2. confirm card payment 3.place order

    if (!this.checkoutFormGroup.invalid && this.displayError.textContent === "") {

      this.isDisabled =true;

      this.checkoutService.createPaymentIntent(this.paymentInfo).subscribe(
        (paymentIntentResponse) => {
          this.stripe.confirmCardPayment(paymentIntentResponse.client_secret,
            {
              payment_method: {
                card: this.cardElement,
                billing_details:{
                  email: purchase.customer.email,
                  name: `${purchase.customer.firstName} ${purchase.customer.lastName}`,
                  address: {
                    line1:purchase.billingAddress.street,
                    city: purchase.billingAddress.city, 
                    state: purchase.billingAddress.state,
                    postal_code: purchase.billingAddress.zipCode,
                    country: this.billingAddressCountry.value.countryCode
                  }
                }
              }
              // had to add this with type annotation
            }, {handleActions: false}).then(function(this: any, result){

              if (result.error){
                // inform customer of the error
                alert(`There was an error: ${result.error.message}`);
                this.isDisabled = false;
              } else{
                //call REST API via CheckoutService
                this.checkoutService.placeOrder(purchase).subscribe({

                  next: response =>{
                    alert(`Your order had been received.\nOrder tracking number: ${response.orderTrackingNumber} `);

                    // reset cart
                    this.resetCart();
                    this.isDisabled = false;

                    

                  },
                  error : err => {
                    alert(`There was an error: ${err.message}`);
                    this.isDisabled = false;
                  }
                })
              }
            }.bind(this));
        }
      );

    } else{
      this.checkoutFormGroup.markAllAsTouched();
    }
  
  }

  
  resetCart() {
    // reset cart data and form data
    this.cartService.cartItems = [];
    this.cartService.totalPrice.next(0);
    this.cartService.totalQuantity.next(0);
    this.cartService.persistCartItems();

    this.checkoutFormGroup.reset();


    // go back to cart page
    this.router.navigateByUrl("/products");
  }

  // copies the shipping address to billing address when checked 
  // else clear all info if unchecked
  copyShippingAddressToBillingAddress(event: any) {
    if ((event.target).checked) {
      this.checkoutFormGroup.controls['billingAddress']
        .setValue(this.checkoutFormGroup.controls['shippingAddress'].value)
      //bug fix 
      this.billingAddressStates = this.shippingAddressStates;
    } else {
      this.checkoutFormGroup.controls['billingAddress'].reset();

      // bug fix for states
      this.billingAddressStates = [];
    }

  }

  handleMonthsAndYears() {

    // get the handle to the credit card form group
    const creditCardFormGroup = this.checkoutFormGroup.get("creditCard")

    const currentYear: number = new Date().getFullYear();

    const selectedYear: number = Number(creditCardFormGroup.value.expirationYear);

    // if the current year equals selected year?

    let startMonth: number;

    if (currentYear === selectedYear) {
      startMonth = new Date().getMonth() + 1;
    } else {
      startMonth = 1;
    }

    this.luv2ShopFormService.getCreditCardMonths(startMonth).subscribe(
      data => {
        console.log("Retrieved credit card months: " + JSON.stringify(data))
        this.creditCardMonths = data;
      }
    );
  }


  getStates(formGroupName: string) {
    const formGroup = this.checkoutFormGroup.get(formGroupName);

    const countryCode = formGroup.value.country.code;
    const countryName = formGroup.value.country.name;

    console.log(`${formGroupName} country code: ${countryCode} `)
    console.log(`${formGroupName} country name: ${countryName} `)

    this.luv2ShopFormService.getStates(countryCode).subscribe(
      data => {

        if (formGroupName === 'shippingAddress') {
          this.shippingAddressStates = data;
        } else {
          this.billingAddressStates = data;
        }

        formGroup.get('state').setValue(data[0]);
      }
    )
  }

}

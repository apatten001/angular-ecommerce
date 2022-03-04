import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { CartItem } from '../common/cart-item';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  cartItems: CartItem[] = [];

  totalPrice: Subject<number> = new Subject<number>();

  totalQuantity: Subject<number> = new Subject<number>();

  constructor() { }

  addToCart(theCartItem: CartItem){

    // check to see if we have item in the cart

    let alreadyInCart: boolean = false;
    let existingCartItem = undefined;

    if(this.cartItems.length > 0){

      // find based on item id
    existingCartItem = this.cartItems.find(tempCartItem => tempCartItem.id === theCartItem.id);

    //check if we found it
    alreadyInCart = (existingCartItem != undefined);
    } 

    if (alreadyInCart){
      existingCartItem.quantity++;
    }else{

      // add item to the array
      this.cartItems.push(theCartItem);
    }

    


    this.computeCartTotals();


  }
  computeCartTotals() {
    let totalPriceValue: number = 0;
    let totalQuantityValue: number = 0;

    for (let cartItem of this.cartItems){
      totalPriceValue += cartItem.quantity *cartItem.unitPrice;
      totalQuantityValue += cartItem.quantity;

    }

    // publish the new values... all subscribers will receive the new data
    // .next() publishes or sends the event to all subscribers
    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalQuantityValue)

    // log cart data
    this.logCartData(totalPriceValue, totalQuantityValue);
  }
  logCartData(totalPriceValue: number, totalQuantityValue: number) {
    
    for (let cartItem of this.cartItems){
      const subTotalPrice = cartItem.quantity * cartItem.unitPrice;
      console.log(`name ${cartItem.name}, quantity=${cartItem.quantity}, unitPrice ${cartItem.unitPrice}, subTotalPrice ${subTotalPrice}`) 
    }

    // toFixed limits the decimals to two places
    console.log(`totalPrice: ${totalPriceValue.toFixed(2)}, totalQuantity: ${totalQuantityValue}`)
    console.log("---------")

  }
}



import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { CartItem } from '../common/cart-item';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  

  cartItems: CartItem[] = [];

  totalPrice: Subject<number> = new BehaviorSubject<number>(0);

  totalQuantity: Subject<number> = new BehaviorSubject<number>(0);

   // reference to web browser local storage survives browser restarts
  storage: Storage = localStorage;

  // reference to web browser session storage does not survive browser restarts
  // storage: Storage = localStorage;

  constructor() { 
    // read the data from storage
    let data = JSON.parse(this.storage.getItem('cartItems'));

    // 
    if (data != null){
      this.cartItems = data;
    }
    //compute cart totals based on data read from storage
    this.computeCartTotals();
  }

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

    // publish the new values... all subscribers will receive the new data reminds of microservices
    // .next() publishes or sends the event to all subscribers
    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalQuantityValue)

    // persist the cart data
    this.persistCartItems();

    // log cart data
    this.logCartData(totalPriceValue, totalQuantityValue);
  }

  persistCartItems(){
    this.storage.setItem('cartItems', JSON.stringify(this.cartItems));
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

  decrementQuantity(cartItem: CartItem) {
    cartItem.quantity--;

    if (cartItem.quantity === 0){
      this.remove(cartItem)
    } else{
      this.computeCartTotals();
    }
  }
  remove(cartItem: CartItem) {
    // get index of the item in the array

    const itemIndex = this.cartItems.findIndex(tempCartItem => tempCartItem.id === cartItem.id);

    // if item has index splice item from the cartItems array and recompute totals
    if (itemIndex > -1){
      this.cartItems.splice(itemIndex,1)

      this.computeCartTotals();
    }
  }
}



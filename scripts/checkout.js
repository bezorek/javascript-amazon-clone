import { renderOrderSummary } from "./checkout/orderSummary.js";
import { renderPaymentSummary } from "./checkout/paymentSummary.js";
import { renderCheckoutHeader } from "./checkout/checkoutHeader.js";
import { loadProducts } from "../data/products.js";
//import '../data/car.js'
//import '../data/backend-practise.js'
//import '../data/cart-class.js'

loadProducts(() => {
   renderOrderSummary();
   renderPaymentSummary();
   renderCheckoutHeader();
});
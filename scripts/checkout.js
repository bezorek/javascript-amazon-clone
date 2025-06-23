import { renderOrderSummary } from "./checkout/orderSummary.js";
import { renderPaymentSummary } from "./checkout/paymentSummary.js";
import { renderCheckoutHeader } from "./checkout/checkoutHeader.js";

async function loadPage(){
   await renderOrderSummary(); // nie działa
   renderPaymentSummary(); // średnio
   renderCheckoutHeader(); //działa
}
await loadPage();

//import { cart, updateCartQuantity } from "../../data/cart.js";
import { getProduct } from "../../data/products.js";
import {
  getDeliveryOption,
  calculateDeliveryDateToSQL,
} from "../../data/deliveryOptions.js";
import { formatCurrency } from "../utils/money.js";
import { addOrder } from "../../data/orders.js";
import { cart } from "../../data/cart-class.js";

export function renderPaymentSummary() {
  let productPriceCents = 0;
  let shippingPriceCents = 0;

  cart.cartItems.forEach((cartItem) => {
    const product = getProduct(cartItem.productId);
    productPriceCents += product.priceCents * cartItem.quantity;

    const deliveryOption = getDeliveryOption(cartItem.deliveryOptionId);
    shippingPriceCents += deliveryOption.priceCents;
  });

  const totalBeforeTaxCents = productPriceCents + shippingPriceCents;
  const taxCents = totalBeforeTaxCents * 0.1;
  const totalCents = totalBeforeTaxCents + taxCents;
  const paymentSummaryHTML = `
        <div class="payment-summary-title">
                Order Summary
            </div>

            <div class="payment-summary-row">
                <div>Items (${cart.updateCartQuantity()}):</div>
                <div class="payment-summary-money">
                $${formatCurrency(productPriceCents)}
                </div>
            </div>

            <div class="payment-summary-row">
                <div>Shipping &amp; handling:</div>
                <div class="payment-summary-money js-total-shipping-price">
                $${formatCurrency(shippingPriceCents)}
                </div>
            </div>

            <div class="payment-summary-row subtotal-row">
                <div>Total before tax:</div>
                <div class="payment-summary-money">
                $${formatCurrency(totalBeforeTaxCents)}
                </div>
            </div>

            <div class="payment-summary-row">
                <div>Estimated tax (10%):</div>
                <div class="payment-summary-money">
                    $${formatCurrency(taxCents)}
                </div>
            </div>

            <div class="payment-summary-row total-row">
                <div>Order total:</div>
                <div class="payment-summary-money js-total-price">
                    $${formatCurrency(totalCents)}
                </div>
            </div>

            <button class="place-order-button button-primary js-place-order">
                Place your order
            </button>
    `;

  document.querySelector(".js-payment-summary").innerHTML = paymentSummaryHTML;

  document
    .querySelector(".js-place-order")
    .addEventListener("click", async () => {
      if (cart.cartItems.length !== 0) {
        const token = localStorage.getItem("authToken");
        try {
          const response = await fetch("http://localhost:5000/order", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              order_id: crypto.randomUUID(),
              totalValue: formatCurrency(totalCents),
              orderDate: new Date(),

              items: cart.cartItems.map((item) => ({
                product_id: item.productId,
                quantity: item.quantity,
                delivery_date: calculateDeliveryDateToSQL(
                  getDeliveryOption(item.deliveryOptionId)
                ),
              })),
            }),
          });

          if (!response.ok) {
            throw new Error("Nie udało się zapisać zamówienia");
          }

          cart.resetCart();
        } catch (error) {
          console.log("Unexpected error. Try again later.");
        }

        setTimeout(() => {
          window.location.href = "orders.html";
        }, 100);
      }
    });
}

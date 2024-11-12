import { orders } from "../data/orders.js"
import { getProduct, loadProductsFetch } from "../data/products.js";
import formatCurrency from "./utils/money.js";
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';
import { cart } from "../data/cart-class.js";

export async function renderPlacedOrderSummary(){
   await loadProductsFetch();

   let orderSummaryHTML = '';

   orders.forEach((order) => {
      const orderTimeString = dayjs(order.orderTime).format('MMMM D');

      orderSummaryHTML +=`
        <div class="order-container">
          <div class="order-header">
            <div class="order-header-left-section">
              <div class="order-date">
                <div class="order-header-label">Order Placed:</div>
                <div>${orderTimeString}</div>
              </div>
              <div class="order-total">
                <div class="order-header-label">Total:</div>
                <div>$${formatCurrency(order.totalCostCents)}</div>
              </div>
            </div>

            <div class="order-header-right-section">
              <div class="order-header-label">Order ID:</div>
              <div>${order.id}</div>
            </div>
          </div>

          <div class="order-details-grid">
            ${generateItemsHTML(order)}
          </div>
         </div>
      `;
   });
      // zabrac product id z order zeby dotrzec do product id z produktu aby pokazac zdjecie/nazwe
   function generateItemsHTML(order){
      let html = '';
   
      order.products.forEach((item) => {
         const matchingItem = getProduct(item.productId);
   
         html += `
            <div class="product-image-container">
            <img src="${matchingItem.image}">
            </div>
   
            <div class="product-details">
            <div class="product-name">
               ${matchingItem.name}
            </div>
            <div class="product-delivery-date">
               Arriving on: ${dayjs(item.estimatedDeliveryTime).format('MMMM D')}
            </div>
            <div class="product-quantity">
               Quantity: ${item.quantity}
            </div>
            <button class="buy-again-button button-primary js-buy-again-button" data-product-id=${item.productId} data-quantity=${item.quantity}>
               <img class="buy-again-icon" src="images/icons/buy-again.png">
               <span class="buy-again-message">Buy it again</span>
            </button>
            </div>
   
            <div class="product-actions">
            <a href="tracking.html?orderId=${order.id}&productId=${item.productId}">
               <button class="track-package-button button-secondary">
                  Track package
               </button>
            </a>
            </div>
         `;
      });

      return html;
   }
   document.querySelector('.js-orders-grid').innerHTML = orderSummaryHTML;
   document.querySelector('.js-cart-quantity').innerHTML = cart.updateCartQuantity();

   document.querySelectorAll('.js-buy-again-button').forEach((button) => {
      button.addEventListener('click', () => {
         const productId = button.dataset.productId;
         const quantity = button.dataset.quantity;
         cart.addToCart(productId, quantity);
         document.querySelector('.js-cart-quantity').innerHTML = cart.updateCartQuantity();
         button.innerHTML = 'Added';
         setTimeout(() => {
            button.innerHTML = `
            <img class="buy-again-icon" src="images/icons/buy-again.png">
            <span class="buy-again-message">Buy it again</span>
            `
         }, 1000);
      });
   });
}

renderPlacedOrderSummary();
import { getProduct } from "../data/products.js";
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';
import { cart } from "../data/cart-class.js";
import { getOrder } from "../data/orders.js";


function renderTrackingPage(){

   const url = new URL(window.location.href);
   const orderId = url.searchParams.get('orderId');
   const productId = url.searchParams.get('productId');

   const matchingOrder = getOrder(orderId);
   const productDetails = getProduct(productId);
   
   let matchingProduct;

   matchingOrder.products.forEach((product) => {
      if(product.productId === productId){
         matchingProduct = product;
      }
   });

   let currentTime = dayjs();
   const orderTime = dayjs(matchingOrder.orderTime);
   const deliveryTime = dayjs(matchingProduct.estimatedDeliveryTime);
   let passedTime = ((currentTime - orderTime)/(deliveryTime - orderTime))*100;
   const deliveredMessage = currentTime < deliveryTime ? 'Arriving on' : 'Delivered on';

   let html = `
         <a class="back-to-orders-link link-primary" href="orders.html">
          View all orders
        </a>

        <div class="delivery-date">
          ${deliveredMessage} ${dayjs(matchingProduct.estimatedDeliveryTime).format('dddd, MMMM D')}
        </div>

        <div class="product-info">
          ${productDetails.name}
        </div>

        <div class="product-info">
          Quantity: ${matchingProduct.quantity}
        </div>

        <img class="product-image" src="${productDetails.image}">

        <div class="progress-labels-container">
          <div class="progress-label ${passedTime < 50 ? 'current-status' : ''}">
            Preparing
          </div>
          <div class="progress-label ${(passedTime >= 50 && passedTime < 100) ? 'current-status' : ''}">
            Shipped
          </div>
          <div class="progress-label ${passedTime >= 100 ? 'current-status' : ''}">
            Delivered
          </div>
        </div>

        <div class="progress-bar-container">
          <div class="progress-bar js-progress-bar"></div>
        </div>
   `;

   document.querySelector('.js-order-tracking').innerHTML= html;
   document.querySelector('.js-cart-quantity').innerHTML= cart.updateCartQuantity();
   document.querySelector('.js-progress-bar').style.width = `${passedTime}%`;
}

renderTrackingPage();
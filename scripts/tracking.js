import { orders } from "../data/orders.js";
import { loadProductsFetch } from "../data/products.js";
import { getProduct } from "../data/products.js";
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';
import { cart } from "../data/cart-class.js";


async function renderTrackingPage(){
   await loadProductsFetch();

   const url = new URL(window.location.href);
   const orderId = url.searchParams.get('orderId');
   const productId = url.searchParams.get('productId');

   let matchingProduct;
   const productDetails = getProduct(productId);

   orders.forEach((order) =>{
      if(order.id === orderId){
         order.products.forEach((product) => {
            if(product.productId === productId){
               matchingProduct = product;
            }
         });
      }
   });

   let html = `
         <a class="back-to-orders-link link-primary" href="orders.html">
          View all orders
        </a>

        <div class="delivery-date">
          Arriving on ${dayjs(matchingProduct.estimatedDeliveryTime).format('dddd, MMMM D')}
        </div>

        <div class="product-info">
          ${productDetails.name}
        </div>

        <div class="product-info">
          Quantity: ${matchingProduct.quantity}
        </div>

        <img class="product-image" src="${productDetails.image}">

        <div class="progress-labels-container">
          <div class="progress-label">
            Preparing
          </div>
          <div class="progress-label current-status">
            Shipped
          </div>
          <div class="progress-label">
            Delivered
          </div>
        </div>

        <div class="progress-bar-container">
          <div class="progress-bar"></div>
        </div>
   `;

   document.querySelector('.js-order-tracking').innerHTML= html;
   document.querySelector('.js-cart-quantity').innerHTML= cart.updateCartQuantity();
}

renderTrackingPage();
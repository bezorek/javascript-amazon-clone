import { getProduct } from "./products.js";
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';

export let orders = JSON.parse(localStorage.getItem('orders')) || [];

export function addOrder(order) {
   orders.unshift(order);
   saveToStorage();
}

export function getOrder(orderId){
   let matchingOrder;

   orders.forEach((order) =>{
      if(order.id === orderId){
         matchingOrder = order;
      }
   });

   return matchingOrder;
}

function saveToStorage(){
   localStorage.setItem('orders', JSON.stringify(orders));
}

export function removeProductFromOrder(orderId, productId){
   const order = getOrder(orderId);
   const newProducts = [];

   order.products.forEach((product) => {
      if(product.productId !== productId){
         newProducts.push(product);
      }else{
         const deliveryTime = (dayjs(product.estimatedDeliveryTime) - dayjs(order.orderTime))/1000/60/60/24; //przeliczam na dni
         let deliveryPrice = 0
         if(deliveryTime === 3){
            deliveryPrice = 499;
         }else if(deliveryTime === 1){
            deliveryPrice = 999;
         }
         
         let productQuantity = product.quantity;
         const deletedProduct = getProduct(productId);
         const deletedPrice = ((productQuantity * deletedProduct.priceCents + deliveryPrice)*1.1).toFixed(2);
         order.totalCostCents -= deletedPrice;
      }
   });
   order.products = newProducts;

   if(order.products.length !== 0){
      saveToStorage();
   }else{
      const newOrderList = [];
      orders.forEach((order) => {
         if(order.id !== orderId){
            newOrderList.push(order);
         }
      });
      orders = newOrderList;
      saveToStorage();
   }
}
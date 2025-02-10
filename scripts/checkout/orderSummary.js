//import {cart, removeFromCart, updateCartQuantity, updateQuantity, updateDeliveryOption} from '../../data/cart.js';
import {products, getProduct} from '../../data/products.js';
import { formatCurrency } from '../utils/money.js';
import {deliveryOptions, getDeliveryOption, calculateDeliveryDate} from '../../data/deliveryOptions.js';
import { renderPaymentSummary } from './paymentSummary.js';
import { renderCheckoutHeader } from './checkoutHeader.js';
import { cart } from '../../data/cart-class.js';

export function renderOrderSummary(){  
    let cartSummaryHTML = '';
    if(cart.cartItems.length === 0){
        cartSummaryHTML += `
        Your cart is empty.
        <button class="button-primary view-products-button js-view-products-button"> View products </button>
        `
    }
    cart.cartItems.forEach((cartItem) => {
        const productId = cartItem.productId;

        const matchingProduct = getProduct(productId);
        const deliveryOptionId = cartItem.deliveryOptionId;

        const deliveryOption = getDeliveryOption(deliveryOptionId);

        cartSummaryHTML += `
            <div class="cart-item-container js-cart-item-container js-cart-item-container-${matchingProduct.id}">
                <div class="delivery-date">
                    Delivery date: ${calculateDeliveryDate(deliveryOption)}
                </div>

                <div class="cart-item-details-grid">
                    <img class="product-image"
                    src="${matchingProduct.image}">

                    <div class="cart-item-details">
                    <div class="product-name js-product-name-${matchingProduct.id}">
                        ${matchingProduct.name}
                    </div>
                    <div class="product-price js-product-price-${matchingProduct.id}">
                        ${matchingProduct.getPrice()}
                    </div>
                    <div class="delete-quantity-container">
                    <div class="product-quantity js-product-quantity-${matchingProduct.id}">
                        <div class="quantity-buttons-container">
                            <button class="decrease-quantity-button js-decrease-button" data-product-id="${matchingProduct.id}">
                                <div class="js-trash-button-${matchingProduct.id} ${cartItem.quantity === 1 ? 'active' : 'disabled'}">
                                    <i class="fa-solid fa-trash"></i>
                                </div>
                                <div class="js-minus-button-${matchingProduct.id} ${cartItem.quantity !== 1 ? 'active' : 'disabled'}">
                                    <i class="fa-solid fa-minus"></i>
                                </div>
                            </button>
                            <span class="quantity-number js-quantity-number-${matchingProduct.id}">${cartItem.quantity}</span>
                            <button class="increase-quantity-button js-increase-button" data-product-id="${matchingProduct.id}">
                                <i class="fa-solid fa-plus"></i>
                            </button>
                        </div>
<!-- ADDED NEW FEATURE SO THIS ONE I LEGACY
                        <span>
                        Quantity: <span class="quantity-label js-quantity-label-${matchingProduct.id}">${cartItem.quantity}</span>
                        </span>
                        <span class="update-quantity-link link-primary js-update-quantity-link" data-product-id="${matchingProduct.id}">
                        Update
                        </span>
                        <input class="quantity-input js-quantity-input-${matchingProduct.id}" data-product-id="${matchingProduct.id}">
                        <span class="save-quantity-link link-primary js-save-quantity-link" data-product-id="${matchingProduct.id}">
                        Save
                        </span>
-->
                        <span class="delete-quantity-link link-primary js-delete-link js-delete-link-${matchingProduct.id}" data-product-id="${matchingProduct.id}">
                        Delete
                        </span>
                    </div>
                    </div>
                    </div>

                    <div class="delivery-options">
                    <div class="delivery-options-title">
                        Choose a delivery option:
                    </div>
                    ${deliveryOptionsHTML(matchingProduct, cartItem)}
                    </div>
                </div>
            </div>
        `
    });

    function deliveryOptionsHTML(matchingProduct, cartItem){
        let html = '';

        deliveryOptions.forEach((deliveryOption) =>{

            const priceString = deliveryOption.priceCents === 0 ? 'FREE': `$${formatCurrency(deliveryOption.priceCents)} -`;

            const isChecked = deliveryOption.id === cartItem.deliveryOptionId;

            html += 
            `
            <div class="delivery-option js-delivery-option js-delivery-option-${matchingProduct.id}-${deliveryOption.id}" data-product-id="${matchingProduct.id}" data-delivery-option-id="${deliveryOption.id}">
                <input type="radio" ${isChecked ? 'checked' : ''} class="delivery-option-input delivery-option-input-${matchingProduct.id}-${deliveryOption.id}" name="delivery-option-${matchingProduct.id}">
                <div>
                    <div class="delivery-option-date">
                        ${calculateDeliveryDate(deliveryOption)}
                    </div>
                    <div class="delivery-option-price">
                    ${priceString} Shipping
                    </div>
                </div>
            </div>
            `
        });

        return html;
    }

    document.querySelector('.js-order-summary').innerHTML = cartSummaryHTML;

    document.querySelectorAll('.js-delete-link').forEach((link) =>{
        link.addEventListener('click', () =>{
        const productId = link.dataset.productId;
        cart.removeFromCart(productId);

        renderOrderSummary()
        renderPaymentSummary();
        renderCheckoutHeader();
        });
    });

    // document.querySelectorAll('.js-update-quantity-link').forEach((link) =>{
    //     link.addEventListener("click", ()=>{
    //         const productId = link.dataset.productId;
    //         const container = document.querySelector(`.js-cart-item-container-${productId}`);
    //         container.classList.add("is-editing-quantity");
    //     });
    // });

    // function ChangeQuantity(link){
    //     const productId = link.dataset.productId;
    //     const container = document.querySelector(`.js-cart-item-container-${productId}`);
    //     container.classList.remove("is-editing-quantity");

    //     const newQuantity = Number(document.querySelector(`.js-quantity-input-${productId}`).value);
    //     if(newQuantity >0 && newQuantity < 1000){
    //         cart.updateQuantity(productId, newQuantity);
    //         renderCheckoutHeader();
    //         renderOrderSummary();
    //         renderPaymentSummary();
    //     }
    // }

    // document.querySelectorAll(".js-save-quantity-link").forEach((link) =>{
    //     link.addEventListener("click", () => {
    //         ChangeQuantity(link);
    //     });
    // }); 

    // document.querySelectorAll(".quantity-input").forEach((link) => {
    //     link.addEventListener("keydown", (event) => {
    //         if (event.key === "Enter") {
    //             ChangeQuantity(link);
    //         }
    //     });
    // });

    document.querySelectorAll('.js-delivery-option').forEach((element) =>{
        element.addEventListener('click', () => {
            const {productId, deliveryOptionId} = element.dataset;
            cart.updateDeliveryOption(productId, deliveryOptionId);
            renderOrderSummary();
            renderPaymentSummary();
        })
    });

    document.querySelectorAll(".js-view-products-button").forEach((element) => { //dziala ale tylko dla querySelectorAll, powinienem jakos zabezpieczyć czy button jest wygenerownay w html 
        element.addEventListener("click", () => {
            window.location.href = 'amazon.html';
        });    
    })

    document.querySelectorAll('.js-increase-button').forEach((button) =>{
        button.addEventListener("click", () => {
            const productId = button.dataset.productId;
            cart.addToCart(productId, 1);
            renderCheckoutHeader();
            renderOrderSummary();
            renderPaymentSummary();
        });
    });

    document.querySelectorAll('.js-decrease-button').forEach((button) => {
        button.addEventListener('click', () => { 
            const productId = button.dataset.productId;
            const newQuantity = Number(document.querySelector(`.js-quantity-number-${productId}`).innerHTML)-1;
            if(newQuantity){
                cart.updateQuantity(productId, newQuantity)
                renderCheckoutHeader();
                renderOrderSummary();
                renderPaymentSummary();
            }else{
                cart.removeFromCart(productId);
                renderCheckoutHeader();
                renderOrderSummary();
                renderPaymentSummary();
            }
        });
    });
}
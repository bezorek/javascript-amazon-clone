import { getProducts, filterProducts } from '../data/products.js';
import { cart } from '../data/cart-class.js';

const products = getProducts();
renderProductsGrid(filterProducts(products));

function renderProductsGrid(products) {
    let productsHTML = '';

    products.forEach(product => {
        const quantityOptions = Number(product.quantity) > 0
            ? Array.from({ length: Number(product.quantity) }, (_, i) => `
                <option${i === 0 ? ' selected' : ''}>${i + 1}</option>
            `).join('')
            : '<option disabled selected>Brak</option>';


        productsHTML += `
            <div class="product-container">
                <div class="product-image-container">
                    <img class="product-image" src="${product.image}">
                </div>

                <div class="product-name limit-text-to-2-lines">
                    ${product.name}
                </div>

                <div class="product-price">
                    ${product.getPrice()}
                </div>

                <div class="product-quantity-container">
                    <select class="quantity-select js-select-value-${product.id}">
                        ${quantityOptions}
                    </select>
                </div>

                <div class="product-spacer"></div>

                <div class="added-to-cart">
                    <img src="images/icons/checkmark.png">
                    Dodano do koszyka
                </div>

                <button class="add-to-cart-button button-primary js-add-to-cart"
                        data-product-id="${product.id}">
                    Dodaj do koszyka
                </button>

                ${product.extraInfoHTML()}
            </div>
        `;
    });

    document.querySelector('.js-products-grid').innerHTML = productsHTML;

    document.querySelectorAll('.js-add-to-cart').forEach((button) => {
        button.addEventListener('click', () => {
            const productId = button.dataset.productId;
            const select = document.querySelector(`.js-select-value-${productId}`);
            if (select.value === 'Brak'){
                return;
            }
            const selectedValue = Number(select?.value ?? 1);
            cart.addToCart(productId, selectedValue);
            document.querySelector('.js-cart-quantity').innerHTML = cart.updateCartQuantity();
        });
    });

    document.querySelector('.js-cart-quantity').innerHTML = cart.updateCartQuantity();

    document.querySelector('.js-search-button').addEventListener('click', () => {
        const search = document.querySelector('.js-search-bar').value;
        window.location.href = `amazon.html?search=${search}`;
    });

    document.querySelector('.js-search-bar').addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        const search = document.querySelector('.js-search-bar').value;
        window.location.href = `amazon.html?search=${search}`;
    }
});
}

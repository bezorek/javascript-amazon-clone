import { Product, Clothing, Appliance } from '../data/products.js';
import { cart } from '../data/cart-class.js';

window.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('http://localhost:5000/products');
        const rawProducts = await response.json();
        
        const products = rawProducts.map(data => {
            const base = {
                id: data.id,
                image: data.image,
                name: data.name,
                rating: { stars: data.stars },
                priceCents: Math.round(data.price * 100),
                keywords: data.keywords
            };
        
            if (data.sizeChartLink) {
                return new Clothing({ ...base, sizeChartLink: data.sizeChartLink });
            } else if (data.instructionsLink || data.warrantyLink) {
                return new Appliance({ ...base, instructionsLink: data.instructionsLink, warrantyLink: data.warrantyLink });
            } else {
                return new Product(base);
            }
        });
      
        const filtered = filterProducts(products);
        renderProductsGrid(filtered);
    } catch (err) {
        console.error('Cannot load products:', err);
    }
});

function filterProducts(products) {
    const url = new URL(window.location.href);
    const search = url.searchParams.get('search');
    if (!search) return products;

    return products.filter(product => {
        const matchName = product.name.toLowerCase().includes(search.toLowerCase());
        const matchKeyword = product.keywords?.some(keyword =>
            keyword.toLowerCase().includes(search.toLowerCase())
        );
        return matchName || matchKeyword;
    });
}

function renderProductsGrid(products) {
    let productsHTML = '';

    products.forEach(product => {
        productsHTML += `
            <div class="product-container">
                <div class="product-image-container">
                    <img class="product-image" src="${product.image}">
                </div>

                <div class="product-name limit-text-to-2-lines">
                    ${product.name}
                </div>

                <div class="product-rating-container">
                    <img class="product-rating-stars" src="${product.getStarsUrl()}">
                    <div class="product-rating-count link-primary">
                        ${product.stars}
                    </div>
                </div>

                <div class="product-price">
                    ${product.getPrice()}
                </div>

                <div class="product-quantity-container">
                    <select class="quantity-select">
                        <option selected>1</option>
                        <option>2</option>
                        <option>3</option>
                        <option>4</option>
                        <option>5</option>
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

    document.querySelectorAll('.js-add-to-cart').forEach((button) => { //use dataset to find product name after clicking 'add to cart' button 
        button.addEventListener('click', () => {
            const productId = button.dataset.productId;
            const selectedValue = Number(document.querySelector(`.js-select-value-${productId}`).value);
            cart.addToCart(productId, selectedValue);
            document.querySelector('.js-cart-quantity').innerHTML = cart.updateCartQuantity();
        });
    });

    document.querySelector('.js-cart-quantity').innerHTML = cart.updateCartQuantity();

    document.querySelector('.js-search-button').addEventListener('click', () => {
        const search = document.querySelector('.js-search-bar').value;
        window.location.href = `amazon.html?search=${search}`;
    });
}

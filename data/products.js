import { formatCurrency } from '../scripts/utils/money.js';

export class Product {
    id;
    image;
    name;
    rating;
    priceCents;
    keywords;
    quantity;   // ← dodane

    constructor(productDetails) {
        this.id         = productDetails.id;
        this.image      = productDetails.image;
        this.name       = productDetails.name;
        this.rating     = productDetails.rating;
        this.priceCents = productDetails.priceCents;
        this.keywords   = productDetails.keywords;
        this.quantity   = productDetails.quantity;  // ← dodane
    }

    getStarsUrl() {
        return `images/ratings/rating-${this.rating.stars * 10}.png`;
    }

    getPrice() {
        return `${formatCurrency(this.priceCents)} zł`;
    }

    extraInfoHTML() {
        return '';
    }

    getProduct() {
      return self;
    }
}

export async function fetchProducts() {
    try {
        const response = await fetch('http://localhost:5000/products')
        const rawProducts = await response.json();
        const products = rawProducts.map(data => {
                  const base = {
                      id: data.id,
                      image: data.image,
                      name: data.name,
                      rating: { stars: data.stars },
                      priceCents: Math.round(data.price * 100),
                      keywords: data.keywords,
                      quantity: data.quantity
                  };

              return new Product(base);
          });

        return products;

    } catch (err) {
        console.error('Cannot load products:', err);
    }
};

export const products = await fetchProducts();

export function getProducts() {
    return products;
}

export function filterProducts(products) {
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

export function getProduct(productId){
  return products.find(p => p.id === productId);
}

//import { addToCart, cart, loadFromStorage, removeFromCart, updateDeliveryOption } from "../../data/cart.js";
import { cart } from "../../data/cart-class.js";

describe('test suite: addToCart' , () => {
    beforeEach(() => { 
        spyOn(localStorage, 'setItem');
    });

    it('adds an existing product to the cart', () =>{
        cart.cartItems = [{
            productId: 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6',
            quantity: 1,
            deliveryOptionId: '1'
        }];

        cart.addToCart('e43638ce-6aa0-4b85-b27f-e1d07eb678c6', 1);
        expect(cart.cartItems.length).toEqual(1);
        expect(localStorage.setItem).toHaveBeenCalledTimes(1);
        expect(localStorage.setItem).toHaveBeenCalledWith('cart', JSON.stringify([{
            productId: 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6',
            quantity: 2,
            deliveryOptionId: '1'
        }]));
        expect(cart.cartItems[0].productId).toEqual('e43638ce-6aa0-4b85-b27f-e1d07eb678c6');
        expect(cart.cartItems[0].quantity).toEqual(2);
    });

    it('adds a new product to the cart', () => {
        cart.cartItems = [];

        cart.addToCart('e43638ce-6aa0-4b85-b27f-e1d07eb678c6', 1);
        expect(cart.cartItems.length).toEqual(1);
        expect(localStorage.setItem).toHaveBeenCalledTimes(1);
        expect(localStorage.setItem).toHaveBeenCalledWith('cart', JSON.stringify([{
            productId: 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6',
            quantity: 1,
            deliveryOptionId: '1'
        }]));
        expect(cart.cartItems[0].productId).toEqual('e43638ce-6aa0-4b85-b27f-e1d07eb678c6');
        expect(cart.cartItems[0].quantity).toEqual(1);
    });
});

describe("test suite: removeFromCart", () => {
    const productId1 = "e43638ce-6aa0-4b85-b27f-e1d07eb678c6";
    const productId2 = "15b6fc6f-327a-4ec4-896f-486349e85a3d";

    beforeEach(() => {
        spyOn(localStorage, 'setItem');
        cart.cartItems = [{
            productId: "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
            quantity: 2,
            deliveryOptionId: '1'
        }, {
            productId: "15b6fc6f-327a-4ec4-896f-486349e85a3d",
            quantity: 1,
            deliveryOptionId: '2'
        }];
    });

    it('removes product from the cart', () => {
        cart.removeFromCart(productId1);
        expect(localStorage.setItem).toHaveBeenCalledTimes(1);
        expect(localStorage.setItem).toHaveBeenCalledWith('cart', JSON.stringify([{
            productId: "15b6fc6f-327a-4ec4-896f-486349e85a3d",
            quantity: 1,
            deliveryOptionId: '2'
        }]));
        expect(cart.cartItems.length).toEqual(1);
        expect(cart.cartItems[0].productId).toEqual(productId2);
    });

    it('removes non existing product from the cart', () => {
        cart.removeFromCart('non_existing_product');
        expect(localStorage.setItem).toHaveBeenCalledTimes(1);
        expect(localStorage.setItem).toHaveBeenCalledWith('cart', JSON.stringify([{
            productId: "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
            quantity: 2,
            deliveryOptionId: '1'
        }, {
            productId: "15b6fc6f-327a-4ec4-896f-486349e85a3d",
            quantity: 1,
            deliveryOptionId: '2'
        }]));
        expect(cart.cartItems.length).toEqual(2);
        expect(cart.cartItems[0].productId).toEqual(productId1);
        expect(cart.cartItems[1].productId).toEqual(productId2);

    });
});

describe('test suite: updateDeliveryOption', () => {
    const productId1 = "e43638ce-6aa0-4b85-b27f-e1d07eb678c6";
    const productId2 = "15b6fc6f-327a-4ec4-896f-486349e85a3d";
    beforeEach(() => {     
        spyOn(localStorage, 'setItem');
        cart.cartItems = [{
            productId: "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
            quantity: 2,
            deliveryOptionId: '1'
        }, {
            productId: "15b6fc6f-327a-4ec4-896f-486349e85a3d",
            quantity: 1,
            deliveryOptionId: '2'
        }];
    });

    it('updates the delivery option', () => {
        cart.updateDeliveryOption(productId1, '3');
        expect(cart.cartItems[0].productId).toEqual(productId1);
        expect(cart.cartItems[0].quantity).toEqual(2);
        expect(cart.cartItems[0].deliveryOptionId).toEqual('3');
        expect(cart.cartItems.length).toEqual(2);

        expect(localStorage.setItem).toHaveBeenCalledTimes(1);
        expect(localStorage.setItem).toHaveBeenCalledWith('cart', JSON.stringify([{
            productId: "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
            quantity: 2,
            deliveryOptionId: '3'
        }, {
            productId: "15b6fc6f-327a-4ec4-896f-486349e85a3d",
            quantity: 1,
            deliveryOptionId: '2'
        }]));
    });

    it('updates delivery option of non existing product', () => {
        cart.updateDeliveryOption('no_existing_product', '2');
        expect(cart.cartItems.length).toEqual(2);
        expect(cart.cartItems[0].productId).toEqual(productId1);
        expect(cart.cartItems[0].quantity).toEqual(2);
        expect(cart.cartItems[0].deliveryOptionId).toEqual('1');
        expect(localStorage.setItem).toHaveBeenCalledTimes(0);

    });

    it('updates product delivery option with non existing delivery option', () => {
        cart.updateDeliveryOption(productId1, '4');
        expect(cart.cartItems.length).toEqual(2);
        expect(cart.cartItems[0].productId).toEqual(productId1);
        expect(cart.cartItems[0].quantity).toEqual(2);
        expect(cart.cartItems[0].deliveryOptionId).toEqual('1');
        expect(localStorage.setItem).toHaveBeenCalledTimes(0);

    });
});
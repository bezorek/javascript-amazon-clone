class Cart{
    cartItems; //public property
    #localStorageKey; //private property

    constructor(localStorageKey){
        this.#localStorageKey = localStorageKey; 
        this.#loadFromStorage();
    }
    
    #loadFromStorage() {
        this.cartItems = JSON.parse(localStorage.getItem(this.#localStorageKey));
    
        if(!this.cartItems){
            this.cartItems = [{
                productId: "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
                quantity: 2,
                deliveryOptionId: '1'
            }, {
                productId: "15b6fc6f-327a-4ec4-896f-486349e85a3d",
                quantity: 1,
                deliveryOptionId: '2'
            }];
        }
    }

    saveToStorage(){
        localStorage.setItem(this.#localStorageKey, JSON.stringify(this.cartItems));
    }

    addToCart(productId, selectedValue){
        let matchingItem;
        this.cartItems.forEach((cartItem) => {
            if (productId === cartItem.productId){
                matchingItem = cartItem;
            }
        });
        
        if (matchingItem){
            matchingItem.quantity += Number(selectedValue);
        }else{
            this.cartItems.push({
                productId: productId,
                quantity: Number(selectedValue),
                deliveryOptionId: '1'
            });
        }
        this.saveToStorage();
    }

    removeFromCart(productId) {
        const newCart = [];
    
        this.cartItems.forEach((cartItem) => {
            if(cartItem.productId !== productId){
                newCart.push(cartItem);
            }
        });
        this.cartItems = newCart
    
        this.saveToStorage();
    }

    resetCart(){
        this.cartItems = [];
        this.saveToStorage();
    }

    updateDeliveryOption(productId, deliveryOptionId){
        if(deliveryOptionId !== '1' && deliveryOptionId !== '2' && deliveryOptionId !== '3'){
            return;
        }
        let matchingItem;
    
        this.cartItems.forEach((cartItem) => {
            if (productId === cartItem.productId){
                matchingItem = cartItem;
            }
        });
        if(matchingItem){
            matchingItem.deliveryOptionId = deliveryOptionId;
            this.saveToStorage();
        }
    }

    updateCartQuantity(){
        let cartQuantity = 0;
    
        this.cartItems.forEach((cartItem) => {
            cartQuantity += cartItem.quantity;
        });
    
        return cartQuantity;
    }

    updateQuantity(productId, newQuantity){
        //let matchingItem;
    
        this.cartItems.forEach((cartItem) =>{
            if(productId === cartItem.productId){
                //matchingItem = cartItem;
                cartItem.quantity = newQuantity;
            }
        });
        //matchingItem.quantity = newQuantity;
        this.updateCartQuantity();
        this.saveToStorage();
    }

    async loadCartFetch(){
        try{
            const response = await fetch('https://supersimplebackend.dev/cart');
            const data = await response.text();
        }catch(error){

        }
    }

}

export const cart = new Cart('cart');






import { Product, Clothing, Appliance } from "../../data/products.js";


describe('test suite: Product class', () => {
   let product;
   beforeEach(() => {
      product = new Product({
         id: "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
         image: "images/products/athletic-cotton-socks-6-pairs.jpg",
         name: "Black and Gray Athletic Cotton Socks - 6 Pairs",
         rating: {
           stars: 4.5,
           count: 87
         },
         priceCents: 1090,
         keywords: [
           "socks",
           "sports",
           "apparel"
         ]
       });
      });
      
      it('has the correct properties', () => {
         expect(product.id).toEqual("e43638ce-6aa0-4b85-b27f-e1d07eb678c6");
         expect(product.name).toEqual("Black and Gray Athletic Cotton Socks - 6 Pairs");
         expect(product.rating).toEqual({
            stars: 4.5,
            count: 87
         });
         expect(product.priceCents).toEqual(1090);
      });

      it("gets the stars url", () => {
         expect(product.getStarsUrl()).toEqual("images/ratings/rating-45.png")
      });

      it('gets the price', () => {
         expect(product.getPrice()).toEqual('$10.90');
      });

      it('does not diplay extra info', () => {
         expect(product.extraInfoHTML()).toEqual('');
      });
});

describe("test suite: Clothing class", () => {
   let tshirt;
   beforeEach(() => {
      tshirt = new Clothing({
         id: "83d4ca15-0f35-48f5-b7a3-1ea210004f2e",
         image: "images/products/adults-plain-cotton-tshirt-2-pack-teal.jpg",
         name: "Adults Plain Cotton T-Shirt - 2 Pack",
         rating: {
           stars: 4.5,
           count: 56
         },
         priceCents: 799,
         keywords: [
           "tshirts",
           "apparel",
           "mens"
         ],
         type: "clothing",
         sizeChartLink: "images/clothing-size-chart.png"
       });
   });

   it('has the correct properties', () => {
      expect(tshirt.id).toEqual("83d4ca15-0f35-48f5-b7a3-1ea210004f2e");
      expect(tshirt.name).toEqual('Adults Plain Cotton T-Shirt - 2 Pack');
      expect(tshirt.image).toEqual("images/products/adults-plain-cotton-tshirt-2-pack-teal.jpg");
      expect(tshirt.rating).toEqual({
         stars: 4.5,
         count: 56
      });
      expect(tshirt.priceCents).toEqual(799);
   });

   it('gets stars url', () =>{
      expect(tshirt.getStarsUrl()).toEqual("images/ratings/rating-45.png");
   });

   it('gets the price', () => {
      expect(tshirt.getPrice()).toEqual('$7.99')
   });

   it('display extra info', () => {
      expect(tshirt.extraInfoHTML()).toContain(`<a href="images/clothing-size-chart.png" target="_blank">`);
      expect(tshirt.extraInfoHTML()).toContain('Size chart');
   });
});

describe('test suite: Appliance', () => {
   let appliance;
 
   beforeEach(() => {
     appliance = new Appliance({
       id: "54e0eccd-8f36-462b-b68a-8182611d9add",
       image: "images/products/black-2-slot-toaster.jpg",
       name: "2 Slot Toaster - Black",
       rating: {
         stars: 5,
         count: 2197
       },
       priceCents: 1899,
       keywords: [
         "toaster",
         "kitchen",
         "appliances"
       ],
       type: 'appliance',
       instructionsLink: 'images/appliance-instructions.png',
       warrantyLink: 'images/appliance-warranty.png'
     });
   });
 
   it('has the correct properties', () => {
     expect(appliance.id).toEqual('54e0eccd-8f36-462b-b68a-8182611d9add'),
     expect(appliance.image).toEqual('images/products/black-2-slot-toaster.jpg');
 
     expect(appliance.instructionsLink).toEqual('images/appliance-instructions.png');
     expect(appliance.warrantyLink).toEqual('images/appliance-warranty.png');
   });
 
   it('gets the stars url', () => {
     expect(appliance.getStarsUrl()).toEqual('images/ratings/rating-50.png');
   });
 
   it('gets the price', () => {
     expect(appliance.getPrice()).toEqual('$18.99');
   });
 
   it('displays instructions and warranty in extraInfoHTML', () => {
     expect(appliance.extraInfoHTML()).toContain(
       `<a href="images/appliance-instructions.png" target="_blank">`
     );
     expect(appliance.extraInfoHTML()).toContain('Instructions');
 
     expect(appliance.extraInfoHTML()).toContain(
       `<a href="images/appliance-warranty.png" target="_blank">`
     );
     expect(appliance.extraInfoHTML()).toContain('Warranty');
   });
 });


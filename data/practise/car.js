class Car{
   #brand;
   #model;
   speed = 0;
   isTrunkOpen = false;

   constructor(carDetails){
      this.#brand = carDetails.brand;
      this.#model = carDetails.model;
   }

   displayInfo(){
      const trunkStatus = this.isTrunkOpen ? 'open' : 'closed';
      console.log(`${this.#brand} ${this.#model} Speed: ${this.speed} km/h  Trunk: ${trunkStatus}`);
   }

   go() {
      if (!this.isTrunkOpen) {
         this.speed += 5;
       }
  
      // Limit the speed to 200.
      if (this.speed > 200) {
        this.speed = 200;
      }
    }

   brake() {
      this.speed -= 5;
  
      // Limit the speed to 0.
      if (this.speed < 0) {
        this.speed = 0;
      }
   }

   openTrunk(){
      if(this.speed === 0){
         this.isTrunkOpen = true;
      }
   }

   closeTrunk(){
      this.isTrunkOpen = false;
   }
}

const car1 = new Car({
   brand: 'Toyota',
   model: 'Corolla'
});
const car2 = new Car({
   brand: 'Tesla',
   model: 'Model 3'
});

class RaceCar extends Car {
   acceleration;
 
   constructor(carDetails) {
     super(carDetails);
     this.acceleration = carDetails.acceleration;
   }
 
   go() {
     this.speed += this.acceleration;
 
     if (this.speed > 300) {
       this.speed = 300;
     }
   }
 
   openTrunk() {
     console.log('Race cars do not have a trunk.');
   }
 
   closeTrunk() {
     console.log('Race cars do not have a trunk.');
   }
 }

const sportCar = new RaceCar({
   brand: 'McLaren',
   model: 'F1',
   acceleration: 20
});
sportCar.displayInfo();
sportCar.go();
sportCar.displayInfo();
sportCar.openTrunk();
sportCar.displayInfo();
sportCar.brake();
sportCar.displayInfo();

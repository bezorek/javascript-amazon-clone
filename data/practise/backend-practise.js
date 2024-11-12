// const xhr = new XMLHttpRequest();

// xhr.addEventListener('load', () =>{
//    console.log(xhr.response)
// });

// xhr.open('GET','https://supersimplebackend.dev');
// xhr.send();


// const greeting = new XMLHttpRequest();

// greeting.addEventListener('load', () => {
//    console.log(greeting.response);
// });

// greeting.open('GET',"https://supersimplebackend.dev/greeting");
// greeting.send();


// fetch('https://supersimplebackend.dev/greeting')
// .then((response) => {
//    return response.text();
// }).then((response) => {
//    console.log(response);
// })
// async function greeting (){
//    const response = await fetch ("https://supersimplebackend.dev/greeting");
//    const answer = await response.text();
//    console.log(answer);
// }
// greeting();

async function sendName(){
   try{
      const response = await fetch("https://supersimplebackend.dev/greeting", {
         method: 'POST',
         headers: {
            'Content-Type' : 'application/json'
         },
         body: JSON.stringify({
            name: 'Maciej'
         })
      });
      const data = await response.text();
      console.log(data);
   } catch(error) {
      console.log('error elo');
   }
}
//sendName();

async function amazonRequest(){
   try{
      const response = await fetch("https://amazon.com");
      const data = response.json()
   }catch(error){
      console.log('CORS error. Your request was blocked by the backend');
   }
}
//amazonRequest();

async function postName(){
   try{
      const response = await fetch("https://supersimplebackend.dev/greeting", {
         method: 'POST',
         headers: {
            'Content-Type': 'application/json',   
         },
      });

      if(response.status >= 400){
         throw response;
      }

      const data = response.text();
      console.log(response);

   } catch(error){
      if(error.status === 400){
         const errorMessage = await error.json();
         console.log(errorMessage);
      } else{
         console.log('Network error. Please try again later');
      }
   }
}
postName();
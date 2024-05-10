var Shop   = require('../app/models/shop'); 
const mongoose = require('mongoose');


/**
 * This variable stores the logged in user
 */
var loggedUser = {};

/**
 * This function is called when login button is pressed.
 * Note that this does not perform an actual authentication of the user.
 * A student is loaded given the specified email,
 * if it exists, the studentId is used in future calls.
 */
function loadShops() {
    console.log("load shops called");

    const ul = document.getElementById('shops'); 

    ul.textContent = '';

    fetch('../api/v1/shops')
    .then((resp) => resp.json()) // Transform the data into json
    .then(function(data) { // Here you get the data to modify as you please
        
        // console.log(data);
        // Sort the data array alphabetically based on the category names
        data.sort((a, b) => a.name.localeCompare(b.name));
        
        return data.map(function(shop) { // Map through the results and for each run the code below
            
            // let bookId = book.self.substring(book.self.lastIndexOf('/') + 1);
            
            let li = document.createElement('li');
            let span = document.createElement('span');
            // span.innerHTML = `<a href="${book.self}">${book.title}</a>`;
            let a = document.createElement('a');
            a.href = shop.self
            a.textContent = shop.name;
            // span.innerHTML += `<button type="button" onclick="takeBook('${book.self}')">Take the book</button>`
             //let button = document.createElement('button');
            // button.type = 'button'
            // button.onclick = ()=>takeShop(category.self)
            // button.textContent = 'Take the category';
            
            // Append all our elements
            span.appendChild(a);
          //  span.appendChild(button);
            li.appendChild(span);
            ul.appendChild(li);
        })
    })
    .catch( error => console.error(error) );// If there is any error you will catch them here
    
}

function loadCategory() {
    console.log("load category called");
    
    const ul = document.getElementById('categories'); 
   // console.log(Shop);
    ul.textContent = '';
  
//console.log('enumValues: ');
   // console.log(Shop.schema.path('category'));


   /// var categEnum = Shop.schema.path('category').enumValues;
    

    // fetch('../api/v1/shops')
    fetch('../api/v1/shopCategories')
    .then((resp) => resp.json()) // Transform the data into json
    .then(function(data) { // Here you get the data to modify as you please
       // console.log('Enum values:', data);
       // console.log(data);
       // Sort the data array alphabetically based on the category names
        //const categories = new Set(data.map(x => x.category));
        console.log('CatData: ' + data);
        
        //return categories.forEach(function(category) { // Map through the results and for each run the code below
        return data.map(function(category) {  
            // let bookId = book.self.substring(book.self.lastIndexOf('/') + 1);
            console.log('CatCategoryName: ' + category.name);
            let li = document.createElement('li');
            let span = document.createElement('span');
            // span.innerHTML = `<a href="${book.self}">${book.title}</a>`;
            let a = document.createElement('a');
           // a.href = category.self
            a.textContent = category.name;
            // span.innerHTML += `<button type="button" onclick="takeBook('${book.self}')">Take the book</button>`
            let button = document.createElement('button');
            button.type = 'button'
            button.onclick = ()=>searchShopfromCat(category.name);
            button.textContent = 'Search shops';
            
            // Append all our elements
            span.appendChild(a);
            span.appendChild(button);
            li.appendChild(span);
            ul.appendChild(li);
       })
   })

   .catch( error => console.error(error) );// If there is any error you will catch them here
    
}

function searchShopfromCat(category) {
    const ul = document.getElementById('Shops in categories'); 
    // console.log(Shop);
     ul.textContent = '';
    fetch('../api/v1/shops?category=' + category)
    .then((resp) => resp.json()) // Transform the data into json
    .then(function(data) { // 
        console.log("searchShopfromCat called");
        //const shopOfCateg = await Shop.find({data.category: category.name });
        console.log('Data: ' + data);
        
        return data.map(function(shop){
            let li = document.createElement('li');
            let span = document.createElement('span');
         // span.innerHTML = `<a href="${book.self}">${book.title}</a>`;
            let a = document.createElement('a');
       // a.href = category.self
            a.textContent = shop.name + ', ' + shop.address;
        // span.innerHTML += `<button type="button" onclick="takeBook('${book.self}')">Take the book</button>`
        // Append all our elements
            span.appendChild(a);
            li.appendChild(span);
            ul.appendChild(li);
    })
})}

function triggerOnEnter(){
    var input = document.getElementById("shopName");
    console.log("trigger on enter key");

// Execute a function when the user presses a key on the keyboard
    input.addEventListener("keypress", function(event) {
  // If the user presses the "Enter" key on the keyboard
    if (event.key === "Enter") {
    // Cancel the default action, if needed
        event.preventDefault();
    // Trigger the button element with a click
        document.getElementById("searchBtn").click();
  }}, {once: true});
}

function searchShopByName() {           //called 4 times before fetching
    console.log("searchShopByName called");

    const ul = document.getElementById('inputSearch'); 

    ul.textContent = '';
    const userInput = document.getElementById('shopName').value;
    console.log('userInput: ' + userInput);

    fetch('../api/v1/shops?name=' + userInput)
    .then((resp) => resp.json()) // Transform the data into json
    .then(function(data) { // Here you get the data to modify as you please
        console.log('enter func data');
        // console.log(data);
        // Sort the data array alphabetically based on the category names
        data.sort((a, b) => a.name.localeCompare(b.name));
        
        return data.map(function(shop) { // Map through the results and for each run the code below
            console.log('enter return');
            // let bookId = book.self.substring(book.self.lastIndexOf('/') + 1);
            
            let li = document.createElement('li');
            let span = document.createElement('span');
            // span.innerHTML = `<a href="${book.self}">${book.title}</a>`;
            let a = document.createElement('a');
            a.href = shop.self
            a.textContent = shop.name+ ', ' + shop.address;
            // span.innerHTML += `<button type="button" onclick="takeBook('${book.self}')">Take the book</button>`
             //let button = document.createElement('button');
            // button.type = 'button'
            // button.onclick = ()=>takeShop(category.self)
            // button.textContent = 'Take the category';
            
            // Append all our elements
            span.appendChild(a);
          //  span.appendChild(button);
            li.appendChild(span);
            ul.appendChild(li);
        })
    })
    .catch( error => console.error(error) );// If there is any error you will catch them here
    
}
  
//console.log('enumValues: ');
   // console.log(Shop.schema.path('category'));


   /// var categEnum = Shop.schema.path('category').enumValues;
    

    // fetch('../api/v1/shops')
//     fetch('../api/v1/shopCategories')
//     .then((resp) => resp.json()) // Transform the data into json
//     .then(async function(data) { // Here you get the data to modify as you please
//        // console.log('Enum values:', data);
//        // console.log(data);
//        // Sort the data array alphabetically based on the category names
//         //const categories = new Set(data.map(x => x.category));
//        // console.log(data);
//         Shop
//         const shopOfCateg = await Shop.find({ 'name': 'Ghost' }, 'name occupation');
//         //return categories.forEach(function(category) { // Map through the results and for each run the code below
//         return data.map(function(category) {  
//             // let bookId = book.self.substring(book.self.lastIndexOf('/') + 1);
            
//             let li = document.createElement('li');
//             let span = document.createElement('span');
//             // span.innerHTML = `<a href="${book.self}">${book.title}</a>`;
//             let a = document.createElement('a');
//            // a.href = category.self
//             a.textContent = category.name;
//             // span.innerHTML += `<button type="button" onclick="takeBook('${book.self}')">Take the book</button>`
          
            
//             // Append all our elements
//             span.appendChild(a);
            
//             li.appendChild(span);
//             ul.appendChild(li);
//        })
//    })

//    .catch( error => console.error(error) );// If there is any error you will catch them here
    
// }

// // function searchShopfromCat() {
// //     console.log("searchShopfromCat called");

// //     const ul = document.getElementById('categories'); 

// //     ul.textContent = '';

// //     fetch('../api/v1/shops')
// //     .then((resp) => resp.json()) // Transform the data into json
// //     .then(function(data) { // Here you get the data to modify as you please
        
// //         // console.log(data);
// //         // Sort the data array alphabetically based on the category names
// //         const categories = new Set(data.map(x => x.category));
// //         console.log(categories);
        
// //         return categories.forEach(function(category) { // Map through the results and for each run the code below
            
// //             // let bookId = book.self.substring(book.self.lastIndexOf('/') + 1);
            
// //             let li = document.createElement('li');
// //             let span = document.createElement('span');
// //             // span.innerHTML = `<a href="${book.self}">${book.title}</a>`;
// //             let a = document.createElement('a');
// //            // a.href = category.self
// //             a.textContent = category;
// //             // span.innerHTML += `<button type="button" onclick="takeBook('${book.self}')">Take the book</button>`
          
            
// //             // Append all our elements
// //             span.appendChild(a);
            
// //             li.appendChild(span);
// //             ul.appendChild(li);
// //         })
// //     })
// //     .catch( error => console.error(error) );// If there is any error you will catch them here
    
// // }
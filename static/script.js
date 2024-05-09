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
        console.log(data);
        
        //return categories.forEach(function(category) { // Map through the results and for each run the code below
        return data.map(function(category) {  
            // let bookId = book.self.substring(book.self.lastIndexOf('/') + 1);
            
            let li = document.createElement('li');
            let span = document.createElement('span');
            // span.innerHTML = `<a href="${book.self}">${book.title}</a>`;
            let a = document.createElement('a');
           // a.href = category.self
            a.textContent = category.name;
            // span.innerHTML += `<button type="button" onclick="takeBook('${book.self}')">Take the book</button>`
          
            
            // Append all our elements
            span.appendChild(a);
            
            li.appendChild(span);
            ul.appendChild(li);
       })
   })

   .catch( error => console.error(error) );// If there is any error you will catch them here
    
}

// function searchShopfromCat() {
//     console.log("searchShopfromCat called");

//     const ul = document.getElementById('categories'); 

//     ul.textContent = '';

//     fetch('../api/v1/shops')
//     .then((resp) => resp.json()) // Transform the data into json
//     .then(function(data) { // Here you get the data to modify as you please
        
//         // console.log(data);
//         // Sort the data array alphabetically based on the category names
//         const categories = new Set(data.map(x => x.category));
//         console.log(categories);
        
//         return categories.forEach(function(category) { // Map through the results and for each run the code below
            
//             // let bookId = book.self.substring(book.self.lastIndexOf('/') + 1);
            
//             let li = document.createElement('li');
//             let span = document.createElement('span');
//             // span.innerHTML = `<a href="${book.self}">${book.title}</a>`;
//             let a = document.createElement('a');
//            // a.href = category.self
//             a.textContent = category;
//             // span.innerHTML += `<button type="button" onclick="takeBook('${book.self}')">Take the book</button>`
          
            
//             // Append all our elements
//             span.appendChild(a);
            
//             li.appendChild(span);
//             ul.appendChild(li);
//         })
//     })
//     .catch( error => console.error(error) );// If there is any error you will catch them here
    
// }
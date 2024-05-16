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

function viewInformation(shop){
    

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

async function searchShopByName(userInput) {           //called 4 times before fetching
                console.log("searchShopByName called");

    const ul = document.getElementById('inputSearch'); 

    ul.textContent = '';
    let fetchUrl;
    if(userInput === undefined)
        userInput = document.getElementById('shopName').value.toLowerCase();
                console.log('userInput: ' + userInput);
    let isCat = await isCategory(userInput);
                console.log('iscateg value:'+ isCat);
                console.log('isCategory(userInput)==true: ', isCat==true);
    if(isCat==true){
                console.log('fetch category url');
        fetchUrl = '../api/v1/shops?category=' + userInput;
    } else {
                console.log('fetch name url');
                console.log('userinput in fetch name: ',capitalizeFirstLetter(userInput));
        fetchUrl = '../api/v1/shops?name=' + capitalizeFirstLetter(userInput);
    }

    fetch(fetchUrl)
    .then((resp) => resp.json()) // Transform the data into json
    .then(function(data) { // Here you get the data to modify as you please
                console.log('enter func data Searchbyname');
        // console.log(data);
        // Sort the data array alphabetically based on the category names
        data.sort((a, b) => a.name.localeCompare(b.name));
                console.log('before map data: ', data);
        
        return data.map(function(shop) { // Map through the results and for each run the code below
                console.log('enter return');
                console.log('fetched data: ', shop);
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
  //doesnt work multiple fetching
// async function searchShopByName(userInput) {           //called 4 times before fetching
//     console.log("searchShopByName called");

// const ul = document.getElementById('inputSearch'); 

// ul.textContent = '';
// let fetchUrl;
// if(userInput === undefined)
// userInput = document.getElementById('shopName').value.toLowerCase();
//     console.log('userInput: ' + userInput);
//     console.log('typeof userInput: ', typeof(userInput));
// let isCat = await isCategory(userInput);
//     console.log('iscateg value:'+ isCat);
//     console.log('isCategory(userInput)==true: ', isCat==true);
// if(isCat==true){
//     console.log('fetch category url');
//     let urls = userInput.map(function(categ){
//         fetchUrl = '../api/v1/shops?category=' + categ;
//     })
//     console.log('multiple fetch url: ', urls);
// } else {
//     console.log('fetch name url');
//     console.log('userinput in fetch name: ',capitalizeFirstLetter(userInput));
// fetchUrl = '../api/v1/shops?name=' + capitalizeFirstLetter(userInput);
// }

// fetch(fetchUrl)
// .then((resp) => resp.json()) // Transform the data into json
// .then(function(data) { // Here you get the data to modify as you please
//     console.log('enter func data Searchbyname');
// // console.log(data);
// // Sort the data array alphabetically based on the category names
// data.sort((a, b) => a.name.localeCompare(b.name));
//     console.log('before map data: ', data);

// return data.map(function(shop) { // Map through the results and for each run the code below
//     console.log('enter return');
//     console.log('fetched data: ', shop);
//     // let bookId = book.self.substring(book.self.lastIndexOf('/') + 1);

// let li = document.createElement('li');
// let span = document.createElement('span');
// // span.innerHTML = `<a href="${book.self}">${book.title}</a>`;
// let a = document.createElement('a');
// a.href = shop.self
// a.textContent = shop.name+ ', ' + shop.address;
// // span.innerHTML += `<button type="button" onclick="takeBook('${book.self}')">Take the book</button>`
//  //let button = document.createElement('button');
// // button.type = 'button'
// // button.onclick = ()=>takeShop(category.self)
// // button.textContent = 'Take the category';

// // Append all our elements
// span.appendChild(a);
// //  span.appendChild(button);
// li.appendChild(span);
// ul.appendChild(li);
// })
// })
// .catch( error => console.error(error) );// If there is any error you will catch them here

// }
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

async function isCategory(input) {
                console.log('isCategory entered');

    return await fetch('../api/v1/shopCategories')
    .then((resp) => resp.json()) // Transform the data into json
    .then(function(data) { 
       // console.log('isCategory data: ' + data.name);
    //const categories = ['supermercato', 'farmacia', 'abbigliamento', 'ferramenta', 'elettronica', 'ristorazione', 'alimentari', 'sport', 'cartoleria'];

            const category = data.find(categ => categ.name.toLowerCase() == input);
                console.log('CATEGORY EXISTING: ', category);
                console.log('category !== undefined: ', category !== undefined);
        if(category !== undefined){
            return true;
        } else {
            return false;
        }
    })
}
// async function isCategory(input) {
//         console.log('isCategory entered');

//     return await fetch('../api/v1/shopCategories')
//         .then((resp) => resp.json()) // Transform the data into json
//         .then(function(data) { 
//             // console.log('isCategory data: ' + data.name);
//             //const categories = ['supermercato', 'farmacia', 'abbigliamento', 'ferramenta', 'elettronica', 'ristorazione', 'alimentari', 'sport', 'cartoleria'];
//             const category = data.find(categ => categ.name.toLowerCase() == input[0]);
//                     console.log('input[0]: ', input[0]);
//                     console.log('CATEGORY EXISTING: ', category);
//                     console.log('category !== undefined: ', category !== undefined);
//         if(category !== undefined){
//             return true;
//         } else {
//             return false;
//         }
//         })
// }

async function searchShopByProduct() {           //called 4 times before fetching
                console.log("searchShopByProduct called");

    const ul = document.getElementById('inputProductSearch'); 

    ul.textContent = '';

    const categToSearch = await prodCategory();
                console.log('categtosearch: ' + categToSearch);

    searchShopByName(categToSearch);
    
}

async function prodCategory() {           //called 4 times before fetching
                console.log("prodCategory called");

    const ul = document.getElementById('inputProductSearch'); 

    ul.textContent = '';
    
    const userInput = document.getElementById('productName').value.toLowerCase();
                console.log('userInput: ' + userInput);
                console.log('encoded uri userinput: ' + encodeURI(userInput.toLowerCase()));
    
   
    return await fetch('../api/v1/products?name=' + encodeURI(userInput.toLowerCase()))
    .then((resp) => resp.json()) // Transform the data into json
    .then(function(data) { // Here you get the data to modify as you please
        return data.map(prod => prod.category);
             
        })}

function loadProducts() {           //called 4 times before fetching
        console.log("loadProducts called");

        const ul = document.getElementById('productsList'); 

        ul.textContent = '';


    fetch('../api/v1/products')
        .then((resp) => resp.json()) // Transform the data into json
        .then(function(data) { // Here you get the data to modify as you please
        
            data.sort((a, b) => a.name.localeCompare(b.name));
        
            return data.map(function(product) { // Map through the results and for each run the code below
            
            let li = document.createElement('li');
            let span = document.createElement('span');
            // span.innerHTML = `<a href="${book.self}">${book.title}</a>`;
            let a = document.createElement('a');
            a.href = product.self
            a.textContent = product.name;
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
        //console.log('enter func data Searchbyprod');
        // console.log(data);
        // Sort the data array alphabetically based on the category names
       // data.sort((a, b) => a.name.localeCompare(b.name));
        
//         return data.map(function(product) { // Map through the results and for each run the code below
//             //console.log('enter return');
//             // let bookId = book.self.substring(book.self.lastIndexOf('/') + 1);
//             let prodCateg = product.category;
//             let li = document.createElement('li');
//             let span = document.createElement('span');
//             // span.innerHTML = `<a href="${book.self}">${book.title}</a>`;
//             let a = document.createElement('a');
//             a.href = product.self
//             a.textContent = product.name;
//             // span.innerHTML += `<button type="button" onclick="takeBook('${book.self}')">Take the book</button>`
//              //let button = document.createElement('button');
//             // button.type = 'button'
//             // button.onclick = ()=>takeShop(category.self)
//             // button.textContent = 'Take the category';
            
//             // Append all our elements
//             span.appendChild(a);
//           //  span.appendChild(button);
//             li.appendChild(span);
//             ul.appendChild(li);
//         })
//     })
//     .catch( error => console.error(error) );// If there is any error you will catch them here
    
// }
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
var Shop   = require('../app/models/shop'); 
const mongoose = require('mongoose');

var map;
let marker;
var geocoder;
let responseDiv;
let response;

async function importMaps() {
  const { Map } = await google.maps.importLibrary("maps");
}

//initialized map, zoomed on Trento
function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        zoom: 15,
        center: {lat: 46.067546, lng: 11.121488},
        mapTypeControl: false,
    });
   // seeShops();
 // geocoder = new google.maps.Geocoder();
}

//shows on map all shops in database, by retrieving their coordinates from their address
function seeShops() {
    console.log('seeShops called');
    geocoder = new google.maps.Geocoder(); 

    fetch('../api/v1/shops')
        .then((resp) => resp.json()) // Transform the data into json
        .then(function(data) { 
            // Create an array to store promises
            const geocodePromises = [];
            // Iterate over each shop data and create a promise for geocoding
            data.forEach(function(shop) {
                // Create a promise for each geocoding request
                const promise = new Promise((resolve, reject) => {
                    geocode(shop.address, resolve, reject);
                });
                // Push the promise to the array
                geocodePromises.push(promise);
            });
            // Wait for all geocoding promises to resolve
            return Promise.all(geocodePromises);
        })
        .then(function(results) {
            console.log('Results:', results);
          
            results.forEach(function (result){
                console.log('Geocoding completed:', result.address_components);
                console.log('Geocoding completed:', result.geometry.location.lat(), ' ', result.geometry.location.lng());
             

                new google.maps.Marker({
                    position: {lat: result.geometry.location.lat(), lng: result.geometry.location.lng()},
                    map,
                    title: "Hello World!",
                  })}
            )
            // This code will execute after all geocoding requests are complete
             })
            // Do something with the geocoding results
        .catch(function(error) {
            console.error(error);
        });
}

//shows on map a single shop retrieving its coordinates from its address
function seeSingleShop(name) {
    console.log('seeSingleShop called');
    geocoder = new google.maps.Geocoder(); 
    initMap();

    fetch('../api/v1/shops?name=',name)
        .then((resp) => resp.json()) // Transform the data into json
        .then(function(data) { 
            // Create an array to store promises
            const geocodePromises = [];
            // Iterate over each shop data and create a promise for geocoding
            data.forEach(function(shop) {
                // Create a promise for each geocoding request
                const promise = new Promise((resolve, reject) => {
                    geocode(shop.address, resolve, reject);
                });
                // Push the promise to the array
                geocodePromises.push(promise);
            });
            // Wait for all geocoding promises to resolve
            return Promise.all(geocodePromises);
        })
        .then(function(results) {
            console.log('Results:', results);
          
            results.forEach(function (result){
                console.log('Geocoding completed:', result.address_components);
                console.log('Geocoding completed:', result.geometry.location.lat(), ' ', result.geometry.location.lng());
             

                new google.maps.Marker({
                    position: {lat: result.geometry.location.lat(), lng: result.geometry.location.lng()},
                    map,
                    title: "Hello World!",
                  })}
            )
            // This code will execute after all geocoding requests are complete
             })
            // Do something with the geocoding results
        .catch(function(error) {
            console.error(error);
        });
}

//transforms street address in [lat,lng] coordinates
function geocode(request, resolve, reject) {
    console.log('geocoder entered');
    console.log('request: ', request);
    // Geocode the request
    geocoder.geocode({ 'address': request }, function(results, status) {
        if (status == 'OK') {
           // console.log('Geocoding successful, ', results[0].geometry.location.lat.scopes[0].e);
           console.log('Geocoding successful, ', results[0].geometry.location.lat()); 
           // Resolve the promise with the geocoding results
            resolve(results[0]);
        } else {
            console.log('Geocode was not successful for the following reason: ' + status);
            // Reject the promise with the error status
            reject(status);
        }
    });
}

//loads all shops in database and shows them in an unordered list. Activated by button click
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
            //a.href = shop.self
            a.addEventListener('click', function(event) {
                // Prevent the default behavior of following the link
                event.preventDefault();
                viewInformation(shop.name);
            });
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

//displays shop information when shop is clicked. [TO FINISH]
function viewInformation(shop){
    hideMarkers();
    console.log("viewInformation called");
    const ul = document.getElementById('information'); 
    ul.textContent = 'Questo è un testo di prova per mostrare le informazioni del negozio ',shop.name;
    seeSingleShop(shop.name);
}


// function hideMarkers() {
//    // setMapOnAll(null);
//   }

//loads all categories from enum in Shop Mongoose Schema and shows them in an unordered list. 
//By every category name there is a button to show shops belonging to category and products sold in that category
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
            button.textContent = 'Visualizza negozi';

            let button2 = document.createElement('button');
            button2.type = 'button'
            button2.onclick = ()=>searchProdfromCat(category.name);
            button2.textContent = 'Visualizza prodotti';
            
            // Append all our elements
            span.appendChild(a);
            span.appendChild(button);
            span.appendChild(button2);
            li.appendChild(span);
            ul.appendChild(li);
       })
   })

   .catch( error => console.error(error) );// If there is any error you will catch them here
    
}

//shows shops belonging to a specific category
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
            a.addEventListener('click', function(event) {
        // Prevent the default behavior of following the link
            event.preventDefault();
                viewInformation(shop.name);
            });
            a.textContent = shop.name + ', ' + shop.address;
        // span.innerHTML += `<button type="button" onclick="takeBook('${book.self}')">Take the book</button>`
        // Append all our elements
            span.appendChild(a);
            li.appendChild(span);
            ul.appendChild(li);
    })
})
}

//simulates button clicked when pressing enter-key
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

//takes user-input and searches shop by name or by category, displaying the results
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
            //a.href = shop.self
            a.addEventListener('click', function(event) {
                // Prevent the default behavior of following the link
                event.preventDefault();
                viewInformation(shop.name);
            });
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

//capitalizes first letter of a string
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

//checkes whether a user input is a category expressed in enum in Shop Mongoose Schema
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

//searches shop by product user input
async function searchShopByProduct(categToSearch) {           //called 4 times before fetching
                console.log("searchShopByProduct called");

    const ul = document.getElementById('inputProductSearch'); 

    ul.textContent = '';

    if(categToSearch==undefined){
        categToSearch = await prodCategory();
        console.log('categtosearch: ' + categToSearch);
    }

    searchShopByName(categToSearch);
    
}

//fetches products with a specific name and returns their category
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
             
        })
}

//loads and shows all products existing in db
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

//searched a product by pressing a button associated to a specific category.
//Displays all products sold in that category of shops
function searchProdfromCat(category) {
    const ul = document.getElementById('Products in categories'); 
    // console.log(Shop);
     ul.textContent = '';
    fetch('../api/v1/products?category=' + category)
    .then((resp) => resp.json()) // Transform the data into json
    .then(function(data) { // 
        console.log("searchProdfromCat called");
        //const shopOfCateg = await Shop.find({data.category: category.name });
        console.log('Data: ' + data);
        
        return data.map(function(product){
            let li = document.createElement('li');
            let span = document.createElement('span');
         // span.innerHTML = `<a href="${book.self}">${book.title}</a>`;
            let a = document.createElement('a');
           // a.href;
            a.addEventListener('click', function(event) {
                // Prevent the default behavior of following the link
                event.preventDefault();
                console.log('searchProdfromCat: prod cat->', product.category);
                // Call the searchShopByProduct function
                searchShopByProduct(product.category);
            });
            a.textContent = product.name;
        // span.innerHTML += `<button type="button" onclick="takeBook('${book.self}')">Take the book</button>`
        // Append all our elements
            span.appendChild(a);
            li.appendChild(span);
            ul.appendChild(li);
    })
})}

window.initMap = initMap;
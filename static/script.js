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
function login()
{
    //get the form object
    var email = document.getElementById("loginEmail").value;
    var password = document.getElementById("loginPassword").value;
    // console.log(email);

    fetch('../api/v1/authentications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify( { email: email, password: password } ),
    })
    .then((resp) => resp.json()) // Transform the data into json
    .then(function(data) { // Here you get the data to modify as you please
        //console.log(data);
        loggedUser.token = data.token;
        console.log('token: ', loggedUser.token, ' ', data.token);
        loggedUser.email = data.email;
        console.log('email: ', loggedUser.email, ' ', data.email);
        loggedUser.id = data.id;
        console.log('id: ', loggedUser.id, ' ', data.id);
        loggedUser.self = data.self;
        console.log('self: ', loggedUser.self, ' ', data.self);
        // loggedUser.id = loggedUser.self.substring(loggedUser.self.lastIndexOf('/') + 1);
        document.getElementById("loggedUser").textContent = loggedUser.email;
       // loadLendings();
        return;
    })
    .catch( error => console.error(error) ); // If there is any error you will catch them here

};


//This function refresh the list of shops

function loadShops() {

    const ul = document.getElementById('shops'); // Get the list where we will place our authors

    ul.textContent = '';

    fetch('../api/v1/shops')
    .then((resp) => resp.json()) // Transform the data into json
    .then(function(data) { // Here you get the data to modify as you please
        
        // console.log(data);
        
        return data.map(function(shop) { // Map through the results and for each run the code below
            
            // let shopId = shop.self.substring(shop.self.lastIndexOf('/') + 1);
            
            let li = document.createElement('li');
            let span = document.createElement('span');
            // span.innerHTML = `<a href="${shop.self}">${shop.name}</a>`;
            let a = document.createElement('a');
            a.href = shop.self
            a.textContent = shop.name;
            // span.innerHTML += `<button type="button" onclick="takeShop('${shop.self}')">Take the shop</button>`
            let button = document.createElement('button');
            button.type = 'button'
            button.onclick = ()=>takeShop(shop.self)
            button.textContent = 'Add the shop';
            
            // Append all our elements
            span.appendChild(a);
            span.appendChild(button);
            li.appendChild(span);
            ul.appendChild(li);
        })
    })
    .catch( error => console.error(error) );// If there is any error you will catch them here
    
}
loadShops();


/**
 * This function is called by the Take button beside each book.
 * It create a new booklendings resource,
 * given the book and the logged in student
 */
function takeShop(shopUrl)
{
    fetch('../api/v1/booklendings', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': loggedUser.token
        },
        body: JSON.stringify( { utenteBase: loggedUser.self, shop: shopUrl } ),
    })
    .then((resp) => {
        console.log(resp);
      ///  loadLendings();
        return;
    })
    .catch( error => console.error(error) ); // If there is any error you will catch them here

};

/**
/**
 * This function refresh the list of bookLendings.
 * It only load bookLendings given the logged in student.
 * It is called every time a book is taken of when the user login.
 */
/**
function loadShopOwner() {

    const ul = document.getElementById('shopOwners'); // Get the list where we will place our lendings

    ul.innerHTML = '';

    fetch('../api/v1/shop?studentId=' + loggedUser.id + '&token=' + loggedUser.token)
    .then((resp) => resp.json()) // Transform the data into json
    .then(function(data) { // Here you get the data to modify as you please
        
        console.log(data);
        
        return data.map( (entry) => { // Map through the results and for each run the code below
            
            // let shopId = shop.self.substring(book.self.lastIndexOf('/') + 1);
            
            let li = document.createElement('li');
            let span = document.createElement('span');
            // span.innerHTML = `<a href="${entry.self}">${entry.shop}</a>`;
            let a = document.createElement('a');
            a.href = entry.self
            a.textContent = entry.shop;
            
            // Append all our elements
            span.appendChild(a);
            li.appendChild(span);
            ul.appendChild(li);
        })
    })
    .catch( error => console.error(error) );// If there is any error you will catch them here
    
}
 */

/**
 * This function is called by clicking on the "insert book" button.
 * It creates a new book given the specified title,
 * and force the refresh of the whole list of shops.
 */
function insertShop()
{
    //get shop name
    var shopName = document.getElementById("shopName").value;

    console.log(shopName);

    fetch('../api/v1/shops', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify( { name: shopName } ),
    })
    .then((resp) => {
        console.log(resp);
        loadShops();
        return;
    })
    .catch( error => console.error(error) ); // If there is any error you will catch them here

};
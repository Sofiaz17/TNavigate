 // This variable stores the logged in user
var loggedUser = {};

//This function is called when login button is pressed.
function login()
{
    //get the form object
    var email = document.getElementById("loginEmail").value;
    var password = document.getElementById("loginPassword").value;

    fetch('../api/v1/authentications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify( { email: email, password: password } ),
    })
    .then((resp) => resp.json()) // Transform the data into json
    .then(function(data) { 

        loggedUser.token = data.token;
        console.log('token: ', loggedUser.token, ' ', data.token);
        loggedUser.email = data.email;
        console.log('email: ', loggedUser.email, ' ', data.email);
        loggedUser.id = data.id;
        console.log('id: ', loggedUser.id, ' ', data.id);
        loggedUser.self = data.self;
        console.log('self: ', loggedUser.self, ' ', data.self);
        loggedUser.id = loggedUser.self.substring(loggedUser.self.lastIndexOf('/') + 1);
        document.getElementById("loggedUser").textContent = loggedUser.email;
        return;
    })
    .catch( error => console.error(error) ); // If there is any error you will catch them here

};


//This function refresh the list of shops

/*function loadShops() {

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
*/

/**
 * This function is called by the Take button beside each shop.
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
 * This function is called by clicking on the "insert shop" button.
 * It creates a new shop given the specified name,
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

/**
 * Registration:
 * there are two different kinds of registration,
 * one for the user (utenteBase) wanting to find shops in the application
 * and one for the shop owner wanting to insert his shop in the application 
 */
function register(clickId)
{
    console.log('clickId: ', clickId);
    let hideUB = document.getElementById('utenteBase'); 
    let hideNeg = document.getElementById('negoziante'); 

    if(clickId=="utenteBase"){
        hideUB.style.display= 'none'; 
        hideNeg.style.display= 'none'; 

        // Creation of form element
        const form = document.getElementById('form');
        form.setAttribute('method', 'post');
        form.setAttribute('name', 'modulo');

        // Creation of element h1 for the title
        const title = document.createElement('h1');
        title.textContent = 'Registrati:';
        form.appendChild(title);

        // Creation of element label and input for the field 'Nome'
        const labelNome = document.createElement('label');
        labelNome.setAttribute('for', 'nome');
        labelNome.textContent = 'Nome:';
        form.appendChild(labelNome);

        const inputNome = document.createElement('input');
        inputNome.setAttribute('type', 'text');
        inputNome.setAttribute('name', 'nome');
        inputNome.setAttribute('id', 'nome');
        form.appendChild(inputNome);
        form.appendChild(document.createElement('br'));

        // Creation of element label and input for the field 'Cognome'
        const labelCognome = document.createElement('label');
        labelCognome.setAttribute('for', 'cognome');
        labelCognome.textContent = 'Cognome:';
        form.appendChild(labelCognome);

        const inputCognome = document.createElement('input');
        inputCognome.setAttribute('type', 'text');
        inputCognome.setAttribute('name', 'cognome');
        inputCognome.setAttribute('id', 'cognome');
        form.appendChild(inputCognome);
        form.appendChild(document.createElement('br'));

        // Creation of element label and input for the field 'Email'
        const labelEmail = document.createElement('label');
        labelEmail.setAttribute('for', 'email');
        labelEmail.textContent = 'Email:';
        form.appendChild(labelEmail);

        const inputEmail = document.createElement('input');
        inputEmail.setAttribute('type', 'text');
        inputEmail.setAttribute('name', 'email');
        inputEmail.setAttribute('id', 'email');
        form.appendChild(inputEmail);

        // Insert form in HTML page
        document.body.appendChild(form);

            const campi = [
                { label: 'Username', id: 'username', type: 'text' },
                { label: 'Password', id: 'password', type: 'password' },
                { label: 'Conferma Password', id: 'confermaPassword', type: 'password' }
            ];

            // Creation of form fields
            campi.forEach(campo => {
                
                // Creation of element label 
                const label = document.createElement('label');
                label.setAttribute('for', campo.id);
                label.textContent = campo.label + ':';
                form.appendChild(label);

                // Creation of element input 
                const input = document.createElement('input');
                input.setAttribute('type', campo.type);
                input.setAttribute('name', campo.id);
                input.setAttribute('id', campo.id);
                form.appendChild(input);

                // Skip line
                form.appendChild(document.createElement('br'));

            });

            /** 
            // Creazione degli elementi per mostrare/nascondere la password
            const showPasswordCheckbox = createShowPasswordCheckbox('password', 'Mostra Password', 'showPassword()');
            const showConfPasswordCheckbox = createShowPasswordCheckbox('confermaPassword', 'Mostra Password', 'showConfPassword()');

            // Aggiunta degli elementi al form
            form.appendChild(showPasswordCheckbox);
            form.appendChild(document.createElement('br'));
            form.appendChild(showConfPasswordCheckbox);
            form.appendChild(document.createElement('br'));
            form.appendChild(document.createElement('br'));

            // Funzione per creare il checkbox per mostrare/nascondere la password
            function createShowPasswordCheckbox(inputId, labelValue, onclickFunction) {
                const checkbox = document.createElement('input');
                checkbox.setAttribute('type', 'checkbox');
                checkbox.setAttribute('value', labelValue);
                checkbox.setAttribute('onclick', onclickFunction);
                const label = document.createElement('label');
                label.textContent = labelValue;
                const lineBreak = document.createElement('br');
                return [checkbox, label, lineBreak];
            }
            */

            // Creation of elements for reset and send the form
            const resetButton = createButton('reset', 'Reset', 'button2');
            const submitButton = createButton('submit', 'Registra', 'button2');

            // Adding elements to the form
            form.appendChild(resetButton);
            form.appendChild(submitButton);

            // Function to create a button
            function createButton(type, value, className) {
                const button = document.createElement('input');
                button.setAttribute('type', type);
                button.setAttribute('value', value);
                button.setAttribute('class', className);
                return button;
            }

            // Insert form in HTML page
            document.body.appendChild(form);

    } else{
        if(clickId=="negoziante"){
            hideUB.style.display= 'none'; 
            hideNeg.style.display= 'none'; 

            // Creation of form element
            const form = document.getElementById('form');
            form.setAttribute('method', 'post');
            form.setAttribute('name', 'modulo');

            // Creation of element h1 for the title
            const title = document.createElement('h1');
            title.textContent = 'Registrati:';
            form.appendChild(title);

            // Creation of element label and input for the field 'Nome'
            const labelNome = document.createElement('label');
            labelNome.setAttribute('for', 'nome');
            labelNome.textContent = 'Nome:';
            form.appendChild(labelNome);

            const inputNome = document.createElement('input');
            inputNome.setAttribute('type', 'text');
            inputNome.setAttribute('name', 'nome');
            inputNome.setAttribute('id', 'nome');
            form.appendChild(inputNome);
            form.appendChild(document.createElement('br'));

            // Creation of element label and input for the field 'Cognome'
            const labelCognome = document.createElement('label');
            labelCognome.setAttribute('for', 'cognome');
            labelCognome.textContent = 'Cognome:';
            form.appendChild(labelCognome);

            const inputCognome = document.createElement('input');
            inputCognome.setAttribute('type', 'text');
            inputCognome.setAttribute('name', 'cognome');
            inputCognome.setAttribute('id', 'cognome');
            form.appendChild(inputCognome);
            form.appendChild(document.createElement('br'));

            // Creation of element label and input for the field 'Email'
            const labelEmail = document.createElement('label');
            labelEmail.setAttribute('for', 'email');
            labelEmail.textContent = 'Email:';
            form.appendChild(labelEmail);

            const inputEmail = document.createElement('input');
            inputEmail.setAttribute('type', 'text');
            inputEmail.setAttribute('name', 'email');
            inputEmail.setAttribute('id', 'email');
            form.appendChild(inputEmail);

            // Creation of element label and input for the field 'Shop'
            const labelShopName = document.createElement('label');
            labelShopName.setAttribute('for', 'shopName');
            labelShopName.textContent = 'Nome negozio:';
            form.appendChild(labelShopName);

            const inputShopName = document.createElement('input');
            inputShopName.setAttribute('type', 'text');
            inputShopName.setAttribute('name', 'shopName');
            inputShopName.setAttribute('id', 'shopName');
            form.appendChild(inputShopName);

            // Creation of element label and input for the field 'Address'
            const labelAddress = document.createElement('label');
            labelAddress.setAttribute('for', 'address');
            labelAddress.textContent = 'Indirizzo negozio (specificare se Via, Piazza, Strada, etc.):';
            form.appendChild(labelAddress);

            const inputAddress = document.createElement('input');
            inputAddress.setAttribute('type', 'text');
            inputAddress.setAttribute('name', 'address');
            inputAddress.setAttribute('id', 'address');
            form.appendChild(inputAddress);
            
            // Creation of element label and input for the field 'Civico'
            const labelCivico = document.createElement('label');
            labelCivico.setAttribute('for', 'civico');
            labelCivico.textContent = 'Numero civico:';
            form.appendChild(labelCivico);

            const inputCivico = document.createElement('input');
            inputCivico.setAttribute('type', 'number');
            inputCivico.setAttribute('name', 'civico');
            inputCivico.setAttribute('id', 'civico');
            form.appendChild(inputCivico);

            // Creation of element label and input for the field 'cap'
            const labelCap = document.createElement('label');
            labelCap.setAttribute('for', 'cap');
            labelCap.textContent = 'CAP:';
            form.appendChild(labelCap);

            const inputCap = document.createElement('input');
            inputCap.setAttribute('type', 'number');
            inputCap.setAttribute('name', 'civico');
            inputCap.setAttribute('id', 'civico');
            form.appendChild(inputCap);
            
            // Creation of element label and input for the field 'City'
            const labelCity = document.createElement('label');
            labelCity.setAttribute('for', 'city');
            labelCity.textContent = 'Città:';
            form.appendChild(labelCity);

            const inputCity = document.createElement('input');
            inputCity.setAttribute('type', 'text');
            inputCity.setAttribute('name', 'city');
            inputCity.setAttribute('id', 'city');
            form.appendChild(inputCity);
         
            // Creation of element label and input for the field 'Provincia'
            const labelProvincia = document.createElement('label');
            labelProvincia.setAttribute('for', 'provincia');
            labelProvincia.textContent = 'Provincia:';
            form.appendChild(labelProvincia);

            const inputProvincia = document.createElement('input');
            inputProvincia.setAttribute('type', 'text');
            inputProvincia.setAttribute('name', 'provincia');
            inputProvincia.setAttribute('id', 'provincia');
            form.appendChild(inputProvincia);

            const campi = [
                { label: 'Username', id: 'username', type: 'text' },
                { label: 'Password', id: 'password', type: 'password' },
                { label: 'Conferma Password', id: 'confermaPassword', type: 'password' }
            ];

            // Creation of form fields
            campi.forEach(campo => {
                
                // Creation of element label
                const label = document.createElement('label');
                label.setAttribute('for', campo.id);
                label.textContent = campo.label + ':';
                form.appendChild(label);

                // Creation of element input
                const input = document.createElement('input');
                input.setAttribute('type', campo.type);
                input.setAttribute('name', campo.id);
                input.setAttribute('id', campo.id);
                form.appendChild(input);

                // Skip line
                form.appendChild(document.createElement('br'));

            });

            /** 
            // Creazione degli elementi per mostrare/nascondere la password
            const showPasswordCheckbox = createShowPasswordCheckbox('password', 'Mostra Password', 'showPassword()');
            const showConfPasswordCheckbox = createShowPasswordCheckbox('confermaPassword', 'Mostra Password', 'showConfPassword()');

            // Aggiunta degli elementi al form
            form.appendChild(showPasswordCheckbox);
            form.appendChild(document.createElement('br'));
            form.appendChild(showConfPasswordCheckbox);
            form.appendChild(document.createElement('br'));
            form.appendChild(document.createElement('br'));

            // Funzione per creare il checkbox per mostrare/nascondere la password
            function createShowPasswordCheckbox(inputId, labelValue, onclickFunction) {
                const checkbox = document.createElement('input');
                checkbox.setAttribute('type', 'checkbox');
                checkbox.setAttribute('value', labelValue);
                checkbox.setAttribute('onclick', onclickFunction);
                const label = document.createElement('label');
                label.textContent = labelValue;
                const lineBreak = document.createElement('br');
                return [checkbox, label, lineBreak];
            }
            */

            // Creation of elements for reset and send the form
            const resetButton = createButton('reset', 'Reset', 'button2');
            const submitButton = createButton('submit', 'Registra', 'button2');

            // Adding elements to the form
            form.appendChild(resetButton);
            form.appendChild(submitButton);

            /// Function to create a button
            function createButton(type, value, className) {
                const button = document.createElement('input');
                button.setAttribute('type', type);
                button.setAttribute('value', value);
                button.setAttribute('class', className);
                return button;
            }

            // Insert form in HTML page
            document.body.appendChild(form);

        }
    }
};


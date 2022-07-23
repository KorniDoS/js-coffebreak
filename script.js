/*O aplicatie web (poate fi single page) care sa simuleze afisarea unor produse dintr-o cafenea.
Pentru realizarea punctelor de mai jos, se pot folosi: html, css, javascript, typescript, Nodejs, angular, 
react, Express.js, etc.

Din aplicatia respectiva sa se poata face urmatoarele actiuni:
- cautarea unui produs dupa un camp (la alegere) - nume, pret, categorie

- sortarea produselor dupa: nume, pret, comentarii (sau oricare alt camp)

- editarea informatiilor unui produs

- stergerea unui produs din pagina de produse

- adaugarea unui produs nou in lista de produse

- optional: editarea produselor sa se faca dintr-o pagina separata dedicata adminilor
 (pagina poate fi cu/fara autentificare)

Structura unui produs sa fie:
- nume (sa fie completat obligatoriu)
- pret (sa fie completat obligatoriu)
- cantitate (sa fie completat optional. Numeric)
- descriere (sa fie completat optional)
- comentarii (sa fie completat optional. Text pe mai multe randuri )
- rating (sa fie completat optional. Poate fi un dropdown cu valori de la 1 la 5)
- oricare alte campuri

Sugestii de implementare a aplicatiei:
- cateva produse afisate (maxim 4 pe un rand)
- posibilitatea de a selecta din produsele afisate (Ex: prin checkBox; prin click pe produs si incadrarea lui intr-un chenar; oricare alta metoda)
- posibilitatea introducerii unui nume pentru lista de produse selectate
- salvarea listei, impreuna cu produsele selectate

Pentru stocarea, manipularea si salvarea datelor puteti folosi:
- apeluri http catre un server creat local
- baza de date
- fisere JSON
- variabile locale (in-memory)
- oricare alta metoda cunoscuta
*/


const content_container = document.querySelector('.content');
//Content container



//Fetch function - produse.json
const fetchItems = async () => {
    const req = await fetch('./assets/produse.json');
    const res = await req.json();

    const fetched_data = res;
    return new Promise((resolve, reject) => {
        resolve(fetched_data);
        reject('Resource not found.');
    })

}


//Define empty arrays
const products_array = [];

const products_array_copy = [];

const my_list_array = [];


//Product constructor
function Product(id, name, img, price, quantity, rating, description, comments) {
    const item = new Object();
    item.id = id;
    item.name = name;
    item.img = img;
    item.price = price;
    item.quantity = quantity
    item.rating = rating;
    item.description = description;
    item.selected = false;
    item.comments = comments;

    products_array.push(item); //Push into products array
    products_array_copy.push(item); //Push into copy
}


//Create card function
const createProductCard = (product_array) => {
    product_array.forEach(item => {
        const div = document.createElement('div');
        const h3 = document.createElement('h3');
        const p = document.createElement('p');
        const img = document.createElement('img');
        const price = document.createElement('span');
        const form = document.createElement('form');
        const checkbox = document.createElement('input');
        const link = document.createElement("a");

        const span = document.createElement('span');
        span.classList.add("rating-span");
        span.classList.add("d-flex-row");
        checkbox.type = "checkbox";
        checkbox.classList.add("add-to-list-checkbox");

        div.classList.add('card');

        div.dataset.id = item.id;
        h3.textContent = `${item.name}`;
        span.innerHTML = `${item.rating}<i class="ri-star-line"></i>`;
        //h3.appendChild(span);
        p.classList.add('description');
        p.dataset.desc_id = item.id;
        p.textContent = item.description;
        link.href = `./index.html?prod=${item.id}`;
        link.appendChild(img);
        img.src = item.img;
        img.alt = "";
        price.classList.add("price");
        price.textContent = `${item.price}`;
        checkbox.value = item.id;

        form.appendChild(checkbox);

        form.action = "./index.html";
        form.method = "POST";
        form.classList.add('add-to-list-form');

        div.appendChild(h3);
        div.appendChild(span);
        div.appendChild(link);
        div.appendChild(price);
        div.appendChild(p);
        div.appendChild(form);
        content_container.appendChild(div);
    })
}



/*
const addCoffeTolist = (list_title, list_items, ev, id) =>{
    const li = document.createElement('li');
    my_list_array.push(products_array.filter(item => item.id == ev.target.value)[0]); //We want to push the object, not the array
    li.dataset.item_id = id;
    li.textContent = my_list_array.filter(item=> item.id == ev.target.value)[0].name;
    list_title.dataset.content=`${++no_of_coffes} coffes`;
    list_items.appendChild(li);
}*/
/*
const removeCoffeFromList = (li, list_title, list_items, ev) =>{
    const items_to_be_removed = document.querySelectorAll('li');
    for(let i=0; i<items_to_be_removed.length; i++){
        if(items_to_be_removed[i].dataset.item_id == ev.target.value){
            my_list_array.splice(my_list_array.findIndex(item=> item.id == ev.target.value),1);
            list_items.removeChild(items_to_be_removed[i]);
        }
    }
    my_list_array.splice(my_list_array.findIndex(item=> item.id == ev.target.value),1);
    list_items.removeChild(li);
    list_title.dataset.content=`${--no_of_coffes} coffes`;
}*/

/*
function deselectProduct(e, cards, list_items, list_title, checkbox, selectProduct){
    cards[id].style="outline: unset; box-shadow: unset";
    //removeCoffeFromList(li, list_title, list_items, e);
    my_list_array.splice(my_list_array.findIndex(item=> item.id == e.target.value),1);
    list_items.removeChild(li);
    list_title.dataset.content=`${--no_of_coffes} coffes`;

    console.log(my_list_array);

    checkbox.removeEventListener('click', deselectProduct);
    checkbox.addEventListener('click',selectProduct);
}

*/

//Edit button function - admin page
const editButton = (cards, id) => {
    const btn = document.createElement('button'); //Create a button
    const description = document.querySelector(`.description[data-desc_id=${CSS.escape(id)}`);
    btn.dataset.id = Number(id + 1); //Assign it an id
    btn.textContent = "Edit";
    btn.classList.add("button");
    btn.classList.add("edit-btn");
    cards[id].appendChild(btn); //Append to card


    //On first click, allow the admin to change content
    btn.addEventListener('click', function Edit(e) {
        let title = e.target.parentNode.children[0]; //Select title
        let price = e.target.parentNode.children[3]; //Select price
        let rating = e.target.parentNode.children[1];

        title.setAttribute('contenteditable', "true"); //Make them editable
        price.setAttribute('contenteditable', "true");
        rating.setAttribute('contenteditable', "true");

        const btn_obj = e.target; //Select the button
        let description_content = e.target.parentNode.children[4]; //Get the item description
        //console.log(description_content);
        description_content.style.display = "none"; //Hide it
        const textarea = document.createElement("textarea"); //Create a textarea element to replace the item desc
        textarea.value = description_content.textContent; //Textarea gets the item description
        textarea.dataset.id = id; //Set id to textarea

        btn_obj.insertAdjacentElement('beforebegin', textarea); //Insert the textarea before the button
        // console.log(e.target.parentNode.children[3]);

        btn.removeEventListener('click', Edit); //Remove the Edit function



        //Add 2nd click event - Save edit
        btn.addEventListener('click', function SaveEdit(e) {
            description_content.textContent = textarea.value; //Replace the old desc with the new one
            description_content.style.display = "unset"; //Show it again
            title.removeAttribute('contenteditable'); //Make them uneditable before saving
            price.removeAttribute('contenteditable');
            rating.removeAttribute('contenteditable');


            for (const obj of products_array) { //Search for the object to modify it's data
                if (obj.id == e.target.dataset.id) {
                    obj.description = description_content.textContent;
                    console.log(title.textContent);
                    obj.name = title.textContent;
                    obj.rating = rating.textContent/*.replace("<i class=\"ri-star-line\"></i>","");*/
                    obj.price = price.textContent;
                    break;
                }
            }

            //console.log(products_array);
            console.log(products_array);

            cards[id].removeChild(textarea); //Remove textarea
            // textarea.style.display = "none";
            window.localStorage.setItem('coffee-data', JSON.stringify(products_array)); //Save edited data


            btn.removeEventListener('click', SaveEdit); //Remove save edit event
            // btn.removeEventListener('click',Edit);
            removeEditButton(cards, id); //Remove Edit button
        })

    })
}

//Remove edit button
const removeEditButton = (cards, id) => {
    const btn_to_be_deleted = document.querySelector(`.edit-btn[data-id=${CSS.escape(id + 1)}]`);
    // console.log(btn_to_be_deleted);
    const description = document.querySelector(`.description[data-desc_id=${CSS.escape(id + 1)}`);

    /* if (description) {
         description.style.display = "unset";
     } else */
    if (btn_to_be_deleted) {
        cards[id].removeChild(btn_to_be_deleted);

    } else return;
}


//Add new product - admin page
const addProduct = () => {
    const add_product_btn = document.querySelector(".add-product");
    add_product_btn.addEventListener('click', function createProduct(ev) {
        content_container.innerHTML = '';

        content_container.classList.remove("grid-container--fill");
        content_container.innerHTML = `
<div class="card w-80 min-height d-flex-column">
<form id="form1" class="new-product-form w-80 min-height d-flex-column gap" action="" method="GET">

<label for="title">Title</label>
<input id="title" type="text" name="title" value="" />


<label for="image">Image</label>
<input id="image" type="file" name="image">


<label for="price">Price</label>
<input id="price" type="text" name="price" />

<label for="quantity">Quantity</label>
<input id="quantity" type="number" min="0" max="100" name="quantity">



<label for="rating">Rating</label>
<select id="rating" name="rating">
<option value="1">1</option>
<option value="2">2</option>
<option value="3">3</option>
<option value="4">4</option>
<option value="5">5</option>
</select>


<label for="desc">Description</label>
<textarea id="desc"></textarea>

</form>

</div>
`;

        let rating_val = 1;
        rating.addEventListener('change', (ev) => {
            rating_val = ev.target.value;
            console.log(rating_val);
        })

        add_product_btn.removeEventListener('click', createProduct);
        add_product_btn.addEventListener('click', function AddNewProduct(e) {

            e.preventDefault();
            const rating = document.querySelector("#rating");
            const title = document.querySelector("#title");
            const image = document.querySelector("#image");
            const price = document.querySelector("#price");
            const quantity = document.querySelector("#quantity");
            const desc = document.querySelector("#desc");
            let comments = 0;


            let highest_id = Math.max(...products_array.map(product => product.id));



            Product(Number(highest_id + 1), title.value, image.value, price.value + "$", quantity.value, rating_val, desc.value, comments);
            console.log(products_array);
            window.localStorage.setItem('coffee-data', JSON.stringify(products_array));
            content_container.innerHTML = ' ';
            add_product_btn.type = "button";
            createProduct(products_array);
            CheckBoxes();

            window.location.reload();

            //content_container.classList.add("grid-container--fill");
            add_product_btn.removeEventListener('submit', AddNewProduct);
            add_product_btn.addEventListener('click', createProduct);
        })

    })
}

//Delete product - admin page
const deleteProduct = () => {
    const checkboxes = document.querySelectorAll(".add-to-list-checkbox");
    const delete_prod = document.querySelector("button.delete-product");
    const cards = document.querySelectorAll(".card");

    delete_prod.addEventListener('click', (ev) => {
        //For each checkbox
        checkboxes.forEach((check, check_id) => {
            if (check.checked) { //If it's checked
                products_array.splice(products_array.findIndex(item => item.id == check.value), 1);
                //Remove the corresponding products from array
                check.checked = "false";
                //console.log(products_array);

                //Remove from content container
                content_container.removeChild(cards[check_id]);

            } else return;


        })

        window.localStorage.setItem('coffee-data', JSON.stringify(products_array)); //Save new array
    })

}

//Add checkboxes to cards
const CheckBoxes = () => {
    const cards = document.querySelectorAll(".card");
    const checkboxes = document.querySelectorAll('form > input[type="checkbox"]');
    const list_items = document.querySelector("ul.list-items");
    const list_title = document.querySelector(".list-title");
    // checkboxes.forEach((checkbox, id) => {


    //If we are in the admin page
    if (window.location.toString().includes('admin-page')) {
        checkboxes.forEach((checkbox, id) => {

            checkbox.addEventListener('click', function selectProduct(e) {
                //checkbox.checked="true";
                //Highlight card
                cards[id].style = "outline: 4px solid hsl(30, 56%, 35%); box-shadow: 0px 5px 10px white";
                //Add edit button
                editButton(cards, id);
                my_list_array.push(products_array.filter(item => item.id == e.target.value)[0]);
                //We want to push the object, into list array, not the array that's being returned from filter - [0]

                //console.log(my_list_array);
                //addCoffeTolist(list_title,list_items, e, id);
                //cards[id].appendChild(btn);

                //Search for item to mark it as selected
                products_array.find(item => item.id == e.target.value ? item.selected = true : item.selected = false);

                //Remove first click event
                checkbox.removeEventListener('click', selectProduct);


                //Add deselect event
                checkbox.addEventListener('click', function deselectProduct(e) {
                    //checkbox.checked="false";
                    cards[id].style = "outline: unset; box-shadow: unset";

                    //removeCoffeFromList(li, list_title, list_items, e);

                    my_list_array.splice(my_list_array.findIndex(item => item.id == e.target.value), 1);
                    //Remove item from list array
                    const textarea_to_be_removed = document.querySelector(`textarea[data-id=${CSS.escape(id)}`);
                    //Select textarea

                    const description = document.querySelector(`.description[data-desc_id=${CSS.escape(id)}`);
                    /* if(description) {
                         description.style.display = "unset";
                         if(textarea_to_be_removed){
 
                         
                      description.textContent = textarea_to_be_removed.value;
                         } else return;
                     }*/

                    removeEditButton(cards, id); //Remove edit btn

                    //If there is a textarea, remove it
                    if (textarea_to_be_removed) cards[id].removeChild(textarea_to_be_removed);

                    //Remove the 2nd event, add the select event back - for toggle functionality
                    checkbox.removeEventListener('click', deselectProduct);
                    checkbox.addEventListener('click', selectProduct);
                })
            })
        })

    } else { //If we are not in the admin-page

        //We do the same thing as before except that we update the list with coffees
        checkboxes.forEach((checkbox, id) => {


            checkbox.addEventListener('click', function selectProduct(e) {
                cards[id].style = "outline: 4px solid hsl(30, 56%, 35%); box-shadow: 0px 5px 10px white";

                const li = document.createElement('li');
                my_list_array.push(products_array.filter(item => item.id == e.target.value)[0]); //We want to push the object, not the array
                li.dataset.item_id = id;
                li.textContent = my_list_array.filter(item => item.id == e.target.value)[0].name;
                list_title.dataset.content = `${++no_of_coffes}`;
                list_items.appendChild(li);
                console.log(my_list_array);
                //addCoffeTolist(list_title,list_items, e, id);
                products_array.find(item => item.id == e.target.value ? item.selected = true : item.selected = false);
                checkbox.removeEventListener('click', selectProduct);


                checkbox.addEventListener('click', function deselectProduct(e) {
                    cards[id].style = "outline: unset; box-shadow: unset";
                    //removeCoffeFromList(li, list_title, list_items, e);
                    my_list_array.splice(my_list_array.findIndex(item => item.id == e.target.value), 1);
                    list_items.removeChild(li);
                    list_title.dataset.content = `${--no_of_coffes}`;

                    console.log(my_list_array);

                    checkbox.removeEventListener('click', deselectProduct);
                    checkbox.addEventListener('click', selectProduct);
                })
            })
        })

    }

}




//Save list items
const saveListItems = () => {
    const btn = document.querySelector(".save-list-items-btn");
    const cards = document.querySelectorAll(".card");
    const list_title = document.querySelector(".list-name");
    btn.addEventListener('click', (ev) => {
        // ev.preventDefault();
        const checkboxes = document.querySelectorAll('form > input[type="checkbox"]');
        const stringified_items = JSON.stringify(my_list_array);
        list_title.setAttribute('contenteditable', 'false');
        // const stringified_list_name = JSON.stringify(list_title);
        window.localStorage.setItem('list-data', stringified_items);
        window.localStorage.setItem('list-name', JSON.stringify(list_title.textContent));
        //window.location.reload();

    })
}


//Render list items
const renderListItems = () => {
    if (window.localStorage.getItem('list-data')) { //If there is a list saved
        const list_data = JSON.parse(window.localStorage.getItem('list-data'));
        const ul = document.querySelector("ul.list-items");
        const save_list_items_btn_text = document.querySelector(".list-name");
        const list_name_json = window.localStorage.getItem('list-name');
        save_list_items_btn_text.textContent = JSON.parse(list_name_json);
        list_data.forEach(obj => {
            const li = document.createElement("li");
            li.textContent = obj.name + " -" + obj.price;
            li.dataset.item_id = obj.id;

            ul.appendChild(li);
        })



    } else { //If there isn't
        const title = document.querySelector(".list-name");
        title.textContent = "My list";
    };
}


//Order by function
const orderBy = (products, products_copy) => {
    const filt = document.querySelector("#filters");

    filt.addEventListener('change', (e) => {
        switch (e.target.value) { //Based on select option
            case '---': //Default
                content_container.innerHTML = '';
                createProductCard(products_copy);
                CheckBoxes();
                break;

            case 'Name': //Name sort - ascending
                products_array.sort(function (a, b) {
                    const nameA = a.name.toUpperCase();
                    const nameB = b.name.toUpperCase();
                    if (nameA > nameB) {
                        return -1;
                    }

                    if (nameA < nameB) {
                        return 1;
                    }

                    return 0;
                });
                content_container.innerHTML = '';
                createProductCard(products);
                CheckBoxes();
                console.log(products);
                break;


            case 'Price': //Price sort - ascending
                products_array.sort(function (a, b) {
                    const priceA = Number(a.price.replace("$", ""));
                    const priceB = Number(b.price.replace("$", ""));
                    if (priceA < priceB) {
                        return -1;
                    }

                    if (priceA > priceB) {
                        return 1;
                    }

                    return 0;
                });
                content_container.innerHTML = '';
                createProductCard(products_array);
                CheckBoxes();
                console.log(products_array);
                break;

            case 'Quantity': //Quantity sort - descending
                //loop to access each array element
                for (let i = 0; i < products_array.length - 1; i++)

                    //loop to compare array elements
                    for (let j = 0; j < products_array.length - i - 1; j++)

                        //Compare two adjacent elements
                        if (products_array[j].quantity < products_array[j + 1].quantity) {

                            //swapping occurs if elements
                            // are not in the intended order
                            let temp = products_array[j];
                            products_array[j] = products_array[j + 1];
                            products_array[j + 1] = temp;
                        }
                content_container.innerHTML = '';
                createProductCard(products_array);
                CheckBoxes();
                console.log(products_array);
                break;


            case 'Rating': //Rating sort - descending
                // loop to access each array element
                for (let i = 0; i < products_array.length - 1; i++)

                    // loop to compare array elements
                    for (let j = 0; j < products_array.length - i - 1; j++)

                        // compare two adjacent elements
                        if (products_array[j].rating < products_array[j + 1].rating) {

                            // swapping occurs if elements
                            // are not in the intended order
                            let temp = products_array[j];
                            products_array[j] = products_array[j + 1];
                            products_array[j + 1] = temp;
                        }
                content_container.innerHTML = '';
                createProductCard(products_array);
                CheckBoxes();
                console.log(products_array);
                break;

            case 'Comments': //Comments sort - descending

                // loop to access each array element
                for (let i = 0; i < products_array.length - 1; i++)

                    // loop to compare array elements
                    for (let j = 0; j < products_array.length - i - 1; j++)

                        // compare two adjacent elements
                        if (products_array[j].comments.length < products_array[j + 1].comments.length) {
                            console.log(products_array[j].comments.length < products_array[j + 1].comments.length)
                            // swapping occurs if elements
                            // are not in the intended order
                            let temp = products_array[j];
                            products_array[j] = products_array[j + 1];
                            products_array[j + 1] = temp;
                        }
                content_container.innerHTML = '';
                createProductCard(products_array);
                CheckBoxes();
                console.log(products_array);
                break;
        }


    })
}


//First letter capitalized - used for search feature
const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
}


//Search form
const searchForm = () => {
    //Prevent page refresh on submit
    const form = document.querySelector(".search-form");
    form.addEventListener("submit", (ev) => {
        ev.preventDefault();
    })

    //Search input
    const search_input = document.querySelector("#search_input");
    const submit_input = document.querySelector("#submit-input");
    search_input.addEventListener("keyup", (ev) => { //On enter key
        if (ev.key === 'Enter' || ev.keyCode === 13) {
            console.log()
            ev.preventDefault(); //Prevent refresh

            const uppercase = capitalizeFirstLetter(ev.target.value); //First letter uppercase
            const search_item = products_array.filter(item => item.name == ev.target.value
                || item.name.includes(uppercase)
                || item.name.includes(ev.target.value.toLowerCase()));
            /*If the item is equal to the text inserted or item contains the string but with capitalizated 
            first letter or it's a substring
            */
            //console.log(search_item);
            content_container.innerHTML = '';
            content_container.style = "display: unset; display:flex; justify-content: center; align-items: normal; flex-direction: row; flex-wrap: wrap;";
            createProductCard(search_item); //Show it
            CheckBoxes(search_item);

        }

    })

    submit_input.addEventListener('click', (ev) => {
        ev.preventDefault(); //Prevent refresh

        const uppercase = capitalizeFirstLetter(search_input.value); //First letter uppercase
        const search_item = products_array.filter(item => item.name == search_input.value
            || item.name.includes(uppercase)
            || item.name.includes(search_input.value.toLowerCase()));
        /*If the item is equal to the text inserted or item contains the string but with capitalizated 
        first letter or it's a substring
        */
        //console.log(search_item);
        content_container.innerHTML = '';
        content_container.style = "display: unset; display:flex; justify-content: center; align-items: normal; flex-direction: row; flex-wrap: wrap;";
        createProductCard(search_item); //Show it
        CheckBoxes(search_item);
    })
}


let no_of_coffes = new Number(); //Initialize no of coffes - used for showing how many coffees does our list have

//Dynamic coffee list number
const dynamicCoffeeNumber = () => {
    const list_title = document.querySelector(".list-title");
    if (!window.localStorage.getItem('list-data') || JSON.parse(window.localStorage.getItem('list-data')) == "[]") {
        no_of_coffes = 0;
        list_title.dataset.content = `${no_of_coffes}`;
        // console.log(no_of_coffes);
    } else {
        const number = JSON.parse(window.localStorage.getItem('list-data'));
        no_of_coffes = number.length;
        list_title.dataset.content = `${no_of_coffes}`;
        //console.log(no_of_coffes);
    }
}

//On/off toggle for coffee list
const showHideList = () => {
    const list_wrapper = document.querySelector('.list-wrapper');
    const ul_container = document.querySelector(".ul-container");
    list_wrapper.addEventListener('click', () => {
        ul_container.classList.toggle("hidden");
    })
}




//Main app
const App = async (data) => {
    //If there is data saved in localStorage but we are in index.html
    if (localStorage.getItem('coffee-data') && !window.location.toString().includes('admin-page')) {

        //Use the localStorage data
        const json_data = JSON.parse(localStorage.getItem('coffee-data'));
        json_data.forEach(item => {
            Product(item.id, item.name, item.img, item.price, item.quantity, item.rating, item.description, item.comments);
            //create a new Product
        });

        //Add functions/components
        createProductCard(json_data);
        renderListItems();
        CheckBoxes();
        saveListItems();
        orderBy(products_array, products_array_copy);
        searchForm();
        dynamicCoffeeNumber();
        showHideList();

        //If we have localStorage data but we are in admin-page
    } else if (localStorage.getItem('coffee-data') && window.location.toString().includes('admin-page')) {
        //Use the data
        const json_data = JSON.parse(localStorage.getItem('coffee-data'));
        json_data.forEach(item => {
            Product(item.id, item.name, item.img, item.price, item.quantity, item.rating, item.description, item.comments);
            //create a new Product
        });

        //Add functions/components - without the coffee list and coffee number
        createProductCard(json_data);
        CheckBoxes();
        searchForm();
        addProduct();
        deleteProduct();


        //By default use the data provided from the server - produse.json
    } else {
        const product_data = await data;

        //We check again if we are in admin-page
        if (window.location.toString().includes('admin-page')) {
            product_data.forEach(item => {
                Product(item.id, item.name, item.img, item.price, item.quantity, item.rating, item.description, item.comments);
            })

            //Add specific function
            createProductCard(products_array);
            CheckBoxes();
            searchForm();
            deleteProduct();
            addProduct();

            //We are in index.html
        } else {
            product_data.forEach(item => {
                Product(item.id, item.name, item.img, item.price, item.quantity, item.rating, item.description, item.comments);
                //create a new Product
            });

            //Add default functions
            createProductCard(products_array);
            renderListItems();
            CheckBoxes();
            saveListItems();
            orderBy(products_array, products_array_copy);
            searchForm();
            dynamicCoffeeNumber();
            showHideList();
        }
    }

}



const data = fetchItems(); //Get data
App(data); //Create App




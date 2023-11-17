import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {
    databaseURL: "https://mobileappshoppingbasket-default-rtdb.europe-west1.firebasedatabase.app/"

};

const app = initializeApp(appSettings);
const database = getDatabase(app);
const cartItemsInDB = ref(database, "cartitems");

const inputEl = document.getElementById("input-field");
const addBtn = document.getElementById("add-button");
const shoppingList = document.getElementById("shopping-list");
let cartItems = ["milk", "banana"];

addBtn.addEventListener("click", function() {
    let inputValue = inputEl.value
    if (inputValue) {
        cartItems.push(inputValue)
        push(cartItemsInDB, inputValue)
        inputEl.value = ""
    }
    renderItems()
});

function renderItems() {
    let showItems = ""
    for (let i = 0; i < cartItems.length; i++) {
        showItems += `
            <li>
                <button>${cartItems[i]}</button>
            </li>
        `
    }
    shoppingList.innerHTML = showItems
};

window.addEventListener("load", function() {
    renderItems()
});
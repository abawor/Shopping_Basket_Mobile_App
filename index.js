import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {
    databaseURL: "https://mobileappshoppingbasket-default-rtdb.europe-west1.firebasedatabase.app/"
};

const app = initializeApp(appSettings);
const database = getDatabase(app);
const cartItemsInDB = ref(database, "cartitems");

const inputEl = document.getElementById("input-field");
const addBtn = document.getElementById("add-button");
const shoppingList = document.getElementById("shopping-list");

onValue(cartItemsInDB, function(snapshot) {
    let cartItemsArr = Object.values(snapshot.val())
    let cartItems = []
    for (let i = 0; i < cartItemsArr.length; i++) {
        cartItems.push(cartItemsArr[i])
    }
    renderItems(cartItems)
})

addBtn.addEventListener("click", function() {
    let inputValue = inputEl.value
    if (inputValue) {
        push(cartItemsInDB, inputValue)
        inputEl.value = ""
    }
});

function renderItems(cartItems) {
    let showItems = ""
    for (let i = 0; i < cartItems.length; i++) {
        showItems += `
            <li>${cartItems[i]}</li>
        `
    }
    shoppingList.innerHTML = showItems
};

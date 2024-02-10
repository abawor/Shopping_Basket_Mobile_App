import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {
    databaseURL: "https://mobileappshoppingbasket-default-rtdb.europe-west1.firebasedatabase.app/"
};

const app = initializeApp(appSettings);
const database = getDatabase(app);
const cartItemsInDB = ref(database, "cartitems");

const inputEl = document.getElementById("input-field");
const addBtn = document.getElementById("add-button");
const shoppingList = document.getElementById("shopping-list");
const suggestedItems = document.getElementById("suggested-items");
const suggestions = ['🍇', '🍌', '🍎', '🍊', '🍋', '🍐', '🍑', '🍒', '🍓', '🥝', '🍅', '🥑', '🥔', '🥕', '🥒', '🥬', '🥦', '🧄', '🧅', '🥜', '🍞', '🧀', '🍗', '🥩', '🥓', '🍟', '🍕', '🥚', '🧈', '🧂', '🍫', '🥛', '🧃']

onValue(cartItemsInDB, function(snapshot) {
    if (snapshot.exists()) {
        let cartItemsArr = Object.entries(snapshot.val())
        clearShoppingList()
        for (let i = 0; i < cartItemsArr.length; i++) {
            let currentItem = cartItemsArr[i]
            renderItem(currentItem)
        }
    } else {
        clearShoppingList()
    }
    checkAndAddSuggestions()
})

addBtn.addEventListener("click", function() {
    let inputValue = inputEl.value
    if (inputValue) {
        push(cartItemsInDB, inputValue)
        inputEl.value = ""
    }
    checkAndAddSuggestions()
});

function renderItem(currentItem) {
    let itemID = currentItem[0]
    let itemValue = currentItem[1]
    let newEl = document.createElement("li")
    newEl.id = itemID
    newEl.textContent = itemValue
    shoppingList.append(newEl)
    newEl.addEventListener("dblclick", function() {
        let exactLocationOfItemInDB = ref(database, `cartitems/${itemID}`)
        remove(exactLocationOfItemInDB)
    })
};

function clearShoppingList() {
    shoppingList.innerHTML = ""
};

function checkAndAddSuggestions() {
    suggestedItems.innerHTML = ""
    for (let i = 0; i < suggestions.length; i++) {
        if (!(shoppingList.innerText.includes(suggestions[i]))) {
            let newItem = document.createElement("option")
            let node = document.createTextNode(suggestions[i])
            newItem.appendChild(node)
            suggestedItems.appendChild(newItem)
        }
    }
}

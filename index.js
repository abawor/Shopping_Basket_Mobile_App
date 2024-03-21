import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {
    databaseURL: "https://testing-env-ab-default-rtdb.europe-west1.firebasedatabase.app/"
};

const app = initializeApp(appSettings);
const database = getDatabase(app);
const cartItemsInDB = ref(database, "cartitems");

const inputEl = document.getElementById("input-field");
const addNowBtn = document.getElementById("add-now-button");
const addLaterBtn = document.getElementById("add-later-button");
const shoppingListNow = document.getElementById("shopping-list-now");
const shoppingListLater = document.getElementById("shopping-list-later");
const suggestedItems = document.getElementById("suggested-items");
const suggestions = ['🍇', '🍌', '🍎', '🍊', '🍋', '🍐', '🍑', '🍒', '🍓', '🥝', '🍅', '🥑', '🥔', '🥕', '🥒', '🥬', '🥦', '🧄', '🧅', '🥜', '🍞', '🧀', '🍗', '🥩', '🥓', '🍟', '🍕', '🥚', '🧈', '🧂', '🍫', '🥛', '🧃']

onValue(cartItemsInDB, function(snapshot) {
    if (snapshot.exists()) {
        let cartItemsArr = Object.entries(snapshot.val())
        console.log(cartItemsArr)
        console.log(cartItemsArr[2][1])
        console.log(cartItemsArr[2][1].itemName)
        console.log(cartItemsArr[2][1].shopName)
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

addNowBtn.addEventListener("click", function() {
    let newItem = inputEl.value
    if (newItem) {
        push(cartItemsInDB, newItem)
        inputEl.value = ""
    }
    checkAndAddSuggestions()
});

addLaterBtn.addEventListener("click", function() {
    let newItem = inputEl.value
    /*let shopName = "lidl"
    let newItem = {"itemName": itemName, "shopName": shopName, "buyTime": buyTime}
    */
    if (newItem) {
        push(cartItemsInDB, newItem)
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
    shoppingListNow.append(newEl)
    newEl.addEventListener("dblclick", function() {
        let exactLocationOfItemInDB = ref(database, `cartitems/${itemID}`)
        remove(exactLocationOfItemInDB)
    })
};

function clearShoppingList() {
    shoppingListNow.innerHTML = ""
};

function checkAndAddSuggestions() {
    suggestedItems.innerHTML = ""
    for (let i = 0; i < suggestions.length; i++) {
        if (!(shoppingListNow.innerText.includes(suggestions[i]))) {
            let newItem = document.createElement("option")
            let node = document.createTextNode(suggestions[i])
            newItem.appendChild(node)
            suggestedItems.appendChild(newItem)
        }
    }
}

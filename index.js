import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {
    databaseURL: "https://testing-env-ab-default-rtdb.europe-west1.firebasedatabase.app/"
};

const app = initializeApp(appSettings);
const database = getDatabase(app);
const cartItemsInDB = ref(database, "cartitems");

const inputEl = document.getElementById("input-field");
const shopsListDiv = document.getElementById("shops-list")
const shopsList = ["Lidl", "Asda", "Morrisons", "Tesco", "Costco", "Other"]
const addNowBtn = document.getElementById("add-now-button");
const addLaterBtn = document.getElementById("add-later-button");
const buyNowDiv = document.getElementById("buy-now")
const buyLaterDiv = document.getElementById("buy-later")
const shoppingListNow = document.getElementById("shopping-list-now");
const shoppingListLater = document.getElementById("shopping-list-later");
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

addNowBtn.addEventListener("click", function() {
    let itemName = inputEl.value
    if (itemName) {
        let buyTime = "buy_now"
        let newItem = {"itemName": itemName, "buyTime": buyTime}
        if (newItem) {
            push(cartItemsInDB, newItem)
            inputEl.value = ""
        }
        checkAndAddSuggestions()
    }
    buyTimeDivDisplay()
});

addLaterBtn.addEventListener("click", function() {
    let itemName = inputEl.value
    if (itemName) {
        let buyTime = "buy_later"
        let newItem = {"itemName": itemName, "buyTime": buyTime}
        if (newItem) {
            push(cartItemsInDB, newItem)
            inputEl.value = ""
        }
        checkAndAddSuggestions()
    }
});


function buyTimeDivDisplay() {
    if (shoppingListNow.getElementsByTagName('li').length === 0) {
        buyNowDiv.style.display = "none"
    }
    if (shoppingListLater.getElementsByTagName('li').length === 0) {
        buyLaterDiv.style.display = "none"
    }
}

function renderItem(currentItem) {
    let itemID = currentItem[0]
    let itemValue = currentItem[1].itemName
    let newEl = document.createElement("li")
    newEl.id = itemID
    newEl.textContent = itemValue
    if (currentItem[1].buyTime === "buy_now"){
        buyNowDiv.style.display = "flex"
        shoppingListNow.append(newEl)
    } else {
        buyLaterDiv.style.display = "flex"
        shoppingListLater.append(newEl)
    }
    newEl.addEventListener("dblclick", function() {
        let exactLocationOfItemInDB = ref(database, `cartitems/${itemID}`)
        remove(exactLocationOfItemInDB)
        buyTimeDivDisplay()
    })
};

function renderShopsList() {
    for (let i = 0; i < shopsList.length; i++) {
        let shopName = shopsList[i]
        let newEl = document.createElement("li")
        newEl.id = shopName
        newEl.textContent = shopName
        if (shopName === "Lidl") {
            newEl.className += " active"
        }
        shopsListDiv.append(newEl)
    }
}

renderShopsList()

function activateShop() {
    let shopBtns = shopsListDiv.getElementsByTagName("li")
    for (let i = 0; i < shopBtns.length; i++) {
        shopBtns[i].addEventListener("click", function() {
            let current = document.getElementsByClassName("active")

            if (current.length > 0) {
              current[0].className = current[0].className.replace(" active", "")
            }

            this.className += " active"
        })
    }
}

activateShop()


function clearShoppingList() {
    shoppingListNow.innerHTML = ""
    shoppingListLater.innerHTML = ""
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

const inputEl = document.getElementById("input-field");
const addBtn = document.getElementById("add-button");
let cartItems = [];


addBtn.addEventListener("click", function() {
    let inputValue = inputEl.value
    cartItems.push(inputValue)
    inputEl.value = ""
    console.log(cartItems)
});
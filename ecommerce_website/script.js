let cart = [];

function addToCart(name, price) {
    let item = cart.find(p => p.name === name);

    if (item) {
        item.quantity++;
    } else {
        cart.push({ name, price, quantity: 1 });
    }

    updateCart();
}

function updateCart() {
    let cartList = document.getElementById("cart-items");
    let total = 0;
    cartList.innerHTML = "";

    cart.forEach((item, index) => {
        let li = document.createElement("li");

        let itemTotal = item.price * item.quantity;
        total += itemTotal;

        li.innerHTML = `
            ${item.name} - ₹${item.price} x ${item.quantity} = ₹${itemTotal}
            <br>
            <button onclick="increaseQty(${index})">+</button>
            <button onclick="decreaseQty(${index})">-</button>
            <button onclick="removeItem(${index})">Remove</button>
        `;

        cartList.appendChild(li);
    });

    document.getElementById("total").innerText = total;

    // Save to localStorage (Bonus)
    localStorage.setItem("cart", JSON.stringify(cart));
}

function increaseQty(index) {
    cart[index].quantity++;
    updateCart();
}

function decreaseQty(index) {
    if (cart[index].quantity > 1) {
        cart[index].quantity--;
    } else {
        cart.splice(index, 1);
    }
    updateCart();
}

function removeItem(index) {
    cart.splice(index, 1);
    updateCart();
}

// Load cart from storage
window.onload = function () {
    let savedCart = localStorage.getItem("cart");
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCart();
    }
};

function checkout() {
    let name = document.getElementById("name").value;

    if (cart.length === 0) {
        alert("Cart is empty!");
        return;
    }

    document.getElementById("message").innerText =
        "🎉 Order placed successfully! Thank you, " + name;

    cart = [];
    updateCart();
    localStorage.clear();
}
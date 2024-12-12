// Created a loader and appended it to the body
const loader = document.createElement("div");
loader.classList.add("loader");
loader.textContent = "Loading...";
document.body.appendChild(loader);

// Fetched data from the API
fetch(
  "https://cdn.shopify.com/s/files/1/0883/2188/4479/files/apiCartData.json?v=1728384889"
)
  .then((response) => response.json())
  .then((data) => {
    renderCart(data);
    attachEventListeners();
    loader.remove();
  })
  .catch((error) => {
    console.error("Error fetching cart data:", error);
    loader.remove(); // Remove loader even if there's an error
  });

// Function to render cart items
function renderCart(cartData) {
  const cartList = document.getElementById("cart-list");
  const subtotalElement = document.getElementById("subtotal");
  const totalElement = document.getElementById("total");
  let subtotal = 0;

  cartList.innerHTML = ""; // Clear previous items

  cartData.items.forEach((item) => {
    const itemElement = document.createElement("div");
    itemElement.className = "cart-item";

    subtotal += item.price * item.quantity;

    // Create cart item structure
    itemElement.innerHTML = `
      <img src="${item.image}" alt="${item.title}" class="item-image">
      <div class="item-details">
        <h4>${item.title}</h4>
        <p>Price: ₹${(item.price / 100).toFixed(2)}</p>
        <p>
          Quantity: 
          <input 
            type="number" 
            min="1" 
            value="${item.quantity}" 
            data-id="${item.id}" 
            class="quantity-input"
          >
        </p>
        <p>Subtotal: ₹${((item.price * item.quantity) / 100).toFixed(2)}</p>
        <button class="remove-item" data-id="${item.id}">&#128465;</button>
      </div>
    `;
    cartList.appendChild(itemElement);
  });

  // Update subtotal and total
  subtotalElement.textContent = (subtotal / 100).toFixed(2);
  totalElement.textContent = (subtotal / 100).toFixed(2);
}

// Function to attach event listeners (for quantity and remove buttons)
function attachEventListeners() {
  document.querySelectorAll(".quantity-input").forEach((input) => {
    input.addEventListener("input", (e) => {
      const id = e.target.dataset.id;
      const newQuantity = parseInt(e.target.value);
      updateQuantity(id, newQuantity);
    });
  });

  // Remove item handler
  document.querySelectorAll(".remove-item").forEach((button) => {
    button.addEventListener("click", (e) => {
      const id = e.target.dataset.id;
      if (confirm("Are you sure you want to remove this item?")) {
        removeItem(id); // Only remove item after confirmation
      }
    });
  });
}

// Function to update quantity
function updateQuantity(id, newQuantity) {
  fetch(
    "https://cdn.shopify.com/s/files/1/0883/2188/4479/files/apiCartData.json?v=1728384889"
  )
    .then((response) => response.json())
    .then((data) => {
      const item = data.items.find((item) => item.id == id);
      if (item) {
        item.quantity = newQuantity;
        renderCart(data);
        attachEventListeners();
      }
    });
}

// Function to remove item
function removeItem(id) {
  fetch(
    "https://cdn.shopify.com/s/files/1/0883/2188/4479/files/apiCartData.json?v=1728384889"
  )
    .then((response) => response.json())
    .then((data) => {
      const updatedItems = data.items.filter((item) => item.id != id); // Remove item with the given ID
      renderCart({ items: updatedItems }); // Re-render the cart with updated items
      attachEventListeners();
    });
}

// Checkout button functionality
document.getElementById("checkout-btn").addEventListener("click", () => {
  alert("Thank you for your purchase!");
  // Clear the cart
  document.getElementById("cart-list").innerHTML = "";
  document.getElementById("subtotal").textContent = "₹0.00";
  document.getElementById("total").textContent = "₹0.00";
});

// Local Storage
function saveCartToLocal(items) {
  localStorage.setItem("cartItems", JSON.stringify(items));
}

function getCartFromLocal() {
  return JSON.parse(localStorage.getItem("cartItems")) || [];
}

let productsData = []; // Global variable to store fetched products
let cost = 0;

fetch('./product.json') // Ensure the correct JSON filename
  .then(response => response.json())
  .then((data) => {
    productsData = data; // Store data globally
    showProducts(data);
  })
  .catch(error => console.error("Error loading JSON:", error)); // Debugging

function showProducts(data) {
    let cardView = document.getElementById("cardView");
    if (!cardView) {
        console.error("Error: 'cardView' element not found in HTML.");
        return;
    }
    cardView.innerHTML = ""; // Clear existing content
    data.forEach(element => {
        cardView.innerHTML += `
            <div class="col-md-3">
                <div class="card shadow-sm">
                    <img src="${element.image}" class="card-img-top" height="300" width="200" alt="${element.title}">
                    <div class="card-body">
                        <h5 class="card-title">${element.title}</h5>
                        <h6 class="text-primary">৳ ${element.price}</h6>

                        <button class="btn btn-success w-100" onclick="showDescription(${element.id})">
                            <i class="fas fa-info-circle"></i> Description
                        </button><br><br>  
                        <p id="desc-${element.id}" class="desc-text"></p>

                        <button class="btn btn-success w-100" onclick="addToCart(${element.id})">
                            <i class="fas fa-cart-plus"></i> Add to Cart
                        </button><br><br>  
                    </div>
                </div>
            </div>
        `;
    });
}

function showDescription(id) {
    let product = productsData.find(p => p.id === id);
    if (product) {
        document.getElementById(`desc-${id}`).innerText = product.description;
    } else {
        console.error("Product not found with ID:", id);
    }
}

function addToCart(id) {
    let product = productsData.find(p => p.id === id);
    let cartTable = document.getElementById("productList");
  
    // Check if product already exists in cart
    let existingRow = document.querySelector(`#cart-item-${id}`);
    if (existingRow) {
        // Increase quantity if the product already exists
        let quantityCell = existingRow.querySelector(".cart-quantity");
        let quantity = parseInt(quantityCell.innerText) + 1;
        quantityCell.innerText = quantity;
    } else {
        // Create a new row for the product
        let newRow = document.createElement("tr");
        newRow.id = `cart-item-${id}`; // Set unique ID for each cart row
        newRow.innerHTML = `
            <td>
                <button class="btn btn-danger" onclick="removeFromCart(${id})">
                    <i class="fas fa-times"></i>
                </button>
            </td>
            <td><img src="${product.image}" width="50" height="50"></td>
            <td>${product.title}</td>
            <td>৳ ${product.price.toFixed(2)}</td>
            <td>
                <button class="btn btn-sm btn-secondary" onclick="updateQuantity(${id}, -1)">-</button>
                <span class="cart-quantity" id="quantity-${id}">1</span>
                <button class="btn btn-sm btn-success" onclick="updateQuantity(${id}, 1)">+</button>
            </td>
        `;      
        // Append the new row to the cart table
        cartTable.appendChild(newRow);      
    }
    totalAmount();
  }
  
  function updateQuantity(id, change) {
    let quantityCell = document.querySelector(`#quantity-${id}`);
    let currentQuantity = parseInt(quantityCell.innerText);
  
    // Ensure quantity does not go below 1
    let newQuantity = Math.max(1, currentQuantity + change);
    quantityCell.innerText = newQuantity;
  
    totalAmount(); // Update total price dynamically
  }
  


let appliedCoupon = false; // Track whether coupon has been applied

function totalAmount() {
  let cartTable = document.getElementById("productList");
  let totalCost = 0;

  // Loop through each row in the cart and calculate total cost
  Array.from(cartTable.rows).forEach(row => {
    let quantity = parseInt(row.querySelector(".cart-quantity").innerText);
    let priceText = row.cells[3].innerText.replace('৳', '').trim();  // Remove currency symbol and spaces
    let price = parseFloat(priceText);
    totalCost += quantity * price;
  });

  // Update the cart total
  document.getElementById("ctotal").innerText = `৳ ${totalCost.toFixed(2)}`;

  // Shipping cost
  let shippingCost = 100;

  // Calculate final total
  let finalTotal = totalCost + shippingCost;

  // Apply discount if coupon is valid
  if (appliedCoupon) {
    let discountAmount = totalCost * 0.10; // 10% discount
    finalTotal = (totalCost - discountAmount) + shippingCost;
  }
  document.getElementById("total").innerText = `৳ ${finalTotal.toFixed(2)}`;
}

function applyCoupon() {
  let couponInput = document.querySelector(".input-group input").value.trim(); // Get input value
  if (couponInput === "ostad") {
    appliedCoupon = true;
    alert("Coupon applied! You got a 10% discount.");
  } else {
    appliedCoupon = false;
    alert("Invalid coupon code.");
  }
  totalAmount(); // Recalculate total with discount
}



// Remove product from cart
function removeFromCart(id) {
  let row = document.querySelector(`#cart-item-${id}`);
  if (row) {
      row.remove();
      totalAmount();
  }
}

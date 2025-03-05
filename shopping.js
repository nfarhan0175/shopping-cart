let productsData = []; // Global variable to store fetched products
let appliedCoupon = false;
let coupon = 0;
let discountAmount = 0;

fetch('./product.json') // Ensure the correct JSON filename
  .then(response => response.json())
  .then((data) => {
    productsData = data; // Store data globally
    showProducts(data);
  })
  .catch(error => console.error("Error loading JSON:", error));

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
  
    let existingRow = document.querySelector(`#cart-item-${id}`);
    if (existingRow) {
        let quantityCell = existingRow.querySelector(".cart-quantity");
        let quantity = parseInt(quantityCell.innerText) + 1;
        quantityCell.innerText = quantity;
    } else {
        let newRow = document.createElement("tr");
        newRow.id = `cart-item-${id}`;
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
        cartTable.appendChild(newRow);      
    }
    totalAmount();
}

function updateQuantity(id, change) {
    let quantityCell = document.querySelector(`#quantity-${id}`);
    let currentQuantity = parseInt(quantityCell.innerText);
    let newQuantity = Math.max(1, currentQuantity + change);
    quantityCell.innerText = newQuantity;
    totalAmount();
}

function totalAmount() {
    let cartTable = document.getElementById("productList");
    let totalCost = 0;
    
    Array.from(cartTable.rows).forEach(row => {
        let quantity = parseInt(row.querySelector(".cart-quantity").innerText);
        let priceText = row.cells[3].innerText.replace('৳', '').trim();
        let price = parseFloat(priceText);
        totalCost += quantity * price;
    });

    let shippingCost = totalCost > 0 ? 100 : 0;
    let subTotal = totalCost + shippingCost;
    document.getElementById("ctotal").innerText = `৳ ${totalCost.toFixed(2)}`;
    document.getElementById("subtotal").innerText = `৳ ${subTotal.toFixed(2)}`;
    
    if (appliedCoupon) {
        discountAmount = totalCost * (coupon / 100);
    } else {
        discountAmount = 0;
    }  
    document.getElementById("discount").innerText = `৳ ${discountAmount.toFixed(2)}`;
    let finalTotal = subTotal - discountAmount;
    document.getElementById("total").innerText = `৳ ${finalTotal.toFixed(2)}`;
}

function applyCoupon() {
    let couponInputElement = document.getElementById("couponInput");
    if (!couponInputElement) {
        alert("Coupon input field not found! Check your HTML.");
        return;
    }
    
    let couponInput = couponInputElement.value.trim().toLowerCase();
    if (couponInput === "ostad10") {
        coupon = 10;
        appliedCoupon = true;
        alert("Coupon applied! You got a 10% discount.");
    } else if (couponInput === "ostad5") {
        coupon = 5;
        appliedCoupon = true;
        alert("Coupon applied! You got a 5% discount.");
    } else {
        coupon = 0;
        appliedCoupon = false;
        alert("Invalid coupon code.");
    }
    totalAmount();
}

function removeFromCart(id) {
    let row = document.querySelector(`#cart-item-${id}`);
    if (row) {
        row.remove();
        totalAmount();
    }
}

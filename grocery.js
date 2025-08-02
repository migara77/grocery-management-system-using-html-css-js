// Filtering categories
function filterItems(category) {
  const allItems = document.querySelectorAll(".product-card");
  const categories = document.querySelectorAll(".category-list li");

  allItems.forEach(item => {
    item.classList.remove("show");
    if (category === "all" || item.classList.contains(category)) {
      item.classList.add("show");
    }
  });

  categories.forEach(btn => btn.classList.remove("active"));
  document.querySelector(`.category-list li[onclick="filterItems('${category}')"]`).classList.add("active");
}

// Cart handling
let cart = [];
const cartCount = document.getElementById("cart-count");
const billItems = document.getElementById("bill-items");
const billTotal = document.getElementById("bill-total");

const selectAllCheckbox = document.getElementById("select-all");
const deleteSelectedBtn = document.getElementById("delete-selected");

// Update controls (select all checkbox and delete button) state
function updateControlsState() {
  if (cart.length === 0) {
    selectAllCheckbox.checked = false;
    selectAllCheckbox.disabled = true;
    deleteSelectedBtn.disabled = true;
    return;
  }
  selectAllCheckbox.disabled = false;

  // Are all selected?
  const allSelected = cart.every(item => item.selected);
  selectAllCheckbox.checked = allSelected;

  // Any selected?
  const anySelected = cart.some(item => item.selected);
  deleteSelectedBtn.disabled = !anySelected;
}

function updateCartDisplay() {
  billItems.innerHTML = "";
  let total = 0;

  if(cart.length === 0) {
    billItems.innerHTML = '<div class="empty">Your cart is empty.</div>';
    billTotal.innerText = "Total: Rs. 0";
    cartCount.innerText = 0;
    updateControlsState();
    return;
  }

  cart.forEach((item, index) => {
    if (item.selected === undefined) item.selected = true;

    const itemTotal = item.price * item.quantity;
    if(item.selected) total += itemTotal;

    billItems.innerHTML += `
      <div class="bill-item">
        <input type="checkbox" class="select-item" data-index="${index}" ${item.selected ? 'checked' : ''} />
        <span class="bill-name">${item.name} x ${item.quantity}</span> - 
        Rs. ${itemTotal}
        <button class="delete-item" data-index="${index}" title="Remove item">✖</button>
      </div>
    `;
  });

  billTotal.innerText = "Total: Rs. " + total;
  cartCount.innerText = cart.length;

  // Checkbox select/deselect for individual items
  document.querySelectorAll(".select-item").forEach(cb => {
    cb.addEventListener("change", function() {
      const i = parseInt(this.dataset.index);
      cart[i].selected = this.checked;
      updateCartDisplay();
    });
  });

  // Delete individual item button
  document.querySelectorAll(".delete-item").forEach(btn => {
    btn.addEventListener("click", function() {
      const i = parseInt(this.dataset.index);
      cart.splice(i, 1);
      updateCartDisplay();
    });
  });

  updateControlsState();  // Update select all & delete button
}

// Select All checkbox listener
selectAllCheckbox.addEventListener("change", () => {
  const checked = selectAllCheckbox.checked;
  cart.forEach(item => item.selected = checked);
  updateCartDisplay();
});

// Delete Selected button listener
deleteSelectedBtn.addEventListener("click", () => {
  cart = cart.filter(item => !item.selected);
  updateCartDisplay();
});

// Add to cart buttons
document.querySelectorAll(".add-cart-btn").forEach((btn) => {
  btn.addEventListener("click", function () {
    const card = btn.parentElement;
    const name = card.dataset.name;
    const price = parseFloat(card.dataset.price);
    const quantity = parseInt(card.querySelector(".quantity-select").value);

    const existing = cart.find(item => item.name === name);
    if (existing) {
      existing.quantity += quantity;
      existing.selected = true;
    } else {
      cart.push({ name, price, quantity, selected: true });
    }

    updateCartDisplay();
  });
});

// Bill bubble toggle and auto-hide
const billBubble = document.getElementById("bill-bubble");
const billPanelContent = document.getElementById("bill-panel-content");
const toggleBillBtn = document.getElementById("toggle-bill");

let hideTimeout;

toggleBillBtn.addEventListener("click", () => {
  if (billPanelContent.style.display === "block") {
    billPanelContent.style.display = "none";
  } else {
    billPanelContent.style.display = "block";
    resetHideTimeout();
  }
});

billBubble.addEventListener("mouseenter", () => {
  billPanelContent.style.display = "block";
  clearTimeout(hideTimeout);
});

billBubble.addEventListener("mouseleave", () => {
  resetHideTimeout();
});

function resetHideTimeout() {
  clearTimeout(hideTimeout);
  hideTimeout = setTimeout(() => {
    billPanelContent.style.display = "none";
  }, 3000);
}

window.onload = () => {
  filterItems("all");
  billPanelContent.style.display = "none";
};

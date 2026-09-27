let cartList = document.querySelector('#cart-list');
let emptyCart = document.querySelector('#empty-cart');
let subtotalElement = document.querySelector('#subtotal');
let taxElement = document.querySelector('#tax');
let discountElement = document.querySelector('#discount');
let totalPriceElement = document.querySelector('#total-price');
let updateCartButton = document.querySelector('#update-cart');
let checkoutButton = document.querySelector('#checkout-button');
let checkoutModal = document.querySelector('#checkout-modal');
let closeModal = document.querySelector('#close-modal');
let modalOk = document.querySelector('#modal-ok');
let logoutIcon = document.querySelector('#logout-icon');

window.onload = () => {
    if (localStorage.getItem('pzsvnpu') == 'aybl') {
        // return;
    } else {
        window.location.href = 'login.html';
    }
};

let getCart = () => {
    return JSON.parse(localStorage.getItem('cart')) || [];
};

let saveCart = cart => {
    localStorage.setItem('cart', JSON.stringify(cart));
};

let formatPrice = price => {
    return '$ ' + price.toFixed(2);
};

let renderCart = () => {
    let cart = getCart();

    cartList.innerHTML = '';

    if (cart.length === 0) {
        emptyCart.classList.remove('hidden');
        updateSummary([]);
        return;
    }

    emptyCart.classList.add('hidden');

    cart.forEach(product => {
        cartList.innerHTML += `
            <article class="cart-item">
                <div class="cart-product">
                    <img src="${product.thumbnail}" alt="${product.title}" class="cart-product-image">
                    <div class="cart-product-info">
                        <h3>${product.title}</h3>
                        <p>Premium Beauty Product</p>
                    </div>
                </div>

                <div class="cart-price">
                    ${formatPrice(product.price)}
                </div>

                <div class="cart-quantity">
                    <input
                        type="number"
                        min="1"
                        value="${product.quantity}"
                        data-id="${product.id}"
                    >
                </div>

                <div class="cart-total">
                    ${formatPrice(product.price * product.quantity)}
                </div>

                <button
                    class="btn-remove"
                    type="button"
                    data-id="${product.id}"
                >
                    x
                </button>
            </article>
        `;
    });

    updateSummary(cart);
};

let updateSummary = cart => {
    let subtotal = cart.reduce((total, product) => {
        return total + product.price * product.quantity;
    }, 0);

    let tax = subtotal * 0.11;
    let discount = 0;
    let total = subtotal + tax - discount;

    subtotalElement.textContent = formatPrice(subtotal);
    taxElement.textContent = formatPrice(tax);
    discountElement.textContent = '−' + formatPrice(discount);
    totalPriceElement.textContent = formatPrice(total);
};

cartList.addEventListener('click', event => {
    let removeButton = event.target.closest('.btn-remove');

    if (!removeButton) {
        return;
    }

    let productId = Number(removeButton.dataset.id);
    let cart = getCart();

    cart = cart.filter(product => product.id !== productId);

    saveCart(cart);
    renderCart();
});

updateCartButton.addEventListener('click', () => {
    let cart = getCart();
    let quantityInputs = cartList.querySelectorAll('.cart-quantity input');

    quantityInputs.forEach(input => {
        let productId = Number(input.dataset.id);
        let quantity = Number(input.value);
        let product = cart.find(item => item.id === productId);

        if (product) {
            product.quantity = quantity < 1 ? 1 : quantity;
        }
    });

    saveCart(cart);
    renderCart();
});

checkoutButton.addEventListener('click', () => {
    let cart = getCart();

    if (cart.length === 0) {
        alert('Keranjang masih kosong.');
        return;
    }

    localStorage.removeItem('cart');
    renderCart();
    checkoutModal.classList.add('show');
});

closeModal.addEventListener('click', () => {
    checkoutModal.classList.remove('show');
});

modalOk.addEventListener('click', () => {
    checkoutModal.classList.remove('show');
});

checkoutModal.addEventListener('click', event => {
    if (event.target === checkoutModal) {
        checkoutModal.classList.remove('show');
    }
});

renderCart();

logoutIcon.addEventListener('click', () => {
    // console.log('sehh');
    localStorage.removeItem('pzsvnpu');
    localStorage.removeItem('firstName');
    // localStorage.removeItem("pzsvnpu")
    localStorage.removeItem('cart');

    window.location.href = 'login.html';
});

let productCon = document.querySelector('.products-grid');
let productPage = 0;
let productMoreBtn = document.querySelector('.btn-more');
let productArr = [];
let filterCat = document.querySelector('#filter-category');
let filterSort = document.querySelector('#filter-sort');
let filterBtn = document.querySelector('#btn-apply-filter');

window.onload = async () => {
    productCon.innerHTML = '';
    await loadProduct(productPage);
    await loadCat();
};

let renderProducts = arr => {
    if (arr.length === 0) {
        productCon.innerHTML = `<p class="empty-msg">Tidak ada produk yang cocok.</p>`;
        return;
    }

    productCon.innerHTML = '';

    arr.forEach(e => {
        productCon.innerHTML += `
            <div class="product-card">
                <div class="product-image">
                    <img src="${e.images[0]}" alt="${e.title}">
                </div>
                <div class="product-info">
                    <h3 class="product-name">${e.title}</h3>
                    <div class="product-rating">
                        <span class="stars">★</span>
                        <span class="rating-count">(${e.rating})</span>
                    </div>
                    <p class="product-price">$ ${e.price}</p>
                    <button type="button" class="btn btn-add-cart" data-id="${e.id}">
                        ADD TO CART
                    </button>
                </div>
            </div>
        `;
    });

    document.querySelectorAll('.btn-add-cart').forEach(button => {
        button.addEventListener('click', () => {
            let productId = Number(button.dataset.id);
            let product = productArr.find(item => item.id === productId);

            addToCart(product);
        });
    });
};

let addToCart = product => {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    let existingProduct = cart.find(item => item.id === product.id);

    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            title: product.title,
            price: product.price,
            thumbnail: product.thumbnail,
            quantity: 1
        });
    }

    localStorage.setItem('cart', JSON.stringify(cart));

    alert(`${product.title} berhasil ditambahkan ke keranjang`);
};

let applyFilterSort = () => {
    let cat = filterCat.value;
    let sort = filterSort.value;

    let result = [...productArr];

    if (cat) {
        result = result.filter(p => p.category === cat);
    }

    if (sort === 'rating') {
        result.sort((a, b) => b.rating - a.rating);
    } else if (sort === 'price-asc') {
        result.sort((a, b) => a.price - b.price);
    } else if (sort === 'price-desc') {
        result.sort((a, b) => b.price - a.price);
    } else if (sort === 'title-asc') {
        result.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sort === 'title-desc') {
        result.sort((a, b) => b.title.localeCompare(a.title));
    }

    renderProducts(result);
};

let loadProduct = async page => {
    let db = await fetch(`https://dummyjson.com/products?limit=10&skip=${page * 10}`);
    let data = await db.json();

    if (!data.products || data.products.length === 0) {
        productMoreBtn.textContent = 'Semua produk sudah dimuat';
        productMoreBtn.disabled = true;
        return;
    }

    data.products.forEach(e => {
        productArr.push(e);
    });

    applyFilterSort();
};

let loadCat = async () => {
    let url = await fetch(`https://dummyjson.com/products/category-list`);
    let cat = await url.json();
    filterCat.innerHTML = '<option value="" disabled selected>Pilih Kategori</option>';
    cat.forEach(e => {
        filterCat.innerHTML += `
         <option value="${e}">${e.split('-').join(' ')}</option>
        `;
    });
};

productMoreBtn.addEventListener('click', async e => {
    productPage++;
    await loadProduct(productPage);
});

filterBtn.addEventListener('click', () => {
    applyFilterSort();
});

let productCon = document.querySelector('.products-grid');
let productPage = 0;
let productMoreBtn = document.querySelector('.btn-more');
let productArr = [];
let filterCat = document.querySelector('#filter-category');
let filterSort = document.querySelector('#filter-sort');
let filterBtn = document.querySelector('#btn-apply-filter');
let searchInput = document.querySelector('.search-bar input');
let searchBtn = document.querySelector('.search-bar .btn');

let allProducts = [];
let filteredArr = [];
let displayedCount = 0;
let perPage = 10;
let isFirstLoad = true;

window.onload = async () => {
    productCon.innerHTML = '';
    await loadAllProducts();
    await loadCat();
    applyFilterSort();
};

let loadAllProducts = async () => {
    let db = await fetch(`https://dummyjson.com/products?limit=200`);
    let data = await db.json();
    allProducts = data.products;
    productArr = [...allProducts];
};

let renderProducts = arr => {
    productCon.classList.remove('empty');
    if (arr.length === 0) {
        productCon.classList.add('empty');
        productCon.innerHTML = `<p class="empty-msg">Tidak ada produk yang cocok.</p>`;
        return;
    }

    productCon.innerHTML = '';
    arr.forEach(e => {
        productCon.innerHTML += `
         <div class="product-card">
                            <div class="product-image">
                                <img
                                    src="${e.images[0]}"
                                    alt="${e.title}"
                                />
                            </div>
                            <div class="product-info">
                                <h3 class="product-name">${e.title}</h3>
                                <div class="product-rating">
                                    <span class="stars">★</span>
                                    <span class="rating-count">(${e.rating})</span>
                                </div>
                                <p class="product-price">$ ${e.price}</p>
                                <a href="keranjang.html" class="btn btn-add-cart">ADD TO CART</a>
                            </div>
                        </div>
        `;
    });
};

let updateCounter = () => {
    let total = filteredArr.length;
    let shown = Math.min(displayedCount, total);
    productMoreBtn.textContent =
        shown >= total
            ? `Semua produk sudah dimuat (${shown}/${total})`
            : `Load More (${shown}/${total})`;
    productMoreBtn.disabled = shown >= total;
};

let searchText = '';

let applyFilterSort = () => {
    let result = [...allProducts];
    let cat, sort;
    if (isFirstLoad) {
        cat = '';
        sort = '';
    } else {
        cat = filterCat.value;
        sort = filterSort.value;

        if (searchText) {
            result = result.filter(p => p.title.toLowerCase().includes(searchText));
        }

        if (cat) {
            result = result.filter(p => p.category === cat);
        }
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
    } else if (sort === '') {
    }

    filteredArr = result;
    displayedCount = 0;
    productCon.innerHTML = '';
    isFirstLoad = false;
    loadMore();
};

let loadMore = () => {
    let next = filteredArr.slice(displayedCount, displayedCount + perPage);
    if (next.length === 0) {
        updateCounter();
        return;
    }
    displayedCount += next.length;

    productCon.classList.remove('empty');
    next.forEach(e => {
        productCon.innerHTML += `
         <div class="product-card" data-id="${e.id}">
                            <div class="product-image">
                                <img
                                    src="${e.images[0]}"
                                    alt="${e.title}"
                                />
                            </div>
                            <div class="product-info">
                                <h3 class="product-name">${e.title}</h3>
                                <div class="product-rating">
                                    <span class="stars">★</span>
                                    <span class="rating-count">(${e.rating})</span>
                                </div>
                                <p class="product-price">$ ${e.price}</p>
                                <a href="keranjang.html" class="btn btn-add-cart">ADD TO CART</a>
                            </div>
                        </div>
        `;
    });

    updateCounter();
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

let handleSearch = () => {
    searchText = searchInput.value.trim().toLowerCase();
    applyFilterSort();
};

searchBtn.addEventListener('click', () => {
    handleSearch();
});
productMoreBtn.addEventListener('click', () => {
    loadMore();
});

filterBtn.addEventListener('click', () => {
    applyFilterSort();
});

let productModal = document.querySelector('#product-modal');
let modalClose = document.querySelector('#modal-close');
let modalImg = document.querySelector('#modal-img');
let modalTitle = document.querySelector('#modal-title');
let modalRating = document.querySelector('#modal-rating');
let modalPrice = document.querySelector('#modal-price');
let modalDesc = document.querySelector('#modal-desc');
let modalAddCart = document.querySelector('#modal-add-cart');
let currentProduct = null;

let openModal = product => {
    currentProduct = product;
    modalImg.src = product.images[0];
    modalImg.alt = product.title;
    modalTitle.textContent = product.title;
    modalRating.textContent = `(${product.rating})`;
    modalPrice.textContent = `$ ${product.price}`;
    modalDesc.textContent = product.description || '';
    productModal.classList.add('active');
    document.body.style.overflow = 'hidden';
};

let closeModal = () => {
    productModal.classList.remove('active');
    document.body.style.overflow = '';
    currentProduct = null;
};

productCon.addEventListener('click', e => {
    let card = e.target.closest('.product-card');
    if (!card) return;
    if (e.target.closest('.btn-add-cart')) return;

    let id = Number(card.dataset.id);
    let product = productArr.find(p => p.id === id);
    if (product) openModal(product);
    console.log(e);
});

modalClose.addEventListener('click', closeModal);

productModal.addEventListener('click', e => {
    if (e.target === productModal) closeModal();
});

document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && productModal.classList.contains('active')) closeModal();
});

modalAddCart.addEventListener('click', () => {
    if (!currentProduct) return;
    console.log('Added to cart:', currentProduct);
    closeModal();
});

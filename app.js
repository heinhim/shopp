// app.js

document.addEventListener('DOMContentLoaded', () => {
    // This runs when the page is fully loaded

    // --- DATA & LOCAL STORAGE ---

    const products = [
        { id: 1, name: "Chicken Laps", price: 2.99, image: "images/laps.jpeg" },
        { id: 2, name: "Turkey", price: 3.49, image: "images/turkey.jpeg" },
        { id: 3, name: "Normal chicken/lepa", price: 4.99, image: "images/kote.jpeg" },
        { id: 4, name: "Gizzard", price: 5.99, image: "images/giz.jpeg" },
        { id: 5, name: "Goat meat", price: 6.49, image: "images/gm.jpeg" },
        { id: 6, name: "Hot dog/frankfurters", price: 7.99, image: "images/dogs.jpeg" },
        { id: 7, name: "Chicken Breast", price: 12.99, image: "images/breast.jpeg" },
        { id: 8, name: "Kote", price: 10.99, image: "images/kote.jpeg" },
        { id: 9, name: "Sawa", price: 15.99, image: "images/sawa.jpeg" },
        { id: 10, name: "Titus", price: 18.99, image: "images/titus.jpeg" },
        { id: 11, name: "Hake", price: 4.50, image: "images/alaska.jpeg" },
        { id: 12, name: "Mullet", price: 8.99, image: "images/mullet.jpg" },
        { id: 13, name: "Saithe", price: 3.99, image: "images/sat.jpeg" },
        { id: 14, name: "Croaker", price: 4.29, image: "images/croaker.jpeg" },
    ];

    // Functions to get/save data from localStorage
    const getStoredItems = (key) => JSON.parse(localStorage.getItem(key)) || [];
    const saveStoredItems = (key, items) => localStorage.setItem(key, JSON.stringify(items));

    // --- UI & NOTIFICATIONS ---

    const showNotification = (message) => {
        const notification = document.createElement('div');
        notification.className = 'fixed top-20 right-5 bg-green-500 text-white py-2 px-5 rounded-lg shadow-lg animate-pulse';
        notification.textContent = message;
        document.body.appendChild(notification);
        setTimeout(() => {
            notification.remove();
        }, 2000);
    };

    const updateHeaderCounters = () => {
        const cart = getStoredItems('cart');
        const wishlist = getStoredItems('wishlist');
        
        const cartIconContainer = document.getElementById('cart-icon-container');
        const wishlistIconContainer = document.getElementById('wishlist-icon-container');

        // Clear existing counters
        cartIconContainer.querySelector('.cart-counter')?.remove();
        wishlistIconContainer.querySelector('.wishlist-counter')?.remove();

        // Add cart counter
        if (cart.length > 0) {
            const cartCounter = document.createElement('span');
            cartCounter.className = 'cart-counter absolute -top-2 -right-2 bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center';
            cartCounter.textContent = cart.length;
            cartIconContainer.appendChild(cartCounter);
        }

        // Add wishlist counter
        if (wishlist.length > 0) {
            const wishlistCounter = document.createElement('span');
            wishlistCounter.className = 'wishlist-counter absolute -top-2 -right-2 bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center';
            wishlistCounter.textContent = wishlist.length;
            wishlistIconContainer.appendChild(wishlistCounter);
        }
    };
    
    // --- CORE LOGIC ---

    const addToCart = (productId) => {
        const product = products.find(p => p.id === productId);
        if (!product) return;
        
        const cart = getStoredItems('cart');
        if (cart.find(item => item.id === productId)) {
            showNotification('Item is already in your cart!');
            return;
        }
        
        cart.push({ ...product, quantity: 1 });
        saveStoredItems('cart', cart);
        updateHeaderCounters();
        showNotification(`${product.name} added to cart!`);
    };

    const addToWishlist = (productId) => {
        const product = products.find(p => p.id === productId);
        if (!product) return;

        const wishlist = getStoredItems('wishlist');
        if (wishlist.find(item => item.id === productId)) {
            showNotification('Item is already in your wishlist!');
            return;
        }
        
        wishlist.push(product);
        saveStoredItems('wishlist', wishlist);
        updateHeaderCounters();
        showNotification(`${product.name} added to wishlist!`);
    };

    // --- PAGE-SPECIFIC RENDERING ---

    // For index.html
    const renderProductsPage = () => {
        const productGrid = document.getElementById('product-grid');
        if (!productGrid) return;

        productGrid.innerHTML = products.map(product => `
            <div class="group bg-white rounded-lg shadow-md overflow-hidden transform hover:-translate-y-2 transition-transform duration-300">
                <div class="relative">
                    <img src="${product.image}" alt="${product.name}" class="w-full h-48 object-cover">
                    <div class="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center space-x-4 product-card-overlay">
                        <button data-product-id="${product.id}" class="add-to-cart-btn bg-white text-orange-500 rounded-full w-12 h-12 flex items-center justify-center hover:bg-orange-500 hover:text-white transition-colors duration-300">
                            <i class="fa-solid fa-cart-plus fa-lg"></i>
                        </button>
                        <button data-product-id="${product.id}" class="add-to-wishlist-btn bg-white text-orange-500 rounded-full w-12 h-12 flex items-center justify-center hover:bg-orange-500 hover:text-white transition-colors duration-300">
                            <i class="fa-solid fa-heart fa-lg"></i>
                        </button>
                    </div>
                </div>
                <div class="p-5 text-center">
                    <h3 class="text-lg font-semibold text-gray-800">${product.name}</h3>
                    <p class="text-orange-500 font-bold mt-2">₦${product.price.toFixed(2)}/kg</p>
                </div>
            </div>
        `).join('');

        // Add event listeners after rendering
        document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
            btn.addEventListener('click', () => addToCart(parseInt(btn.dataset.productId)));
        });
        document.querySelectorAll('.add-to-wishlist-btn').forEach(btn => {
            btn.addEventListener('click', () => addToWishlist(parseInt(btn.dataset.productId)));
        });
    };

    // For cart.html
    const renderCartPage = () => {
        const cartContainer = document.getElementById('cart-items-container');
        if (!cartContainer) return;
        
        const cart = getStoredItems('cart');
        if (cart.length === 0) {
            cartContainer.innerHTML = '<p class="text-center text-gray-500 py-8">Your cart is empty.</p>';
            return;
        }

        cartContainer.innerHTML = cart.map(item => `
            <div class="flex flex-col sm:flex-row items-center gap-6 border-b pb-6">
                <img src="${item.image}" alt="${item.name}" class="w-28 h-28 object-cover rounded-md">
                <div class="flex-grow text-center sm:text-left">
                    <h3 class="text-lg font-semibold">${item.name}</h3>
                    <p class="text-gray-500">Price: ₦${item.price.toFixed(2)}/kg</p>
                </div>
                <div class="flex items-center gap-4">
                    <input type="number" value="${item.quantity}" min="1" class="w-16 text-center border rounded-md py-1">
                    <p class="font-bold w-24 text-center">₦${(item.price * item.quantity).toFixed(2)}</p>
                    <button class="text-gray-400 hover:text-red-500 transition remove-from-cart-btn" data-product-id="${item.id}"><i class="fa-solid fa-trash"></i></button>
                </div>
            </div>
        `).join('');
    };

    // For wishlist.html
    const renderWishlistPage = () => {
        const wishlistGrid = document.getElementById('wishlist-grid');
        if (!wishlistGrid) return;
        
        const wishlist = getStoredItems('wishlist');
        if (wishlist.length === 0) {
            wishlistGrid.innerHTML = '<p class="text-center text-gray-500 py-16 col-span-full">Your wishlist is empty.</p>';
            return;
        }

        wishlistGrid.innerHTML = wishlist.map(item => `
            <div class="bg-white rounded-lg shadow-md overflow-hidden">
                <img src="${item.image}" alt="${item.name}" class="w-full h-48 object-cover">
                <div class="p-5 text-center">
                    <h3 class="text-lg font-semibold text-gray-800">${item.name}</h3>
                    <p class="text-orange-500 font-bold mt-2">₦${item.price.toFixed(2)}/kg</p>
                    <div class="mt-4 flex flex-col sm:flex-row gap-2">
                        <button class="w-full bg-orange-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-orange-600 transition add-to-cart-btn" data-product-id="${item.id}">Add to Cart</button>
                        <button class="w-full bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-md hover:bg-gray-300 transition remove-from-wishlist-btn" data-product-id="${item.id}">Remove</button>
                    </div>
                </div>
            </div>
        `).join('');
    };

    // --- INITIALIZATION ---
    updateHeaderCounters();
    renderProductsPage();
    renderCartPage();
    renderWishlistPage();

});
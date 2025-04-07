// Product Data
const products = [
    {
        id: 1,
        name: "Wireless Headphones",
        price: 99.99,
        imageUrl: "https://images.pexels.com/photos/1649771/pexels-photo-1649771.jpeg",
        description: "Premium noise-cancelling wireless headphones with 30-hour battery life."
    },
    {
        id: 2,
        name: "Smart Watch",
        price: 199.99,
        imageUrl: "https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg",
        description: "Fitness tracker with heart rate monitor and smartphone notifications."
    },
    {
        id: 3,
        name: "Bluetooth Speaker",
        price: 79.99,
        imageUrl: "https://images.pexels.com/photos/1037992/pexels-photo-1037992.jpeg",
        description: "Portable waterproof speaker with 20-hour playtime."
    }
];

// App State
let cart = [];
let orders = JSON.parse(localStorage.getItem('orderHistory') || '[]');

// DOM Elements
const productGrid = document.getElementById('product-grid');
const cartCount = document.getElementById('cart-count');

// Render Products
function renderProducts() {
    productGrid.innerHTML = products.map(product => `
        <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
            <img src="${product.imageUrl}" alt="${product.name}" class="w-full h-48 object-cover">
            <div class="p-4">
                <h3 class="font-bold text-lg mb-2">${product.name}</h3>
                <p class="text-gray-600 mb-4">${product.description}</p>
                <div class="flex justify-between items-center">
                    <span class="font-bold text-lg">$${product.price.toFixed(2)}</span>
                    <div class="space-x-2">
                        <button onclick="addToCart(${product.id})" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
                            Add to Cart
                        </button>
                        <button onclick="whatsappOrder(${product.id})" class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition">
                            <i class="fab fa-whatsapp"></i> Buy Now
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

// Add to Cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
        cart.push(product);
        updateCartCount();
        alert(`${product.name} added to cart!`);
    }
}

// Update Cart Count
function updateCartCount() {
    cartCount.textContent = cart.length;
}

// WhatsApp Order
function whatsappOrder(productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
        const message = `I want to buy ${product.name} - Price: $${product.price}\nImage: ${product.imageUrl}`;
        const encodedMessage = encodeURIComponent(message);
        window.open(`https://wa.me/?text=${encodedMessage}`, '_blank');
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
    // Load cart from localStorage if available
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartCount();
    }
});

// Save cart to localStorage before page unload
window.addEventListener('beforeunload', () => {
    localStorage.setItem('cart', JSON.stringify(cart));
    localStorage.setItem('orderHistory', JSON.stringify(orders));
});

// Complete Order
function completeOrder() {
    if (cart.length === 0) return;
    
    const order = {
        id: Date.now(),
        date: new Date().toISOString(),
        items: [...cart],
        total: cart.reduce((sum, item) => sum + item.price, 0)
    };
    
    orders.push(order);
    localStorage.setItem('orderHistory', JSON.stringify(orders));
    
    // Clear cart
    cart = [];
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    
    // Redirect to confirmation
    window.location.href = 'order-confirmation.html';
}

// Update checkout form submission in checkout.html
function setupCheckoutForm() {
    const form = document.getElementById('checkout-form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Simple validation
            const requiredFields = ['first-name', 'last-name', 'email', 'address', 'city', 'state', 'zip'];
            let isValid = true;

            requiredFields.forEach(fieldId => {
                const field = document.getElementById(fieldId);
                if (!field.value.trim()) {
                    field.classList.add('border-red-500');
                    isValid = false;
                } else {
                    field.classList.remove('border-red-500');
                }
            });

            if (isValid) {
                completeOrder();
            } else {
                alert('Please fill in all required fields');
            }
        });
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
    updateCartCount();
    setupCheckoutForm();
    
    // Load cart from localStorage if available
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartCount();
    }
});

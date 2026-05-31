// Products Database
const products = [
    {
        id: 1,
        name: "حديد تسليح 12 ملم",
        category: "حديد",
        price: 45,
        description: "حديد تسليح عالي الجودة - الطول 12 متر"
    },
    {
        id: 2,
        name: "حديد تسليح 16 ملم",
        category: "حديد",
        price: 55,
        description: "حديد تسليح متوسط - الطول 12 متر"
    },
    {
        id: 3,
        name: "حديد مفاتيح",
        category: "حديد",
        price: 35,
        description: "حديد مفاتيح عالي الجودة"
    },
    {
        id: 4,
        name: "زوايا حديد",
        category: "حديد",
        price: 40,
        description: "زوايا حديد متنوعة الأحجام"
    },
    {
        id: 5,
        name: "بوية بيضاء داخلية",
        category: "بويات",
        price: 65,
        description: "بوية داخلية عالية الجودة - 20 لتر"
    },
    {
        id: 6,
        name: "بوية خارجية مقاوم للعوامل",
        category: "بويات",
        price: 85,
        description: "بوية خارجية - مقاومة للشمس والرطوبة"
    },
    {
        id: 7,
        name: "بوية أساس (بريمر)",
        category: "بويات",
        price: 50,
        description: "بوية أساس للخشب والمعادن"
    },
    {
        id: 8,
        name: "بوية لامعة بيضاء",
        category: "بويات",
        price: 70,
        description: "بوية لامعة براقة - 20 لتر"
    },
    {
        id: 9,
        name: "أنابيب حديد مختلفة",
        category: "حديد",
        price: 30,
        description: "أنابيب حديد - أقطار مختلفة"
    },
    {
        id: 10,
        name: "شبك حديد",
        category: "حديد",
        price: 25,
        description: "شبك حديد متنوع الأحجام"
    }
];

// Shopping Cart
let cart = [];

// Load Products on Page Load
document.addEventListener('DOMContentLoaded', function() {
    loadProducts();
    loadCartFromStorage();
    updateCartCount();
});

// Load Products to Page
function loadProducts() {
    const productsGrid = document.getElementById('products-grid');
    productsGrid.innerHTML = '';
    
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        
        const icon = product.category === 'حديد' ? '🔧' : '🎨';
        
        productCard.innerHTML = `
            <div class="product-image">${icon}</div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <div class="product-price">${product.price} ريال</div>
                <button class="add-to-cart" onclick="addToCart(${product.id})">أضف للسلة</button>
            </div>
        `;
        
        productsGrid.appendChild(productCard);
    });
}

// Add to Cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    saveCartToStorage();
    updateCartCount();
    showNotification(`تم إضافة ${product.name} للسلة`);
}

// Remove from Cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCartToStorage();
    updateCartCount();
    displayCart();
}

// Update Cart Count
function updateCartCount() {
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    document.getElementById('cart-count').textContent = count;
}

// Display Cart
function displayCart() {
    const cartItemsDiv = document.getElementById('cart-items');
    
    if (cart.length === 0) {
        cartItemsDiv.innerHTML = '<p>السلة فارغة</p>';
        document.getElementById('total-price').textContent = '0';
        return;
    }
    
    let html = '';
    let total = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        html += `
            <div class="cart-item">
                <div class="cart-item-details">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">${item.price} ريال × ${item.quantity} = ${itemTotal} ريال</div>
                </div>
                <button class="remove-btn" onclick="removeFromCart(${item.id})">حذف</button>
            </div>
        `;
    });
    
    cartItemsDiv.innerHTML = html;
    document.getElementById('total-price').textContent = total;
}

// Toggle Cart Modal
function toggleCart() {
    const modal = document.getElementById('cart-modal');
    if (modal.style.display === 'none' || modal.style.display === '') {
        displayCart();
        modal.style.display = 'block';
    } else {
        modal.style.display = 'none';
    }
}

// Close Cart when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('cart-modal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
}

// Checkout
function checkout() {
    if (cart.length === 0) {
        alert('السلة فارغة!');
        return;
    }
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const cartSummary = cart.map(item => `${item.name} × ${item.quantity}`).join('\n');
    
    alert(`شكراً لك!\n\nملخص الطلب:\n${cartSummary}\n\nالإجمالي: ${total} ريال\n\nسيتم التواصل معك قريباً للتأكيد`);
    
    cart = [];
    saveCartToStorage();
    updateCartCount();
    toggleCart();
    loadProducts();
}

// Handle Contact Form
function handleContact(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    
    alert('شكراً على تواصلك معنا!\nسنرد عليك في أقرب وقت ممكن');
    form.reset();
}

// Show Notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background: #28a745;
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        z-index: 1000;
        animation: slideIn 0.3s ease-in-out;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Local Storage for Cart
function saveCartToStorage() {
    localStorage.setItem('alharabi-cart', JSON.stringify(cart));
}

function loadCartFromStorage() {
    const savedCart = localStorage.getItem('alharabi-cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }
}

// Add animation
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);

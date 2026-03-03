        // ========== STATE MANAGEMENT ==========
        class Store {
            static users = JSON.parse(localStorage.getItem('users')) || [];
            static products = JSON.parse(localStorage.getItem('products')) || [];
            static reviews = JSON.parse(localStorage.getItem('reviews')) || [];
            static cart = JSON.parse(localStorage.getItem('cart')) || [];
            static orders = JSON.parse(localStorage.getItem('orders')) || [];
            static currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;

            // Save methods
            static saveUsers() {
                localStorage.setItem('users', JSON.stringify(this.users));
            }

            static saveProducts() {
                localStorage.setItem('products', JSON.stringify(this.products));
            }

            static saveReviews() {
                localStorage.setItem('reviews', JSON.stringify(this.reviews));
            }

            static saveCart() {
                localStorage.setItem('cart', JSON.stringify(this.cart));
                this.updateCartBadge();
            }

            static saveOrders() {
                localStorage.setItem('orders', JSON.stringify(this.orders));
            }

            static saveCurrentUser() {
                localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
            }

            static updateCartBadge() {
                const count = this.cart.reduce((acc, item) => acc + item.quantity, 0);
                document.getElementById('cart-count').textContent = count;
            }

            // Initialize default data
            static initializeData() {
                // Default products if none exist
                if (this.products.length === 0) {
                    this.products = [
                        { id: '1', name: 'Premium Wireless Headphones', price: 299, category: 'Electronics', rating: 4.8, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300', stock: 15, description: 'High-quality wireless headphones with noise cancellation, 30-hour battery life, and premium sound quality.' },
                        { id: '2', name: 'Smart Watch Series 5', price: 399, category: 'Electronics', rating: 4.7, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300', stock: 8, description: 'Advanced smartwatch with health tracking, GPS, and cellular connectivity.' },
                        { id: '3', name: 'Designer Backpack', price: 89, category: 'Fashion', rating: 4.5, image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300', stock: 25, description: 'Stylish and durable backpack perfect for daily use or travel.' },
                        { id: '4', name: 'Mechanical Keyboard', price: 159, category: 'Electronics', rating: 4.9, image: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=300', stock: 12, description: 'RGB mechanical keyboard with custom switches and programmable keys.' },
                        { id: '5', name: 'Running Shoes', price: 129, category: 'Fashion', rating: 4.6, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300', stock: 20, description: 'Lightweight running shoes with advanced cushioning technology.' },
                        { id: '6', name: 'Coffee Maker', price: 199, category: 'Home', rating: 4.4, image: 'https://images.unsplash.com/photo-1517668808822-9ebb7a0c6f1d?w=300', stock: 7, description: 'Programmable coffee maker with built-in grinder and thermal carafe.' }
                    ];
                    this.saveProducts();
                }

                // Default users if none exist
                if (this.users.length === 0) {
                    this.users = [
                        { id: 'admin1', name: 'Admin User', email: 'admin@nexus.com', password: 'admin123', role: 'admin' },
                        { id: 'user1', name: 'John Doe', email: 'john@example.com', password: 'user123', role: 'user' }
                    ];
                    this.saveUsers();
                }

                // Default reviews if none exist
                if (this.reviews.length === 0) {
                    this.reviews = [
                        { id: 'r1', productId: '1', userId: 'user1', userName: 'John Doe', rating: 5, text: 'Amazing sound quality! Highly recommended.', date: '2024-01-15' },
                        { id: 'r2', productId: '1', userId: 'user2', userName: 'Jane Smith', rating: 4, text: 'Great headphones, but a bit pricey.', date: '2024-01-20' }
                    ];
                    this.saveReviews();
                }
            }
        }

        // Initialize data
        Store.initializeData();

        // ========== UTILITY FUNCTIONS ==========
        function showToast(message, type = 'success') {
            const toast = document.createElement('div');
            toast.className = `toast ${type}`;
            toast.innerHTML = `
                <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
                <span>${message}</span>
            `;
            document.getElementById('toast-container').appendChild(toast);
            setTimeout(() => toast.remove(), 3000);
        }

        function closeModal() {
            document.getElementById('modal-container').innerHTML = '';
        }

        function isAdmin() {
            return Store.currentUser && Store.currentUser.role === 'admin';
        }

        function updateUIBasedOnUser() {
            const authBtn = document.getElementById('auth-btn');
            const adminLink = document.getElementById('admin-link');
            
            if (Store.currentUser) {
                authBtn.innerHTML = '<i class="fas fa-sign-out-alt"></i> Logout';
                adminLink.style.display = isAdmin() ? 'flex' : 'none';
            } else {
                authBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Login';
                adminLink.style.display = 'none';
            }
        }

        // ========== AUTHENTICATION SYSTEM ==========
        function showAuthModal() {
            const modal = document.createElement('div');
            modal.className = 'modal';
            modal.innerHTML = `
                <div class="modal-content">
                    <h2 style="margin-bottom: 2rem;"><i class="fas fa-lock"></i> Authentication</h2>
                    <div style="display: flex; flex-direction: column; gap: 1rem;">
                        <input type="email" id="login-email" class="filter-input" placeholder="Email" value="john@example.com">
                        <input type="password" id="login-password" class="filter-input" placeholder="Password" value="user123">
                        <input type="text" id="register-name" class="filter-input" placeholder="Full Name (for registration)">
                        <div style="display: flex; gap: 1rem; margin-top: 1rem;">
                            <button class="btn btn-primary" id="login-btn">Login</button>
                            <button class="btn btn-secondary" id="register-btn">Register</button>
                            <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
                        </div>
                    </div>
                </div>
            `;
            document.getElementById('modal-container').innerHTML = '';
            document.getElementById('modal-container').appendChild(modal);

            document.getElementById('login-btn').addEventListener('click', () => {
                const email = document.getElementById('login-email').value;
                const password = document.getElementById('login-password').value;
                
                // Form validation
                if (!email || !password) {
                    showToast('Please fill all fields', 'error');
                    return;
                }

                const user = Store.users.find(u => u.email === email && u.password === password);
                if (user) {
                    Store.currentUser = user;
                    Store.saveCurrentUser();
                    closeModal();
                    updateUIBasedOnUser();
                    showToast(`Welcome back, ${user.name}!`);
                    renderPage('home');
                } else {
                    showToast('Invalid credentials', 'error');
                }
            });

            document.getElementById('register-btn').addEventListener('click', () => {
                const name = document.getElementById('register-name').value;
                const email = document.getElementById('login-email').value;
                const password = document.getElementById('login-password').value;

                // Form validation
                if (!name || !email || !password) {
                    showToast('All fields are required', 'error');
                    return;
                }

                if (Store.users.find(u => u.email === email)) {
                    showToast('Email already exists', 'error');
                    return;
                }

                const newUser = {
                    id: 'user' + Date.now(),
                    name,
                    email,
                    password,
                    role: 'user'
                };

                Store.users.push(newUser);
                Store.saveUsers();
                Store.currentUser = newUser;
                Store.saveCurrentUser();
                closeModal();
                updateUIBasedOnUser();
                showToast('Registration successful!');
                renderPage('home');
            });
        }

        // ========== RENDER PAGES ==========
        function renderPage(page) {
            const container = document.getElementById('app-container');
            
            // Show loading spinner
            container.innerHTML = '<div class="spinner"></div>';
            
            setTimeout(() => {
                switch(page) {
                    case 'home':
                        container.innerHTML = renderHomePage();
                        attachHomeListeners();
                        break;
                    case 'cart':
                        container.innerHTML = renderCartPage();
                        attachCartListeners();
                        break;
                    case 'profile':
                        container.innerHTML = renderProfilePage();
                        attachProfileListeners();
                        break;
                    case 'orders':
                        container.innerHTML = renderOrdersPage();
                        attachOrdersListeners();
                        break;
                    case 'admin':
                        if (isAdmin()) {
                            container.innerHTML = renderAdminPage();
                            attachAdminListeners();
                        } else {
                            showToast('Access denied. Admin only.', 'error');
                            renderPage('home');
                        }
                        break;
                    default:
                        container.innerHTML = renderHomePage();
                        attachHomeListeners();
                }
            }, 300); // Simulate loading
        }

        // ========== HOME PAGE (Product Listing) ==========
        function renderHomePage() {
            let products = Store.products;
            
            return `
                <div class="filter-bar">
                    <div class="filter-group">
                        <input type="text" id="search-input" class="filter-input" placeholder="🔍 Search by product name...">
                        <select id="category-filter" class="filter-select">
                            <option value="">All Categories</option>
                            <option value="Electronics">Electronics</option>
                            <option value="Fashion">Fashion</option>
                            <option value="Home">Home</option>
                        </select>
                        <select id="price-filter" class="filter-select">
                            <option value="">Price Range</option>
                            <option value="0-50">Under $50</option>
                            <option value="50-100">$50 - $100</option>
                            <option value="100-200">$100 - $200</option>
                            <option value="200+">$200+</option>
                        </select>
                        <select id="rating-filter" class="filter-select">
                            <option value="">Rating</option>
                            <option value="4">4+ Stars</option>
                            <option value="3">3+ Stars</option>
                            <option value="2">2+ Stars</option>
                        </select>
                        <select id="sort-filter" class="filter-select">
                            <option value="">Sort By</option>
                            <option value="price-low">Price: Low to High</option>
                            <option value="price-high">Price: High to Low</option>
                            <option value="rating">Rating</option>
                        </select>
                        <button class="btn btn-primary" id="apply-filters">
                            <i class="fas fa-filter"></i> Apply Filters
                        </button>
                    </div>
                </div>
                <div class="product-grid" id="product-grid">
                    ${products.map(product => `
                        <div class="card">
                            <img src="${product.image}" class="product-image" alt="${product.name}">
                            <h3 class="product-name">${product.name}</h3>
                            <div class="product-price">$${product.price}</div>
                            <div class="product-category">${product.category}</div>
                            <div class="rating">
                                ${generateStars(product.rating)}
                                <span>(${product.rating})</span>
                            </div>
                            <div style="display: flex; gap: 0.5rem;">
                                <button class="btn btn-primary btn-sm add-to-cart" data-id="${product.id}">
                                    <i class="fas fa-cart-plus"></i> Add
                                </button>
                                <button class="btn btn-secondary btn-sm view-details" data-id="${product.id}">
                                    <i class="fas fa-eye"></i> Details
                                </button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
        }

        function generateStars(rating) {
            let stars = '';
            for (let i = 1; i <= 5; i++) {
                if (i <= Math.floor(rating)) {
                    stars += '<i class="fas fa-star"></i>';
                } else if (i === Math.ceil(rating) && rating % 1 !== 0) {
                    stars += '<i class="fas fa-star-half-alt"></i>';
                } else {
                    stars += '<i class="far fa-star"></i>';
                }
            }
            return stars;
        }

        function attachHomeListeners() {
            // Filter functionality
            document.getElementById('apply-filters').addEventListener('click', () => {
                const searchTerm = document.getElementById('search-input').value.toLowerCase();
                const category = document.getElementById('category-filter').value;
                const priceRange = document.getElementById('price-filter').value;
                const minRating = document.getElementById('rating-filter').value;
                const sortBy = document.getElementById('sort-filter').value;

                let filteredProducts = Store.products.filter(product => {
                    // Search filter
                    if (searchTerm && !product.name.toLowerCase().includes(searchTerm)) return false;
                    
                    // Category filter
                    if (category && product.category !== category) return false;
                    
                    // Price filter
                    if (priceRange) {
                        const [min, max] = priceRange.split('-').map(Number);
                        if (max) {
                            if (product.price < min || product.price > max) return false;
                        } else {
                            if (product.price < 200) return false;
                        }
                    }
                    
                    // Rating filter
                    if (minRating && product.rating < parseFloat(minRating)) return false;
                    
                    return true;
                });

                // Sorting
                if (sortBy) {
                    switch(sortBy) {
                        case 'price-low':
                            filteredProducts.sort((a, b) => a.price - b.price);
                            break;
                        case 'price-high':
                            filteredProducts.sort((a, b) => b.price - a.price);
                            break;
                        case 'rating':
                            filteredProducts.sort((a, b) => b.rating - a.rating);
                            break;
                    }
                }

                // Re-render grid
                const grid = document.getElementById('product-grid');
                grid.innerHTML = filteredProducts.map(product => `
                    <div class="card">
                        <img src="${product.image}" class="product-image" alt="${product.name}">
                        <h3 class="product-name">${product.name}</h3>
                        <div class="product-price">$${product.price}</div>
                        <div class="product-category">${product.category}</div>
                        <div class="rating">
                            ${generateStars(product.rating)}
                            <span>(${product.rating})</span>
                        </div>
                        <div style="display: flex; gap: 0.5rem;">
                            <button class="btn btn-primary btn-sm add-to-cart" data-id="${product.id}">
                                <i class="fas fa-cart-plus"></i> Add
                            </button>
                            <button class="btn btn-secondary btn-sm view-details" data-id="${product.id}">
                                <i class="fas fa-eye"></i> Details
                            </button>
                        </div>
                    </div>
                `).join('');

                // Re-attach listeners
                attachProductListeners();
            });

            attachProductListeners();
        }

        function attachProductListeners() {
            // Add to cart
            document.querySelectorAll('.add-to-cart').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const productId = e.target.closest('button').dataset.id;
                    addToCart(productId);
                });
            });

            // View details
            document.querySelectorAll('.view-details').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const productId = e.target.closest('button').dataset.id;
                    showProductDetails(productId);
                });
            });
        }

        // ========== ADD TO CART FUNCTION ==========
        function addToCart(productId) {
            const existingItem = Store.cart.find(item => item.id === productId);
            
            if (existingItem) {
                existingItem.quantity++;
            } else {
                Store.cart.push({ id: productId, quantity: 1 });
            }
            
            Store.saveCart();
            showToast('Product added to cart!');
        }

        // ========== PRODUCT DETAILS PAGE ==========
        function showProductDetails(productId) {
            const product = Store.products.find(p => p.id === productId);
            if (!product) return;

            const productReviews = Store.reviews.filter(r => r.productId === productId);
            const avgRating = productReviews.length > 0 
                ? (productReviews.reduce((acc, r) => acc + r.rating, 0) / productReviews.length).toFixed(1)
                : product.rating;

            const container = document.getElementById('app-container');
            container.innerHTML = `
                <div class="product-details">
                    <div class="product-gallery">
                        <img src="${product.image}" class="main-image" id="main-image" alt="${product.name}">
                        <div class="thumbnail-gallery">
                            <img src="${product.image}" class="thumbnail active" onclick="document.getElementById('main-image').src='${product.image}'">
                            <img src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300" class="thumbnail" onclick="document.getElementById('main-image').src='https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300'">
                            <img src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300" class="thumbnail" onclick="document.getElementById('main-image').src='https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300'">
                        </div>
                    </div>
                    
                    <div class="product-info">
                        <h1 class="product-title">${product.name}</h1>
                        <p class="product-description">${product.description}</p>
                        
                        <div class="price-section">
                            <span class="current-price">$${product.price}</span>
                            <span class="stock-status ${product.stock > 0 ? 'in-stock' : 'out-of-stock'}">
                                <i class="fas ${product.stock > 0 ? 'fa-check-circle' : 'fa-times-circle'}"></i>
                                ${product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                            </span>
                        </div>
                        
                        <div class="rating-stars">
                            <div class="stars">${generateStars(avgRating)}</div>
                            <span class="rating-count">(${productReviews.length} reviews)</span>
                        </div>
                        
                        <div class="action-buttons">
                            <button class="btn btn-primary" id="details-add-to-cart" data-id="${product.id}">
                                <i class="fas fa-cart-plus"></i> Add to Cart
                            </button>
                            <button class="btn btn-success" id="buy-now" data-id="${product.id}">
                                <i class="fas fa-bolt"></i> Buy Now
                            </button>
                        </div>
                    </div>
                </div>
                
                <div class="reviews-section">
                    <h2 style="margin-bottom: 2rem;">Customer Reviews</h2>
                    
                    ${Store.currentUser ? `
                        <div class="review-form">
                            <h3>Write a Review</h3>
                            <div class="rating-input" id="rating-input">
                                <i class="far fa-star" data-rating="1"></i>
                                <i class="far fa-star" data-rating="2"></i>
                                <i class="far fa-star" data-rating="3"></i>
                                <i class="far fa-star" data-rating="4"></i>
                                <i class="far fa-star" data-rating="5"></i>
                            </div>
                            <textarea id="review-text" class="filter-input" placeholder="Write your review..." rows="4"></textarea>
                            <button class="btn btn-primary" id="submit-review" style="margin-top: 1rem;">
                                <i class="fas fa-paper-plane"></i> Submit Review
                            </button>
                        </div>
                    ` : `
                        <p style="text-align: center; padding: 2rem;">
                            <i class="fas fa-lock"></i> Please login to write a review
                        </p>
                    `}
                    
                    <div id="reviews-list">
                        ${productReviews.map(review => `
                            <div class="review-card">
                                <div class="review-header">
                                    <span class="reviewer-name">${review.userName}</span>
                                    <span class="review-date">${review.date}</span>
                                </div>
                                <div class="rating">${generateStars(review.rating)}</div>
                                <p style="margin-top: 1rem;">${review.text}</p>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;

            // Add to cart from details
            document.getElementById('details-add-to-cart').addEventListener('click', () => {
                addToCart(product.id);
            });

            // Buy now
            document.getElementById('buy-now').addEventListener('click', () => {
                if (!Store.currentUser) {
                    showToast('Please login to buy', 'error');
                    showAuthModal();
                    return;
                }
                addToCart(product.id);
                renderPage('cart');
            });

            // Rating input
            if (Store.currentUser) {
                const stars = document.querySelectorAll('#rating-input i');
                let selectedRating = 0;

                stars.forEach(star => {
                    star.addEventListener('mouseover', () => {
                        const rating = parseInt(star.dataset.rating);
                        stars.forEach((s, i) => {
                            if (i < rating) {
                                s.className = 'fas fa-star';
                            } else {
                                s.className = 'far fa-star';
                            }
                        });
                    });

                    star.addEventListener('mouseout', () => {
                        stars.forEach((s, i) => {
                            if (i < selectedRating) {
                                s.className = 'fas fa-star';
                            } else {
                                s.className = 'far fa-star';
                            }
                        });
                    });

                    star.addEventListener('click', () => {
                        selectedRating = parseInt(star.dataset.rating);
                    });
                });

                // Submit review
                document.getElementById('submit-review').addEventListener('click', () => {
                    const text = document.getElementById('review-text').value;
                    
                    if (!selectedRating) {
                        showToast('Please select a rating', 'error');
                        return;
                    }

                    if (!text) {
                        showToast('Please write a review', 'error');
                        return;
                    }

                    const newReview = {
                        id: 'r' + Date.now(),
                        productId: product.id,
                        userId: Store.currentUser.id,
                        userName: Store.currentUser.name,
                        rating: selectedRating,
                        text: text,
                        date: new Date().toISOString().split('T')[0]
                    };

                    Store.reviews.push(newReview);
                    Store.saveReviews();
                    showToast('Review submitted!');
                    showProductDetails(product.id);
                });
            }
        }

        // ========== CART PAGE ==========
        function renderCartPage() {
            if (Store.cart.length === 0) {
                return `
                    <div style="text-align: center; padding: 4rem;">
                        <i class="fas fa-shopping-cart" style="font-size: 5rem; color: var(--text-muted-light);"></i>
                        <h2 style="margin: 2rem 0;">Your cart is empty</h2>
                        <button class="btn btn-primary" onclick="renderPage('home')">
                            <i class="fas fa-store"></i> Continue Shopping
                        </button>
                    </div>
                `;
            }

            const cartItems = Store.cart.map(item => {
                const product = Store.products.find(p => p.id === item.id);
                return { ...product, quantity: item.quantity };
            });

            const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
            const tax = subtotal * 0.1;
            const total = subtotal + tax;

            return `
                <div class="cart-container">
                    <div class="cart-items">
                        <h2 style="margin-bottom: 2rem;">Shopping Cart (${Store.cart.length} items)</h2>
                        ${cartItems.map(item => `
                            <div class="cart-item">
                                <img src="${item.image}" class="cart-item-image" alt="${item.name}">
                                <div class="cart-item-details">
                                    <h4>${item.name}</h4>
                                    <p>$${item.price}</p>
                                </div>
                                <div class="quantity-controls">
                                    <button class="quantity-btn" onclick="updateCartQuantity('${item.id}', -1)">
                                        <i class="fas fa-minus"></i>
                                    </button>
                                    <span>${item.quantity}</span>
                                    <button class="quantity-btn" onclick="updateCartQuantity('${item.id}', 1)">
                                        <i class="fas fa-plus"></i>
                                    </button>
                                </div>
                                <div class="cart-item-total">
                                    <strong>$${(item.price * item.quantity).toFixed(2)}</strong>
                                </div>
                                <button class="btn btn-danger btn-sm" onclick="removeFromCart('${item.id}')">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        `).join('')}
                    </div>
                    
                    <div class="cart-summary">
                        <h3 style="margin-bottom: 2rem;">Order Summary</h3>
                        <div class="summary-row">
                            <span>Subtotal</span>
                            <span>$${subtotal.toFixed(2)}</span>
                        </div>
                        <div class="summary-row">
                            <span>Tax (10%)</span>
                            <span>$${tax.toFixed(2)}</span>
                        </div>
                        <div class="summary-row summary-total">
                            <span>Total</span>
                            <span>$${total.toFixed(2)}</span>
                        </div>
                        <button class="btn btn-primary" style="width: 100%; margin-top: 2rem;" id="checkout-btn">
                            <i class="fas fa-credit-card"></i> Proceed to Checkout
                        </button>
                        <button class="btn btn-secondary" style="width: 100%; margin-top: 1rem;" onclick="clearCart()">
                            <i class="fas fa-trash-alt"></i> Clear Cart
                        </button>
                    </div>
                </div>
            `;
        }

        function attachCartListeners() {
            document.getElementById('checkout-btn')?.addEventListener('click', () => {
                if (!Store.currentUser) {
                    showToast('Please login to checkout', 'error');
                    showAuthModal();
                    return;
                }
                showCheckoutModal();
            });
        }

        // Cart functions (global)
        window.updateCartQuantity = function(productId, change) {
            const item = Store.cart.find(i => i.id === productId);
            if (item) {
                item.quantity += change;
                if (item.quantity <= 0) {
                    Store.cart = Store.cart.filter(i => i.id !== productId);
                }
                Store.saveCart();
                renderPage('cart');
            }
        };

        window.removeFromCart = function(productId) {
            Store.cart = Store.cart.filter(i => i.id !== productId);
            Store.saveCart();
            showToast('Item removed from cart');
            renderPage('cart');
        };

        window.clearCart = function() {
            Store.cart = [];
            Store.saveCart();
            showToast('Cart cleared');
            renderPage('cart');
        };

        // ========== CHECKOUT SYSTEM ==========
        function showCheckoutModal() {
            const cartItems = Store.cart.map(item => {
                const product = Store.products.find(p => p.id === item.id);
                return { ...product, quantity: item.quantity };
            });

            const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
            const tax = subtotal * 0.1;
            const total = subtotal + tax;

            const modal = document.createElement('div');
            modal.className = 'modal';
            modal.innerHTML = `
                <div class="modal-content">
                    <h2 style="margin-bottom: 2rem;"><i class="fas fa-credit-card"></i> Checkout</h2>
                    
                    <div class="checkout-form">
                        <div class="form-grid">
                            <div class="form-group">
                                <label>Full Name</label>
                                <input type="text" id="full-name" value="${Store.currentUser.name}">
                            </div>
                            <div class="form-group">
                                <label>Email</label>
                                <input type="email" id="email" value="${Store.currentUser.email}">
                            </div>
                            <div class="form-group">
                                <label>Phone</label>
                                <input type="tel" id="phone" placeholder="+1 234 567 8900">
                            </div>
                            <div class="form-group">
                                <label>Address</label>
                                <input type="text" id="address" placeholder="Street Address">
                            </div>
                            <div class="form-group">
                                <label>City</label>
                                <input type="text" id="city" placeholder="City">
                            </div>
                            <div class="form-group">
                                <label>State</label>
                                <input type="text" id="state" placeholder="State">
                            </div>
                            <div class="form-group">
                                <label>Zip Code</label>
                                <input type="text" id="zip" placeholder="Zip Code">
                            </div>
                            <div class="form-group">
                                <label>Payment Method</label>
                                <select id="payment-method">
                                    <option value="COD">Cash on Delivery</option>
                                    <option value="UPI">UPI</option>
                                    <option value="Card">Credit/Debit Card</option>
                                </select>
                            </div>
                        </div>
                        
                        <div style="margin: 2rem 0;">
                            <h3>Order Summary</h3>
                            <div class="summary-row">
                                <span>Subtotal</span>
                                <span>$${subtotal.toFixed(2)}</span>
                            </div>
                            <div class="summary-row">
                                <span>Tax (10%)</span>
                                <span>$${tax.toFixed(2)}</span>
                            </div>
                            <div class="summary-row summary-total">
                                <span>Total</span>
                                <span>$${total.toFixed(2)}</span>
                            </div>
                        </div>
                        
                        <div style="display: flex; gap: 1rem;">
                            <button class="btn btn-primary" id="place-order-btn">
                                <i class="fas fa-check-circle"></i> Place Order
                            </button>
                            <button class="btn btn-secondary" onclick="closeModal()">
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            `;
            
            document.getElementById('modal-container').innerHTML = '';
            document.getElementById('modal-container').appendChild(modal);

            document.getElementById('place-order-btn').addEventListener('click', () => {
                // Form validation
                const name = document.getElementById('full-name').value;
                const email = document.getElementById('email').value;
                const phone = document.getElementById('phone').value;
                const address = document.getElementById('address').value;
                const city = document.getElementById('city').value;
                const state = document.getElementById('state').value;
                const zip = document.getElementById('zip').value;
                const payment = document.getElementById('payment-method').value;

                if (!name || !email || !phone || !address || !city || !state || !zip) {
                    showToast('Please fill all fields', 'error');
                    return;
                }

                // Generate Order ID
                const orderId = 'ORD' + Date.now() + Math.random().toString(36).substr(2, 5).toUpperCase();

                const order = {
                    id: orderId,
                    userId: Store.currentUser.id,
                    userName: Store.currentUser.name,
                    items: [...Store.cart],
                    subtotal: subtotal,
                    tax: tax,
                    total: total,
                    shipping: { name, email, phone, address, city, state, zip },
                    payment: payment,
                    status: 'Processing',
                    date: new Date().toLocaleString()
                };

                Store.orders.push(order);
                Store.saveOrders();
                
                // Clear cart
                Store.cart = [];
                Store.saveCart();
                
                closeModal();
                showToast('Order placed successfully! Order ID: ' + orderId);
                renderPage('orders');
            });
        }

        // ========== ORDERS PAGE ==========
        function renderOrdersPage() {
            if (!Store.currentUser) {
                return `
                    <div style="text-align: center; padding: 4rem;">
                        <i class="fas fa-box-open" style="font-size: 5rem; color: var(--text-muted-light);"></i>
                        <h2 style="margin: 2rem 0;">Please login to view orders</h2>
                        <button class="btn btn-primary" onclick="showAuthModal()">
                            <i class="fas fa-sign-in-alt"></i> Login
                        </button>
                    </div>
                `;
            }

            const userOrders = Store.orders.filter(o => o.userId === Store.currentUser.id);

            if (userOrders.length === 0) {
                return `
                    <div style="text-align: center; padding: 4rem;">
                        <i class="fas fa-box-open" style="font-size: 5rem; color: var(--text-muted-light);"></i>
                        <h2 style="margin: 2rem 0;">No orders yet</h2>
                        <button class="btn btn-primary" onclick="renderPage('home')">
                            <i class="fas fa-store"></i> Start Shopping
                        </button>
                    </div>
                `;
            }

            return `
                <h2 style="margin-bottom: 2rem;">My Orders</h2>
                ${userOrders.map(order => `
                    <div class="order-card">
                        <div class="order-header">
                            <span class="order-id">Order #${order.id}</span>
                            <span class="order-status status-${order.status.toLowerCase()}">${order.status}</span>
                        </div>
                        <div style="margin: 1rem 0;">
                            <p>Date: ${order.date}</p>
                            <p>Total: $${order.total.toFixed(2)}</p>
                            <p>Payment: ${order.payment}</p>
                        </div>
                        <div style="display: flex; gap: 1rem;">
                            <button class="btn btn-secondary btn-sm" onclick="viewOrderDetails('${order.id}')">
                                <i class="fas fa-eye"></i> View Details
                            </button>
                            ${order.status === 'Processing' ? `
                                <button class="btn btn-danger btn-sm" onclick="cancelOrder('${order.id}')">
                                    <i class="fas fa-times-circle"></i> Cancel Order
                                </button>
                            ` : ''}
                        </div>
                    </div>
                `).join('')}
            `;
        }

        function attachOrdersListeners() {}

        // Order functions
        window.cancelOrder = function(orderId) {
            const order = Store.orders.find(o => o.id === orderId);
            if (order && order.status === 'Processing') {
                order.status = 'Cancelled';
                Store.saveOrders();
                showToast('Order cancelled successfully');
                renderPage('orders');
            }
        };

        window.viewOrderDetails = function(orderId) {
            const order = Store.orders.find(o => o.id === orderId);
            // Show order details in modal (simplified for brevity)
            showToast('Order details feature coming soon');
        };

        // ========== PROFILE PAGE ==========
        function renderProfilePage() {
            if (!Store.currentUser) {
                return `
                    <div style="text-align: center; padding: 4rem;">
                        <i class="fas fa-user-circle" style="font-size: 5rem; color: var(--text-muted-light);"></i>
                        <h2 style="margin: 2rem 0;">Please login to view profile</h2>
                        <button class="btn btn-primary" onclick="showAuthModal()">
                            <i class="fas fa-sign-in-alt"></i> Login
                        </button>
                    </div>
                `;
            }

            const userOrders = Store.orders.filter(o => o.userId === Store.currentUser.id);

            return `
                <div class="profile-container">
                    <div class="profile-sidebar">
                        <div class="profile-avatar">
                            <i class="fas fa-user"></i>
                        </div>
                        <h3>${Store.currentUser.name}</h3>
                        <p style="color: var(--text-muted-light);">${Store.currentUser.email}</p>
                        <p style="margin-top: 1rem;">Role: ${Store.currentUser.role}</p>
                    </div>
                    
                    <div class="profile-main">
                        <h3 style="margin-bottom: 2rem;">Edit Profile</h3>
                        
                        <div style="display: flex; flex-direction: column; gap: 1.5rem;">
                            <div class="form-group">
                                <label>Name</label>
                                <input type="text" id="edit-name" value="${Store.currentUser.name}">
                            </div>
                            
                            <div class="form-group">
                                <label>Email</label>
                                <input type="email" id="edit-email" value="${Store.currentUser.email}">
                            </div>
                            
                            <div class="form-group">
                                <label>New Password (leave blank to keep current)</label>
                                <input type="password" id="edit-password" placeholder="Enter new password">
                            </div>
                            
                            <div style="display: flex; gap: 1rem;">
                                <button class="btn btn-primary" id="update-profile">
                                    <i class="fas fa-save"></i> Update Profile
                                </button>
                                <button class="btn btn-secondary" id="change-password">
                                    <i class="fas fa-key"></i> Change Password
                                </button>
                            </div>
                        </div>
                        
                        <hr style="margin: 2rem 0;">
                        
                        <h3 style="margin-bottom: 1rem;">Recent Orders</h3>
                        ${userOrders.slice(0, 3).map(order => `
                            <div class="order-card">
                                <div style="display: flex; justify-content: space-between;">
                                    <span>Order #${order.id}</span>
                                    <span class="order-status status-${order.status.toLowerCase()}">${order.status}</span>
                                </div>
                                <p style="margin-top: 0.5rem;">Total: $${order.total.toFixed(2)}</p>
                            </div>
                        `).join('')}
                        
                        ${userOrders.length > 3 ? `
                            <button class="btn btn-secondary" style="margin-top: 1rem;" onclick="renderPage('orders')">
                                View All Orders
                            </button>
                        ` : ''}
                    </div>
                </div>
            `;
        }

        function attachProfileListeners() {
            document.getElementById('update-profile')?.addEventListener('click', () => {
                const name = document.getElementById('edit-name').value;
                const email = document.getElementById('edit-email').value;
                
                if (!name || !email) {
                    showToast('Name and email are required', 'error');
                    return;
                }

                Store.currentUser.name = name;
                Store.currentUser.email = email;
                
                // Update in users array
                const userIndex = Store.users.findIndex(u => u.id === Store.currentUser.id);
                if (userIndex !== -1) {
                    Store.users[userIndex] = Store.currentUser;
                }
                
                Store.saveUsers();
                Store.saveCurrentUser();
                showToast('Profile updated successfully');
                renderPage('profile');
            });

            document.getElementById('change-password')?.addEventListener('click', () => {
                const newPassword = document.getElementById('edit-password').value;
                
                if (!newPassword) {
                    showToast('Please enter a new password', 'error');
                    return;
                }

                Store.currentUser.password = newPassword;
                
                const userIndex = Store.users.findIndex(u => u.id === Store.currentUser.id);
                if (userIndex !== -1) {
                    Store.users[userIndex].password = newPassword;
                }
                
                Store.saveUsers();
                Store.saveCurrentUser();
                showToast('Password changed successfully');
                document.getElementById('edit-password').value = '';
            });
        }

        // ========== ADMIN PANEL ==========
        function renderAdminPage() {
            const totalUsers = Store.users.length;
            const totalOrders = Store.orders.length;
            const totalRevenue = Store.orders.reduce((acc, o) => acc + o.total, 0);
            const totalProducts = Store.products.length;

            return `
                <h2 style="margin-bottom: 2rem;"><i class="fas fa-shield-alt"></i> Admin Dashboard</h2>
                
                <div class="admin-dashboard">
                    <div class="stat-card">
                        <i class="fas fa-users" style="font-size: 2rem; margin-bottom: 1rem;"></i>
                        <h3>${totalUsers}</h3>
                        <p>Total Users</p>
                    </div>
                    <div class="stat-card" style="background: var(--gradient-2);">
                        <i class="fas fa-box" style="font-size: 2rem; margin-bottom: 1rem;"></i>
                        <h3>${totalOrders}</h3>
                        <p>Total Orders</p>
                    </div>
                    <div class="stat-card" style="background: var(--gradient-3);">
                        <i class="fas fa-dollar-sign" style="font-size: 2rem; margin-bottom: 1rem;"></i>
                        <h3>$${totalRevenue.toFixed(2)}</h3>
                        <p>Total Revenue</p>
                    </div>
                    <div class="stat-card">
                        <i class="fas fa-tag" style="font-size: 2rem; margin-bottom: 1rem;"></i>
                        <h3>${totalProducts}</h3>
                        <p>Total Products</p>
                    </div>
                </div>
                
                <div class="admin-actions">
                    <button class="btn btn-primary" onclick="showAddProductModal()">
                        <i class="fas fa-plus-circle"></i> Add Product
                    </button>
                    <button class="btn btn-secondary" onclick="showManageUsers()">
                        <i class="fas fa-users-cog"></i> Manage Users
                    </button>
                    <button class="btn btn-success" onclick="showManageOrders()">
                        <i class="fas fa-truck"></i> Manage Orders
                    </button>
                    <button class="btn btn-warning" onclick="showAllProducts()">
                        <i class="fas fa-edit"></i> Edit Products
                    </button>
                </div>
                
                <div id="admin-content" style="margin-top: 2rem;">
                    ${renderProductManagement()}
                </div>
            `;
        }

        function renderProductManagement() {
            return `
                <h3 style="margin-bottom: 1rem;">Product Management</h3>
                <div class="product-grid">
                    ${Store.products.map(product => `
                        <div class="card">
                            <img src="${product.image}" class="product-image" alt="${product.name}">
                            <h4>${product.name}</h4>
                            <p>$${product.price}</p>
                            <p>Stock: ${product.stock}</p>
                            <div style="display: flex; gap: 0.5rem;">
                                <button class="btn btn-secondary btn-sm" onclick="editProduct('${product.id}')">
                                    <i class="fas fa-edit"></i> Edit
                                </button>
                                <button class="btn btn-danger btn-sm" onclick="deleteProduct('${product.id}')">
                                    <i class="fas fa-trash"></i> Delete
                                </button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
        }

        function attachAdminListeners() {}

        // Admin functions
        window.showAddProductModal = function() {
            const modal = document.createElement('div');
            modal.className = 'modal';
            modal.innerHTML = `
                <div class="modal-content">
                    <h2 style="margin-bottom: 2rem;">Add New Product</h2>
                    <div style="display: flex; flex-direction: column; gap: 1rem;">
                        <input type="text" id="prod-name" class="filter-input" placeholder="Product Name">
                        <input type="number" id="prod-price" class="filter-input" placeholder="Price">
                        <select id="prod-category" class="filter-input">
                            <option value="Electronics">Electronics</option>
                            <option value="Fashion">Fashion</option>
                            <option value="Home">Home</option>
                        </select>
                        <input type="number" id="prod-stock" class="filter-input" placeholder="Stock">
                        <textarea id="prod-desc" class="filter-input" placeholder="Description" rows="4"></textarea>
                        <input type="text" id="prod-image" class="filter-input" placeholder="Image URL">
                        <div style="display: flex; gap: 1rem;">
                            <button class="btn btn-primary" onclick="addProduct()">Add Product</button>
                            <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
                        </div>
                    </div>
                </div>
            `;
            document.getElementById('modal-container').innerHTML = '';
            document.getElementById('modal-container').appendChild(modal);
        };

        window.addProduct = function() {
            const name = document.getElementById('prod-name').value;
            const price = parseFloat(document.getElementById('prod-price').value);
            const category = document.getElementById('prod-category').value;
            const stock = parseInt(document.getElementById('prod-stock').value);
            const description = document.getElementById('prod-desc').value;
            const image = document.getElementById('prod-image').value || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300';

            if (!name || !price || !category || !stock || !description) {
                showToast('All fields are required', 'error');
                return;
            }

            const newProduct = {
                id: 'p' + Date.now(),
                name,
                price,
                category,
                rating: 4.0,
                image,
                stock,
                description
            };

            Store.products.push(newProduct);
            Store.saveProducts();
            closeModal();
            showToast('Product added successfully');
            renderPage('admin');
        };

        window.editProduct = function(productId) {
            const product = Store.products.find(p => p.id === productId);
            const modal = document.createElement('div');
            modal.className = 'modal';
            modal.innerHTML = `
                <div class="modal-content">
                    <h2 style="margin-bottom: 2rem;">Edit Product</h2>
                    <div style="display: flex; flex-direction: column; gap: 1rem;">
                        <input type="text" id="edit-name" class="filter-input" value="${product.name}">
                        <input type="number" id="edit-price" class="filter-input" value="${product.price}">
                        <select id="edit-category" class="filter-input">
                            <option value="Electronics" ${product.category === 'Electronics' ? 'selected' : ''}>Electronics</option>
                            <option value="Fashion" ${product.category === 'Fashion' ? 'selected' : ''}>Fashion</option>
                            <option value="Home" ${product.category === 'Home' ? 'selected' : ''}>Home</option>
                        </select>
                        <input type="number" id="edit-stock" class="filter-input" value="${product.stock}">
                        <textarea id="edit-desc" class="filter-input" rows="4">${product.description}</textarea>
                        <input type="text" id="edit-image" class="filter-input" value="${product.image}">
                        <div style="display: flex; gap: 1rem;">
                            <button class="btn btn-primary" onclick="updateProduct('${product.id}')">Update</button>
                            <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
                        </div>
                    </div>
                </div>
            `;
            document.getElementById('modal-container').innerHTML = '';
            document.getElementById('modal-container').appendChild(modal);
        };

        window.updateProduct = function(productId) {
            const product = Store.products.find(p => p.id === productId);
            product.name = document.getElementById('edit-name').value;
            product.price = parseFloat(document.getElementById('edit-price').value);
            product.category = document.getElementById('edit-category').value;
            product.stock = parseInt(document.getElementById('edit-stock').value);
            product.description = document.getElementById('edit-desc').value;
            product.image = document.getElementById('edit-image').value;

            Store.saveProducts();
            closeModal();
            showToast('Product updated successfully');
            renderPage('admin');
        };

        window.deleteProduct = function(productId) {
            if (confirm('Are you sure you want to delete this product?')) {
                Store.products = Store.products.filter(p => p.id !== productId);
                Store.saveProducts();
                showToast('Product deleted successfully');
                renderPage('admin');
            }
        };

        window.showManageUsers = function() {
            const modal = document.createElement('div');
            modal.className = 'modal';
            modal.innerHTML = `
                <div class="modal-content" style="max-width: 800px;">
                    <h2 style="margin-bottom: 2rem;">Manage Users</h2>
                    <div style="max-height: 500px; overflow-y: auto;">
                        ${Store.users.map(user => `
                            <div style="display: flex; justify-content: space-between; align-items: center; padding: 1rem; border-bottom: 1px solid var(--border-light);">
                                <div>
                                    <strong>${user.name}</strong>
                                    <p style="color: var(--text-muted-light);">${user.email}</p>
                                    <span style="background: ${user.role === 'admin' ? 'var(--primary-light)' : 'var(--success-light)'}; color: white; padding: 0.2rem 1rem; border-radius: 50px; font-size: 0.8rem;">${user.role}</span>
                                </div>
                                <div style="display: flex; gap: 0.5rem;">
                                    ${user.role !== 'admin' ? `
                                        <button class="btn btn-danger btn-sm" onclick="deleteUser('${user.id}')">
                                            <i class="fas fa-trash"></i> Delete
                                        </button>
                                    ` : ''}
                                </div>
                            </div>
                        `).join('')}
                    </div>
                    <button class="btn btn-secondary" style="margin-top: 2rem;" onclick="closeModal()">Close</button>
                </div>
            `;
            document.getElementById('modal-container').innerHTML = '';
            document.getElementById('modal-container').appendChild(modal);
        };

        window.deleteUser = function(userId) {
            if (confirm('Are you sure you want to delete this user?')) {
                Store.users = Store.users.filter(u => u.id !== userId);
                Store.saveUsers();
                showToast('User deleted successfully');
                closeModal();
            }
        };

        window.showManageOrders = function() {
            const modal = document.createElement('div');
            modal.className = 'modal';
            modal.innerHTML = `
                <div class="modal-content" style="max-width: 800px;">
                    <h2 style="margin-bottom: 2rem;">Manage Orders</h2>
                    <div style="max-height: 500px; overflow-y: auto;">
                        ${Store.orders.map(order => `
                            <div class="order-card">
                                <div style="display: flex; justify-content: space-between;">
                                    <strong>Order #${order.id}</strong>
                                    <select onchange="updateOrderStatus('${order.id}', this.value)">
                                        <option value="Processing" ${order.status === 'Processing' ? 'selected' : ''}>Processing</option>
                                        <option value="Shipped" ${order.status === 'Shipped' ? 'selected' : ''}>Shipped</option>
                                        <option value="Delivered" ${order.status === 'Delivered' ? 'selected' : ''}>Delivered</option>
                                    </select>
                                </div>
                                <p>Customer: ${order.userName}</p>
                                <p>Total: $${order.total.toFixed(2)}</p>
                                <p>Date: ${order.date}</p>
                                <button class="btn btn-danger btn-sm" onclick="deleteOrder('${order.id}')">
                                    <i class="fas fa-trash"></i> Delete Order
                                </button>
                            </div>
                        `).join('')}
                    </div>
                    <button class="btn btn-secondary" style="margin-top: 2rem;" onclick="closeModal()">Close</button>
                </div>
            `;
            document.getElementById('modal-container').innerHTML = '';
            document.getElementById('modal-container').appendChild(modal);
        };

        window.updateOrderStatus = function(orderId, status) {
            const order = Store.orders.find(o => o.id === orderId);
            if (order) {
                order.status = status;
                Store.saveOrders();
                showToast('Order status updated');
            }
        };

        window.deleteOrder = function(orderId) {
            if (confirm('Are you sure you want to delete this order?')) {
                Store.orders = Store.orders.filter(o => o.id !== orderId);
                Store.saveOrders();
                showToast('Order deleted successfully');
                closeModal();
            }
        };

        window.showAllProducts = function() {
            // Already showing products in admin panel
            showToast('Product management section');
        };

        // ========== EVENT LISTENERS ==========
        document.getElementById('auth-btn').addEventListener('click', () => {
            if (Store.currentUser) {
                // Logout
                Store.currentUser = null;
                localStorage.removeItem('currentUser');
                updateUIBasedOnUser();
                showToast('Logged out successfully');
                renderPage('home');
            } else {
                showAuthModal();
            }
        });

        document.getElementById('theme-toggle').addEventListener('click', () => {
            document.body.classList.toggle('dark-theme');
            const icon = document.querySelector('#theme-toggle i');
            if (document.body.classList.contains('dark-theme')) {
                icon.className = 'fas fa-sun';
            } else {
                icon.className = 'fas fa-moon';
            }
        });

        document.querySelectorAll('[data-page]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = link.dataset.page;
                renderPage(page);
            });
        });

        // Initialize
        updateUIBasedOnUser();
        renderPage('home');
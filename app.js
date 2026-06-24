document.addEventListener('DOMContentLoaded', () => {
    // --- Global Scroll Behavior ---
    const header = document.querySelector('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // --- Mobile Menu Toggle ---
    const menuToggle = document.getElementById('menu-toggle');
    const navLinks = document.getElementById('nav-links');
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('open');
            // Toggle hamburger icon animation if needed
            const spans = menuToggle.querySelectorAll('span');
            if (navLinks.classList.contains('open')) {
                spans[0].style.transform = 'rotate(45deg) translate(5px, 6px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(5px, -6px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
    }

    // --- Contact Drawer Toggle ---
    const contactTrigger = document.getElementById('contact-trigger');
    const contactOverlay = document.getElementById('contact-overlay');
    const contactClose = document.getElementById('contact-close');
    
    if (contactTrigger && contactOverlay) {
        contactTrigger.addEventListener('click', (e) => {
            e.preventDefault();
            contactOverlay.classList.add('open');
            if (navLinks) navLinks.classList.remove('open'); // Close mobile menu if open
        });
    }
    
    if (contactClose && contactOverlay) {
        contactClose.addEventListener('click', () => {
            contactOverlay.classList.remove('open');
        });
    }
    
    if (contactOverlay) {
        contactOverlay.addEventListener('click', (e) => {
            if (e.target === contactOverlay) {
                contactOverlay.classList.remove('open');
            }
        });
    }

    // --- Contact Form Submission Mockup ---
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            
            setTimeout(() => {
                alert('Thank you! Your message has been sent successfully. 感謝您的聯絡！訊息已成功傳送。');
                contactForm.reset();
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                contactOverlay.classList.remove('open');
            }, 1000);
        });
    }

    // --- Shopping Cart Manager (localStorage based) ---
    let cart = JSON.parse(localStorage.getItem('lun_artist_cart')) || [];
    
    const cartToggle = document.getElementById('cart-toggle');
    const cartOverlay = document.getElementById('cart-overlay');
    const cartClose = document.getElementById('cart-close');
    const cartCountBadge = document.getElementById('cart-count');
    const cartItemsWrapper = document.getElementById('cart-items-wrapper');
    const cartTotalPrice = document.getElementById('cart-total-price');
    const checkoutBtn = document.getElementById('checkout-btn');
    const checkoutForm = document.getElementById('checkout-form');
    const paySubmitBtn = document.getElementById('pay-submit-btn');

    // Update cart badge & drawer contents
    function updateCartUI() {
        // Update badge count
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        if (cartCountBadge) {
            cartCountBadge.textContent = totalItems;
        }
        
        // Save to localStorage
        localStorage.setItem('lun_artist_cart', JSON.stringify(cart));
        
        // Populate items
        if (!cartItemsWrapper) return;
        
        if (cart.length === 0) {
            cartItemsWrapper.innerHTML = `<div class="cart-empty-message">Your cart is empty.<br>購物車目前沒有商品。</div>`;
            if (cartTotalPrice) cartTotalPrice.textContent = '$0.00 USD';
            if (checkoutBtn) checkoutBtn.style.display = 'none';
            if (checkoutForm) checkoutForm.classList.remove('active');
            return;
        }
        
        if (checkoutBtn) checkoutBtn.style.display = 'block';
        
        let html = '';
        let subtotal = 0;
        
        cart.forEach((item, index) => {
            const itemTotal = item.price * item.quantity;
            subtotal += itemTotal;
            html += `
                <div class="cart-item" data-index="${index}">
                    <img src="${item.image}" alt="${item.title}" class="cart-item-img">
                    <div class="cart-item-details">
                        <div class="cart-item-title">${item.title}</div>
                        <div class="cart-item-price">$${item.price.toFixed(2)} USD</div>
                        <div class="cart-item-qty-row">
                            <div class="cart-qty-selector">
                                <span class="cart-qty-btn decrease" data-index="${index}">-</span>
                                <span class="cart-qty-val">${item.quantity}</span>
                                <span class="cart-qty-btn increase" data-index="${index}">+</span>
                            </div>
                            <span class="cart-item-remove" data-index="${index}">Remove 移除</span>
                        </div>
                    </div>
                </div>
            `;
        });
        
        cartItemsWrapper.innerHTML = html;
        if (cartTotalPrice) cartTotalPrice.textContent = `$${subtotal.toFixed(2)} USD`;
        
        // Add Event Listeners for quantity adjust & remove
        cartItemsWrapper.querySelectorAll('.cart-qty-btn.increase').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const idx = parseInt(e.target.dataset.index);
                cart[idx].quantity += 1;
                updateCartUI();
            });
        });
        
        cartItemsWrapper.querySelectorAll('.cart-qty-btn.decrease').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const idx = parseInt(e.target.dataset.index);
                if (cart[idx].quantity > 1) {
                    cart[idx].quantity -= 1;
                } else {
                    cart.splice(idx, 1);
                }
                updateCartUI();
            });
        });
        
        cartItemsWrapper.querySelectorAll('.cart-item-remove').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const idx = parseInt(e.target.dataset.index);
                cart.splice(idx, 1);
                updateCartUI();
            });
        });
    }

    // Initialize cart layout
    updateCartUI();

    // Drawer Toggles
    if (cartToggle && cartOverlay) {
        cartToggle.addEventListener('click', (e) => {
            e.preventDefault();
            cartOverlay.classList.add('open');
            if (navLinks) navLinks.classList.remove('open');
        });
    }
    
    if (cartClose && cartOverlay) {
        cartClose.addEventListener('click', () => {
            cartOverlay.classList.remove('open');
        });
    }
    
    if (cartOverlay) {
        cartOverlay.addEventListener('click', (e) => {
            if (e.target === cartOverlay) {
                cartOverlay.classList.remove('open');
            }
        });
    }

    // Checkout Form Visibility Toggle
    if (checkoutBtn && checkoutForm) {
        checkoutBtn.addEventListener('click', () => {
            checkoutForm.classList.add('active');
            checkoutBtn.style.display = 'none';
            // Scroll to form inside cart drawer
            cartItemsWrapper.scrollTo({
                top: cartItemsWrapper.scrollHeight,
                behavior: 'smooth'
            });
        });
    }

    // Mock Checkout Submit
    const payForm = document.getElementById('pay-form');
    if (payForm) {
        payForm.addEventListener('submit', (e) => {
            e.preventDefault();
            paySubmitBtn.disabled = true;
            paySubmitBtn.textContent = 'Processing Payment...';
            
            setTimeout(() => {
                alert('Thank you for your purchase! A mock receipt has been sent to your email. 感謝您的購買！系統已寄送模擬收據。');
                cart = [];
                updateCartUI();
                payForm.reset();
                paySubmitBtn.disabled = false;
                checkoutForm.classList.remove('active');
                cartOverlay.classList.remove('open');
            }, 1500);
        });
    }

    // Add products to cart (From Shop buttons)
    document.querySelectorAll('.btn-buy').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const card = e.target.closest('.product-card');
            if (!card) return;
            
            const id = card.dataset.id;
            const title = card.querySelector('.product-title').textContent;
            const price = parseFloat(card.dataset.price);
            const image = card.dataset.image || card.querySelector('.product-img-wrapper img').src;
            
            // Check if item already exists
            const existingIndex = cart.findIndex(item => item.id === id);
            if (existingIndex > -1) {
                cart[existingIndex].quantity += 1;
            } else {
                cart.push({
                    id: id,
                    title: title,
                    price: price,
                    image: image,
                    quantity: 1
                });
            }
            
            updateCartUI();
            
            // Open Cart drawer to show the item added
            cartOverlay.classList.add('open');
        });
    });

    // --- Portfolio Filters (Saren Stone Reference) ---
    const filterButtons = document.querySelectorAll('.filter-btn');
    const masonryItems = document.querySelectorAll('.masonry-item');
    
    if (filterButtons.length > 0 && masonryItems.length > 0) {
        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                // Toggle active button
                filterButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                const filterValue = btn.dataset.filter;
                
                masonryItems.forEach(item => {
                    if (filterValue === 'all' || item.dataset.category === filterValue) {
                        item.style.display = 'block';
                        // Trigger a small animation re-entry
                        setTimeout(() => {
                            item.style.opacity = '1';
                            item.style.transform = 'scale(1)';
                        }, 50);
                    } else {
                        item.style.opacity = '0';
                        item.style.transform = 'scale(0.95)';
                        setTimeout(() => {
                            item.style.display = 'none';
                        }, 250);
                    }
                });
            });
        });
    }

    // --- Fullscreen Portfolio Lightbox Modal ---
    const lightboxModal = document.getElementById('lightbox-modal');
    const lightboxClose = document.getElementById('lightbox-close');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxTitle = document.getElementById('lightbox-title');
    const lightboxCategory = document.getElementById('lightbox-category');
    const lightboxDesc = document.getElementById('lightbox-desc');
    const lightboxSpecs = document.getElementById('lightbox-specs');

    if (masonryItems.length > 0 && lightboxModal) {
        masonryItems.forEach(item => {
            item.addEventListener('click', () => {
                const img = item.querySelector('img');
                const title = item.dataset.title || item.querySelector('.masonry-item-title')?.textContent || '';
                const categoryText = item.querySelector('.masonry-item-tag')?.textContent || '';
                const description = item.dataset.desc || 'No description available.';
                const year = item.dataset.year || '2026';
                const medium = item.dataset.medium || 'Digital Illustration';
                const size = item.dataset.size || 'Varying sizes';
                
                if (lightboxImg) lightboxImg.src = img.src;
                if (lightboxTitle) lightboxTitle.textContent = title;
                if (lightboxCategory) lightboxCategory.textContent = categoryText;
                if (lightboxDesc) lightboxDesc.textContent = description;
                
                if (lightboxSpecs) {
                    lightboxSpecs.innerHTML = `
                        <li><strong>Year 製作年份:</strong> ${year}</li>
                        <li><strong>Medium 媒材:</strong> ${medium}</li>
                        <li><strong>Dimensions 尺寸:</strong> ${size}</li>
                    `;
                }
                
                lightboxModal.classList.add('open');
                document.body.style.overflow = 'hidden'; // Stop scrolling background
            });
        });
    }

    if (lightboxClose && lightboxModal) {
        lightboxClose.addEventListener('click', () => {
            lightboxModal.classList.remove('open');
            document.body.style.overflow = '';
        });
        
        lightboxModal.addEventListener('click', (e) => {
            if (e.target === lightboxModal) {
                lightboxModal.classList.remove('open');
                document.body.style.overflow = '';
            }
        });
    }
});

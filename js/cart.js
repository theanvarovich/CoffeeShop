// Antigravity Coffee - Premium Cart System (2026)

class CartSystem {
    constructor() {
        this.cart = JSON.parse(localStorage.getItem('antigravity_cart')) || [];
        this.isOpen = false;
        this.init();
    }

    init() {
        this.renderCartUI();
        this.updateCartBadge();
        this.bindEvents();
    }

    bindEvents() {
        // Global delegate for "Add to Cart" buttons
        document.addEventListener('click', (e) => {
            const btn = e.target.closest('[data-add-to-cart]');
            if (btn) {
                const item = {
                    id: btn.dataset.id || Math.random().toString(36).substr(2, 9),
                    name: btn.dataset.name,
                    price: parseFloat(btn.dataset.price),
                    image: btn.dataset.image,
                    quantity: 1
                };
                this.addItem(item);
            }

            // Toggle cart
            if (e.target.closest('#cart-toggle') || e.target.closest('.order-online-btn')) {
                e.preventDefault();
                this.toggleCart(true);
            }

            if (e.target.closest('#close-cart') || (e.target.id === 'cart-overlay')) {
                this.toggleCart(false);
            }

            // Cart item actions
            if (e.target.closest('.remove-item')) {
                const id = e.target.closest('.remove-item').dataset.id;
                this.removeItem(id);
            }
        });
    }

    addItem(item) {
        const existing = this.cart.find(i => i.name === item.name);
        if (existing) {
            existing.quantity += 1;
        } else {
            this.cart.push(item);
        }
        this.save();
        this.updateCartBadge();
        this.renderCartItems();
        this.toggleCart(true);
    }

    removeItem(id) {
        this.cart = this.cart.filter(i => i.id !== id);
        this.save();
        this.updateCartBadge();
        this.renderCartItems();
    }

    save() {
        localStorage.setItem('antigravity_cart', JSON.stringify(this.cart));
    }

    toggleCart(force) {
        const sidebar = document.getElementById('cart-sidebar');
        const overlay = document.getElementById('cart-overlay');
        if (force !== undefined) this.isOpen = force;
        else this.isOpen = !this.isOpen;

        if (this.isOpen) {
            sidebar.classList.remove('translate-x-full');
            overlay.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
            this.renderCartItems();
        } else {
            sidebar.classList.add('translate-x-full');
            overlay.classList.add('hidden');
            document.body.style.overflow = '';
        }
    }

    updateCartBadge() {
        const badges = document.querySelectorAll('.cart-count');
        const total = this.cart.reduce((sum, item) => sum + item.quantity, 0);
        badges.forEach(b => {
            b.textContent = total;
            b.style.display = total > 0 ? 'flex' : 'none';
        });
    }

    renderCartUI() {
        const html = `
            <div id="cart-overlay" class="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] hidden transition-opacity duration-300"></div>
            <div id="cart-sidebar" class="fixed top-0 right-0 h-full w-full max-w-md bg-primary-bg border-l border-primary-surface/50 z-[101] translate-x-full transition-transform duration-500 flex flex-col shadow-2xl">
                <div class="p-8 border-b border-primary-surface/50 flex justify-between items-center">
                    <h2 class="text-3xl font-serif italic">Your <span class="text-primary-accent">Orbit</span></h2>
                    <button id="close-cart" class="p-2 hover:text-primary-accent transition-colors">
                        <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" stroke-width="2"/></svg>
                    </button>
                </div>
                <div id="cart-items" class="flex-grow overflow-y-auto p-8 space-y-8">
                    <!-- Items injected here -->
                </div>
                <div class="p-8 bg-primary-surface/30 border-t border-primary-surface/50">
                    <div class="flex justify-between items-center mb-6">
                        <span class="text-primary-text-muted uppercase tracking-widest text-xs font-bold">Subtotal</span>
                        <span id="cart-subtotal" class="text-2xl font-serif text-primary-accent font-bold">$0.00</span>
                    </div>
                    <button onclick="alert('Proceeding to checkout secure gateway...')" class="btn-primary w-full py-5 text-xl shadow-lg shadow-primary-accent/10">Defy Gravity (Checkout)</button>
                    <p class="text-[10px] text-center text-primary-text-muted mt-4 uppercase tracking-[0.2em] italic">Encrypted Secure Transaction</p>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', html);
    }

    renderCartItems() {
        const container = document.getElementById('cart-items');
        const subtotalEl = document.getElementById('cart-subtotal');

        if (this.cart.length === 0) {
            container.innerHTML = `
                <div class="flex flex-col items-center justify-center h-full opacity-40">
                    <svg class="w-16 h-16 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" stroke-width="1.5"/></svg>
                    <p class="text-lg italic">Your orbit is empty.</p>
                </div>
            `;
            subtotalEl.textContent = '$0.00';
            return;
        }

        let subtotal = 0;
        container.innerHTML = this.cart.map(item => {
            const total = item.price * item.quantity;
            subtotal += total;
            return `
                <div class="flex gap-6 group">
                    <div class="w-24 h-24 rounded-brand overflow-hidden shrink-0 border border-white/5">
                        <img src="${item.image}" class="w-full h-full object-cover">
                    </div>
                    <div class="flex-grow">
                        <div class="flex justify-between items-start mb-2">
                            <h4 class="text-xl italic">${item.name}</h4>
                            <button class="remove-item text-primary-text-muted hover:text-red-400 transition-colors" data-id="${item.id}">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" stroke-width="1.5"/></svg>
                            </button>
                        </div>
                        <div class="flex justify-between items-center text-sm font-medium">
                            <span class="text-primary-text-muted">${item.quantity} × <span class="text-primary-accent">$${item.price.toFixed(2)}</span></span>
                            <span class="text-primary-text font-bold">$${total.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.AntigravityCart = new CartSystem();
});

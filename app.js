// A Rajan Super Market - Showcase Website JavaScript

// Application Data
const appData = {
  store: {
    name: "ARajan SuperMarket",
    tagline: "Experience freshness, quality, and variety",
    address: "Opp to old court, Coimbatore Road, Mettupalayam -641301",
    phone: "+91-9942819129",
    hours: "9:00 AM - 10:00 PM (All Days)"
  },
  products: [
    {"id": 1, "name": "Fresh Bananas", "price": "Market price", "image": "🍌", "category": "fruits"},
    {"id": 2, "name": "Organic Milk", "price": "Market price", "image": "🥛", "category": "dairy"},
    {"id": 3, "name": "Whole Wheat Bread", "price": "Market price", "image": "🍞", "category": "bakery"},
    {"id": 5, "name": "Roma Tomatoes", "price": "Market price", "image": "🍅", "category": "fruits"},
    {"id": 6, "name": "Greek Yogurt", "price": "Market price", "image": "🥛", "category": "dairy"},
    {"id": 7, "name": "Orange Juice", "price": "Market price", "image": "🧃", "category": "beverages"},
    {"id": 8, "name": "Mixed Berries", "price": "Market price", "image": "🫐", "category": "fruits"}
  ],
  categories: [
    {"name": "Fresh Fruits & Vegetables", "icon": "🥕", "count": 45, "id": "fruits"},
    {"name": "Dairy & Eggs", "icon": "🥛", "count": 28, "id": "dairy"},
    {"name": "Bakery & Bread", "icon": "🍞", "count": 18, "id": "bakery"},
    {"name": "Pantry Essentials", "icon": "🥫", "count": 67, "id": "pantry"},
    {"name": "Beverages", "icon": "🧃", "count": 24, "id": "beverages"},
    {"name": "Snacks & Treats", "icon": "🍿", "count": 39, "id": "snacks"},
    {"name": "Frozen Foods", "icon": "🧊", "count": 21, "id": "frozen"}
  ],
  features: [
    {"title": "500+ Products Available", "description": "Wide variety of quality products", "icon": "🛒"},
    {"title": "Fresh Quality Guarantee", "description": "100% fresh quality assured", "icon": "✅"},
    {"title": "Friendly Service", "description": "Helpful and courteous staff", "icon": "👥"},
    {"title": "Modern Store", "description": "Clean and modern shopping environment", "icon": "🏪"}
  ]
};

// Application State
let filteredProducts = [...appData.products];
let activeCategory = 'all';

// Utility Functions
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.style.cssText = `
    position: fixed;
    top: 100px;
    right: 20px;
    background: ${type === 'info' ? 'var(--color-red-primary)' : 'var(--color-red-primary)'};
    color: var(--color-white);
    padding: var(--space-12) var(--space-20);
    border-radius: var(--radius-base);
    box-shadow: 0 10px 30px rgba(220, 38, 38, 0.4);
    z-index: 3000;
    transform: translateX(100%);
    transition: transform var(--duration-normal) var(--ease-standard);
    border: 1px solid rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(10px);
  `;
  notification.textContent = message;
  
  document.body.appendChild(notification);
  
  // Animate in
  setTimeout(() => {
    notification.style.transform = 'translateX(0)';
  }, 10);
  
  // Remove after 3 seconds
  setTimeout(() => {
    notification.style.transform = 'translateX(100%)';
    setTimeout(() => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification);
      }
    }, 300);
  }, 3000);
}

// Search Functions
function searchProducts(query) {
  if (!query.trim()) {
    if (activeCategory === 'all') {
      filteredProducts = [...appData.products];
    } else {
      filteredProducts = appData.products.filter(product => product.category === activeCategory);
    }
  } else {
    const searchTerm = query.toLowerCase();
    let productsToSearch = activeCategory === 'all' ? appData.products : 
                          appData.products.filter(product => product.category === activeCategory);
    
    filteredProducts = productsToSearch.filter(product => 
      product.name.toLowerCase().includes(searchTerm) ||
      product.category.toLowerCase().includes(searchTerm)
    );
  }
  renderProducts();
}

function filterByCategory(categoryId) {
  activeCategory = categoryId;
  
  if (categoryId === 'all') {
    filteredProducts = [...appData.products];
    showNotification('Showing all products');
  } else {
    filteredProducts = appData.products.filter(product => product.category === categoryId);
    const category = appData.categories.find(cat => cat.id === categoryId);
    showNotification(`Showing ${category ? category.name : 'products'}`);
  }
  
  renderProducts();
  
  // Scroll to products section
  const productsSection = document.getElementById('products');
  if (productsSection) {
    productsSection.scrollIntoView({ behavior: 'smooth' });
  }
  
  // Update category cards visual state
  updateCategoryCards(categoryId);
}

function updateCategoryCards(activeCategoryId) {
  const categoryCards = document.querySelectorAll('.category-card');
  categoryCards.forEach(card => {
    if (card.dataset.categoryId === activeCategoryId) {
      card.style.borderColor = 'var(--color-red-primary)';
      card.style.background = 'rgba(220, 38, 38, 0.1)';
    } else {
      card.style.borderColor = 'transparent';
      card.style.background = 'var(--color-dark-gray)';
    }
  });
}

// Render Functions
function renderCategories() {
  const categoriesGrid = document.getElementById('categoriesGrid');
  if (!categoriesGrid) return;
  
  categoriesGrid.innerHTML = appData.categories.map(category => `
    <div class="category-card" data-category-id="${category.id}" onclick="filterByCategory('${category.id}')">
      <span class="category-icon">${category.icon}</span>
      <h3 class="category-name">${category.name}</h3>
      <p class="category-count">${category.count} items</p>
    </div>
  `).join('');
}

function renderProducts() {
  const productsGrid = document.getElementById('productsGrid');
  if (!productsGrid) return;
  
  if (filteredProducts.length === 0) {
    productsGrid.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: var(--space-32);">
        <h3 style="color: var(--color-white); margin-bottom: var(--space-16);">No products found</h3>
        <p style="color: rgba(255, 255, 255, 0.7);">Try searching with different keywords or browse our categories.</p>
      </div>
    `;
    return;
  }
  
  productsGrid.innerHTML = filteredProducts.map(product => `
    <div class="product-card" onclick="showProductInfo('${product.name}')">
      <div class="product-image">${product.image}</div>
      <div class="product-content">
        <h3 class="product-name">${product.name}</h3>
        <p class="product-price">${product.price}</p>
      </div>
    </div>
  `).join('');
}

function renderFeatures() {
  const featuresGrid = document.getElementById('featuresGrid');
  if (!featuresGrid) return;
  
  featuresGrid.innerHTML = appData.features.map(feature => `
    <div class="feature-card">
      <span class="feature-icon">${feature.icon}</span>
      <h3 class="feature-title">${feature.title}</h3>
      <p class="feature-description">${feature.description}</p>
    </div>
  `).join('');
}

// Product interaction (showcase only)
function showProductInfo(productName) {
  showNotification(`${productName} - Available at our store!`);
}

// Navigation Functions
function toggleMobileMenu() {
  const nav = document.getElementById('nav');
  if (nav) {
    nav.classList.toggle('mobile-open');
  }
}

function setActiveNavLink(targetId) {
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${targetId}`) {
      link.classList.add('active');
    }
  });
}

function scrollToSection(sectionId) {
  const section = document.getElementById(sectionId);
  if (section) {
    const headerHeight = 80; // Account for fixed header
    const elementPosition = section.offsetTop;
    const offsetPosition = elementPosition - headerHeight;
    
    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
    
    setActiveNavLink(sectionId);
  }
}

// Global functions for onclick handlers
window.filterByCategory = filterByCategory;
window.showProductInfo = showProductInfo;

// Event Listeners
function initEventListeners() {
  // Mobile menu toggle
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', toggleMobileMenu);
  }
  
  // Search functionality
  const searchBar = document.querySelector('.search-bar');
  if (searchBar) {
    searchBar.addEventListener('input', debounce((e) => {
      searchProducts(e.target.value);
    }, 300));
  }
  
  const searchBtn = document.querySelector('.search-btn');
  if (searchBtn) {
    searchBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (searchBar) {
        searchProducts(searchBar.value);
      }
    });
  }
  
  // Hero CTA button
  const heroCta = document.querySelector('.hero-cta');
  if (heroCta) {
    heroCta.addEventListener('click', () => {
      showNotification('A Rajan Super Market is coming soon to serve you!');
      setTimeout(() => {
        scrollToSection('products');
      }, 1000);
    });
  }
  
  // Navigation links
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href').substring(1);
      scrollToSection(targetId);
      
      // Close mobile menu if open
      const nav = document.getElementById('nav');
      if (nav) {
        nav.classList.remove('mobile-open');
      }
    });
  });
  
  // Close mobile menu when clicking outside
  document.addEventListener('click', (e) => {
    const nav = document.getElementById('nav');
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    
    if (nav && mobileMenuBtn && 
        !nav.contains(e.target) && 
        !mobileMenuBtn.contains(e.target)) {
      nav.classList.remove('mobile-open');
    }
  });
  
  // Scroll to update active nav link
  window.addEventListener('scroll', debounce(() => {
    const sections = ['home', 'products', 'about', 'contact'];
    const scrollPos = window.scrollY + 100;
    
    for (const section of sections) {
      const element = document.getElementById(section);
      if (element && scrollPos >= element.offsetTop && scrollPos < element.offsetTop + element.offsetHeight) {
        setActiveNavLink(section);
        break;
      }
    }
  }, 100));
  
  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const nav = document.getElementById('nav');
      if (nav) {
        nav.classList.remove('mobile-open');
      }
    }
    
    // Search focus with Ctrl+K or Cmd+K
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      if (searchBar) {
        searchBar.focus();
      }
    }
  });
  
  // Add search bar placeholder animation
  if (searchBar) {
    const placeholders = [
      'Search our products...',
      'Try "fresh fruits"...',
      'Find "dairy products"...',
      'Look for "bakery items"...',
      'Search "beverages"...'
    ];
    
    let placeholderIndex = 0;
    
    setInterval(() => {
      if (document.activeElement !== searchBar && !searchBar.value) {
        placeholderIndex = (placeholderIndex + 1) % placeholders.length;
        searchBar.placeholder = placeholders[placeholderIndex];
      }
    }, 3000);
  }
  
  // Add hover effects to category cards
  const categoryCards = document.querySelectorAll('.category-card');
  categoryCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      if (card.dataset.categoryId !== activeCategory) {
        card.style.transform = 'translateY(-5px)';
      }
    });
    
    card.addEventListener('mouseleave', () => {
      if (card.dataset.categoryId !== activeCategory) {
        card.style.transform = 'translateY(0)';
      }
    });
  });
  
  // Add coming soon button animation
  const comingSoonBtn = document.querySelector('.btn--coming-soon');
  if (comingSoonBtn) {
    let animationInterval;
    
    const startPulseAnimation = () => {
      animationInterval = setInterval(() => {
        comingSoonBtn.style.transform = 'scale(1.05)';
        setTimeout(() => {
          comingSoonBtn.style.transform = 'scale(1)';
        }, 500);
      }, 2000);
    };
    
    const stopPulseAnimation = () => {
      if (animationInterval) {
        clearInterval(animationInterval);
      }
    };
    
    // Start pulse animation after page load
    setTimeout(startPulseAnimation, 2000);
    
    comingSoonBtn.addEventListener('mouseenter', stopPulseAnimation);
    comingSoonBtn.addEventListener('mouseleave', startPulseAnimation);
  }
}

// Initialization
function init() {
  renderCategories();
  renderProducts();
  renderFeatures();
  initEventListeners();
  
  // Show welcome notification
  setTimeout(() => {
    showNotification('Welcome to A Rajan Super Market!');
  }, 1000);
  
  console.log('A Rajan Super Market showcase website initialized successfully!');
}

// Start the application when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// Add some interactive effects
document.addEventListener('DOMContentLoaded', () => {
  // Add smooth reveal animation for sections
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);
  
  // Observe all sections
  const sections = document.querySelectorAll('section');
  sections.forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(20px)';
    section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(section);
  });
  
  // Hero section should be visible immediately
  const heroSection = document.getElementById('home');
  if (heroSection) {
    heroSection.style.opacity = '1';
    heroSection.style.transform = 'translateY(0)';
  }
});
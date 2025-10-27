class MobileMenu {
  constructor() {
    this.menu = document.querySelector('.main-nav');
    this.hamburger = document.querySelector('.hamburger');
    this.links = this.menu.querySelectorAll('a');
    this.body = document.body;

    this.handleDocumentClick = this.handleDocumentClick.bind(this);

    this.init();
  }

  init() {
    this.hamburger.addEventListener('click', () => this.toggleMenu());

    this.links.forEach(link => {
      link.addEventListener('click', () => {
        if (this.menu.classList.contains('nav-open')) {
          this.toggleMenu();
        }
      });
    });

    // Fecha o menu clicando fora
    document.addEventListener('click', this.handleDocumentClick);
  }

  handleDocumentClick(e) {
    if (
      this.menu.classList.contains('nav-open') &&
      !this.menu.contains(e.target) &&
      !this.hamburger.contains(e.target)
    ) {
      this.toggleMenu();
    }
  }

  toggleMenu() {
    const isActive = this.hamburger.classList.toggle('is-active');
    this.menu.classList.toggle('nav-open', isActive);
    this.body.classList.toggle('no-scroll', isActive);

    // Acessibilidade
    this.hamburger.setAttribute('aria-expanded', isActive);
  }
}

class ShoppingCart {
  constructor() {
    this.cartCount = document.querySelector('.cart-count');
    this.productButtons = document.querySelectorAll('.product-button');
    this.cart = [];
    this.notificationTimeout = null;

    this.init();
  }

  init() {
    this.loadCart();

    this.productButtons.forEach(button => {
      button.addEventListener('click', e => {
        e.preventDefault();
        const productCard = button.closest('.product-card');
        if (productCard) {
          this.addToCart(productCard);
        }
      });
    });
  }

  loadCart() {
    const savedCart = localStorage.getItem('salutiano-cart');
    if (savedCart) {
      try {
        this.cart = JSON.parse(savedCart);
      } catch {
        this.cart = [];
      }
      this.updateCartCount();
    }
  }

  saveCart() {
    localStorage.setItem('salutiano-cart', JSON.stringify(this.cart));
  }

  addToCart(productCard) {
    // Usar um ID se existir ou gerar novo
    const productId = productCard.dataset.id || productCard.querySelector('h3').textContent.trim();
    const productName = productCard.querySelector('h3').textContent.trim();
    const productPrice = productCard.querySelector('.price').textContent.trim();
    const productImg = productCard.querySelector('img').src;

    const existingItem = this.cart.find(item => item.id === productId);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      this.cart.push({
        id: productId,
        name: productName,
        price: productPrice,
        image: productImg,
        quantity: 1
      });
    }

    this.updateCartCount();
    this.saveCart();
    this.showAddedToCart(productName);
  }

  updateCartCount() {
    const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
    this.cartCount.textContent = totalItems;
    this.cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
  }

  showAddedToCart(productName) {
    // Remove notificação anterior se existir
    let notification = document.querySelector('.cart-notification');
    if (notification) {
      clearTimeout(this.notificationTimeout);
      notification.remove();
    }

    notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.setAttribute('role', 'alert');
    notification.style.opacity = '0';
    notification.innerHTML = `
      <p><strong>${productName}</strong> adicionado ao carrinho!</p>
      <a href="carrinho.html" class="view-cart" aria-label="Ver carrinho de compras">Ver Carrinho</a>
    `;

    document.body.appendChild(notification);

    // Força reflow para ativar transição
    notification.offsetWidth;
    notification.style.transition = 'opacity 0.3s ease';
    notification.style.opacity = '1';

    this.notificationTimeout = setTimeout(() => {
      notification.style.opacity = '0';
      notification.addEventListener('transitionend', () => notification.remove(), { once: true });
    }, 3000);
  }
}

class ProductFilter {
  constructor() {
    this.filterButton = document.querySelector('.filter-button');
    this.productGrid = document.querySelector('.products-grid');
    this.filterSelectors = document.querySelectorAll('.product-filter select');
    this.productCards = document.querySelectorAll('.product-card');

    this.init();
  }

  init() {
    if (this.filterButton && this.productGrid) {
      this.filterButton.addEventListener('click', e => {
        e.preventDefault();
        this.applyFilters();
      });

      // Aplicar filtros automaticamente ao mudar o select
      this.filterSelectors.forEach(select => {
        select.addEventListener('change', () => this.applyFilters());
      });

      // Aplica os filtros ao carregar a página, se houver filtros pré-selecionados (ex: via URL)
      this.applyFilters(); 
    }
  }

  applyFilters() {
    // 1. Coletar os valores dos filtros
    const category = document.getElementById('category').value;
    const material = document.getElementById('material').value;
    const priceRange = document.getElementById('price').value;

    this.productCards.forEach(card => {
      // 2. Coletar dados do produto para comparação
      // Normaliza o texto da descrição para facilitar a busca
      const productInfoText = card.querySelector('.product-info p').textContent.toLowerCase();
      // Extrai o valor numérico do preço, removendo R$ e vírgulas
      const productPriceText = card.querySelector('.price').textContent.replace('R$', '').replace(',', '.').trim();
      const productPriceValue = parseFloat(productPriceText);

      // 3. Lógica de Filtragem (Determinar se o produto deve ser mostrado)
      let shouldShow = true;

      // Filtro de Categoria (Procura no texto da descrição, e assume que 'Todas as Categorias' é vazio)
      if (category) {
        // Exemplo: se a categoria for "aneis", procura por "anel" ou "anéis"
        if (!productInfoText.includes(category.toLowerCase().replace(/s$/, ''))) { 
          shouldShow = false;
        }
      }

      // Filtro de Material (Procura no texto da descrição, e assume que 'Todos os Materiais' é vazio)
      if (material) {
        if (!productInfoText.includes(material.toLowerCase())) {
          shouldShow = false;
        }
      }

      // Filtro de Preço
      if (priceRange) {
        let min = 0;
        let max = Infinity;

        // Mapeamento dos valores de preço (corresponde aos values do seu joias.html)
        if (priceRange === '1') { // Até R$ 2.000
          max = 2000;
        } else if (priceRange === '2') { // R$ 2.000 - R$ 5.000
          min = 2000;
          max = 5000;
        } else if (priceRange === '3') { // Acima de R$ 5.000
          min = 5000;
        }
        
        if (productPriceValue < min || productPriceValue > max) {
          shouldShow = false;
        }
      }

      // 4. Aplicar o resultado (Mostrar ou ocultar)
      // Usamos 'flex' porque o CSS do .product-card foi definido com display: flex
      card.style.display = shouldShow ? 'flex' : 'none'; 
    });
  }
}

class FAQAccordion {
  constructor() {
    this.questions = document.querySelectorAll('.faq-question');
    this.init();
  }

  init() {
    this.questions.forEach(question => {
      question.addEventListener('click', () => this.toggleAnswer(question));
      // acessibilidade: permitir toggle via teclado
      question.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.toggleAnswer(question);
        }
      });
    });
  }

  toggleAnswer(question) {
    const answer = question.nextElementSibling;
    const icon = question.querySelector('i');

    const isActive = question.classList.toggle('active');
    answer.classList.toggle('active', isActive);

    if (isActive) {
      icon.classList.replace('fa-chevron-down', 'fa-chevron-up');
      answer.style.maxHeight = answer.scrollHeight + 'px';
      question.setAttribute('aria-expanded', 'true');
      answer.setAttribute('aria-hidden', 'false');
    } else {
      icon.classList.replace('fa-chevron-up', 'fa-chevron-down');
      answer.style.maxHeight = null;
      question.setAttribute('aria-expanded', 'false');
      answer.setAttribute('aria-hidden', 'true');
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new MobileMenu();
  new ShoppingCart();
  new ProductFilter(); // Inicialização da classe de filtro

  if (document.querySelector('.faq-question')) {
    new FAQAccordion();
  }

  // Smooth scroll para links internos
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      e.preventDefault();

      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
});

// Lazy loading moderno com fallback
(() => {
  const lazyImages = document.querySelectorAll('img[data-src]');

  if ('loading' in HTMLImageElement.prototype) {
    // Navegadores modernos suportam nativamente
    lazyImages.forEach(img => {
      img.src = img.dataset.src;
      img.removeAttribute('data-src');
    });
  } else if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          obs.unobserve(img);
        }
      });
    });

    lazyImages.forEach(img => observer.observe(img));
  } else {
    // Fallback simples
    lazyImages.forEach(img => {
      img.src = img.dataset.src;
      img.removeAttribute('data-src');
    });
  }
})();
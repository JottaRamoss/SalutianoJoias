class HeroCarousel {
    constructor() {
        this.carousel = document.querySelector('.hero-carousel');
        this.slides = document.querySelectorAll('.carousel-slide');
        this.dots = document.querySelectorAll('.dot');
        this.prevBtn = document.querySelector('.carousel-control.prev');
        this.nextBtn = document.querySelector('.carousel-control.next');
        this.currentSlide = 0;
        this.interval = null;
        this.intervalTime = 9000; // 5 segundos

        this.init();
    }

    init() {
        // Iniciar o carrossel
        this.startInterval();

        // Event listeners para controles
        this.prevBtn.addEventListener('click', () => {
            this.prevSlide();
            this.resetInterval();
        });

        this.nextBtn.addEventListener('click', () => {
            this.nextSlide();
            this.resetInterval();
        });

        // Event listeners para dots
        this.dots.forEach(dot => {
            dot.addEventListener('click', (e) => {
                const slideIndex = parseInt(e.target.dataset.slide);
                this.goToSlide(slideIndex);
                this.resetInterval();
            });
        });

        // Pausar ao passar o mouse
        this.carousel.addEventListener('mouseenter', () => {
            this.stopInterval();
        });

        this.carousel.addEventListener('mouseleave', () => {
            this.startInterval();
        });

        // Suporte a touch para dispositivos móveis
        this.setupTouchEvents();
    }

    setupTouchEvents() {
        let startX = 0;
        let endX = 0;

        this.carousel.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            this.stopInterval();
        });

        this.carousel.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            this.handleSwipe(startX, endX);
            this.startInterval();
        });
    }

    handleSwipe(startX, endX) {
        const diff = startX - endX;
        const swipeThreshold = 50;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                this.nextSlide();
            } else {
                this.prevSlide();
            }
        }
    }

    nextSlide() {
        this.goToSlide((this.currentSlide + 1) % this.slides.length);
    }

    prevSlide() {
        this.goToSlide((this.currentSlide - 1 + this.slides.length) % this.slides.length);
    }

    goToSlide(index) {
        // Remover classe active do slide atual
        this.slides[this.currentSlide].classList.remove('active');
        this.dots[this.currentSlide].classList.remove('active');

        // Atualizar índice atual
        this.currentSlide = index;

        // Adicionar classe active ao novo slide
        this.slides[this.currentSlide].classList.add('active');
        this.dots[this.currentSlide].classList.add('active');
    }

    startInterval() {
        this.interval = setInterval(() => {
            this.nextSlide();
        }, this.intervalTime);
    }

    stopInterval() {
        clearInterval(this.interval);
    }

    resetInterval() {
        this.stopInterval();
        this.startInterval();
    }
}

// Inicializar o carrossel quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    new HeroCarousel();
});
class NewsSlider {
    constructor() {
        this.track = document.querySelector('.news-track');
        this.slides = document.querySelectorAll('.news-slide');
        this.slider = document.querySelector('.news-slider');
        
        // Calcular a largura total necessária para o track
        this.slideWidth = this.slides[0].offsetWidth;
        this.trackWidth = this.slideWidth * this.slides.length;
        this.track.style.width = `${this.trackWidth}px`;
        
        // Clonar slides para criar efeito de loop contínuo
        this.cloneSlides();
        
        // Iniciar animação
        this.startAnimation();
        
        // Pausar/continuar animação ao passar o mouse
        this.setupHoverEvents();
    }
    
    cloneSlides() {
        // Clonar todos os slides e adicionar ao final do track
        for (let i = 0; i < this.slides.length; i++) {
            const clone = this.slides[i].cloneNode(true);
            this.track.appendChild(clone);
        }
    }
    
    startAnimation() {
        // A animação é controlada pelo CSS
        // Este método está aqui para possíveis extensões futuras
    }
    
    setupHoverEvents() {
        // A pausa na animação já é controlada pelo CSS
        // Este método está aqui para possíveis extensões futuras
    }
}

// Inicializar o news slider quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    new NewsSlider();
});
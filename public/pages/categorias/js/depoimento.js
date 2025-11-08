/*javascript do depoimento dos alunos*/
document.addEventListener('DOMContentLoaded', () => {
    const sliderWrapper = document.querySelector('.slider-wrapper');
    const cards = document.querySelectorAll('.testimonial-card');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const dotsContainer = document.getElementById('dots');
    let currentIndex = 0;

    /*Função para mostrar o card atual, aplicando as classes de estilo. */
    function updateSlider() {
        const cardWidth = cards[0].offsetWidth + 30; // Largura do card + margem
        sliderWrapper.style.transform = `translateX(${-currentIndex * cardWidth}px)`;

        cards.forEach((card, index) => {
            card.classList.remove('active');
            if (index === currentIndex) {
                card.classList.add('active');
            }
        });

        updateDots();
    }

    /* Função para criar e atualizar os dots de navegação.*/
    function createDots() {
        dotsContainer.innerHTML = ''; // Limpa os dots existentes
        cards.forEach((_, index) => {
            const dot = document.createElement('span');
            dot.classList.add('dot');
            if (index === 0) {
                dot.classList.add('active');
            }
            dot.addEventListener('click', () => {
                currentIndex = index;
                updateSlider();
            });
            dotsContainer.appendChild(dot);
        });
    }

    /* Função para atualizar o estado ativo dos dots.*/
    function updateDots() {
        const dots = document.querySelectorAll('.dot');
        dots.forEach((dot, index) => {
            dot.classList.remove('active');
            if (index === currentIndex) {
                dot.classList.add('active');
            }
        });
    }

    /* Move para o próximo depoimento. */
    function nextSlide() {
        currentIndex = (currentIndex + 1) % cards.length;
        updateSlider();
    }

    /*Move para o depoimento anterior.*/
    function prevSlide() {
        currentIndex = (currentIndex - 1 + cards.length) % cards.length;
        updateSlider();
    }

    /*Eventos de clique para os botões*/
    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);

    createDots();
    /* Atraso para garantir que o layout esteja pronto antes de calcular a largura*/
    setTimeout(updateSlider, 50);

    /*Auto-play (opcional)*/
    setInterval(nextSlide, 8000); // Muda a cada 8 segundos*/

    /*Ajuste do slider ao redimensionar a tela*/
    window.addEventListener('resize', updateSlider);
});
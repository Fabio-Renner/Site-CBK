document.addEventListener("DOMContentLoaded", function() {
    const carousel = document.querySelector('.carousel');
    const cards = document.querySelectorAll('.nps-card');
    let currentIndex = 0;
    
    // Função para exibir o card atual
    function showCard(index) {
        const cardWidth = cards[0].offsetWidth + 20; // Largura do card + margem
        carousel.style.transform = `translateX(-${cardWidth * index}px)`; // Move o carrossel
    }

    // Função para alternar para o próximo card
    function nextCard() {
        currentIndex = (currentIndex + 1) % cards.length; // Loop de cards
        showCard(currentIndex);
    }

    // Intervalo para alternar o card a cada 4 segundos
    setInterval(nextCard, 3000);

    // Inicializa com o primeiro card
    showCard(currentIndex);
});




// Função para abrir e fechar as gavetas
document.addEventListener('DOMContentLoaded', function() {
    // Seleciona todos os botões de título das gavetas
    const gavetaTitulos = document.querySelectorAll('.gaveta-titulo');

    // Adiciona um evento de clique em cada título
    gavetaTitulos.forEach(function(titulo) {
        titulo.addEventListener('click', function() {
            // Encontra a gaveta (o elemento pai) do título clicado
            const gaveta = titulo.closest('.gaveta');

            // Verifica se a gaveta está aberta ou fechada e altera a classe
            gaveta.classList.toggle('aberta');
        });
    });
});



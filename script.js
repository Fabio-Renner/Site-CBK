// Carrossel de NPS
document.addEventListener("DOMContentLoaded", function() {
    const carousel = document.querySelector('.carousel');
    const cards = document.querySelectorAll('.nps-card');
    let currentIndex = 0;
    
    function showCard(index) {
      const cardWidth = cards[0].offsetWidth + 20;
      carousel.style.transform = `translateX(-${cardWidth * index}px)`;
    }
    
    function nextCard() {
      currentIndex = (currentIndex + 1) % cards.length;
      showCard(currentIndex);
    }
    
    setInterval(nextCard, 3000);
    showCard(currentIndex);
  });
  
  // Accordion das gavetas
  document.addEventListener('DOMContentLoaded', function() {
    const gavetaTitulos = document.querySelectorAll('.gaveta-titulo');
    gavetaTitulos.forEach(function(titulo) {
      titulo.addEventListener('click', function() {
        const gaveta = titulo.closest('.gaveta');
        gaveta.classList.toggle('aberta');
      });
    });
  });
  
  // --- Funções para destaque sem alterar os inputs ---
  
  // Remove os spans de destaque dentro de um elemento
  function removeHighlights(element) {
    const highlights = element.querySelectorAll('span.highlight-term');
    highlights.forEach(span => {
      // Substitui o span pelo seu conteúdo de texto (preservando o conteúdo)
      span.outerHTML = span.innerText;
    });
  }
  
  // Usa TreeWalker para encontrar nós de texto e aplicar destaque
  function highlightTextNodes(element, regex) {
    const walker = document.createTreeWalker(
      element,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode: function(node) {
          // Ignora nós que estão dentro de elementos de formulário
          if (node.parentElement && ["INPUT", "TEXTAREA", "BUTTON"].includes(node.parentElement.tagName)) {
            return NodeFilter.FILTER_REJECT;
          }
          return NodeFilter.FILTER_ACCEPT;
        }
      },
      false
    );
    
    let node;
    while (node = walker.nextNode()) {
      if (regex.test(node.nodeValue)) {
        // Cria um span com o texto substituído
        const span = document.createElement('span');
        span.innerHTML = node.nodeValue.replace(regex, '<span class="highlight-term">$1</span>');
        node.parentNode.replaceChild(span, node);
      }
    }
  }
  
  // Função de busca com destaque usando as funções acima
  function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
  
  function buscarPalavra() {
    const termo = document.getElementById('busca').value.trim();
    if (!termo) return;
    
    const regex = new RegExp(`(${escapeRegExp(termo)})`, "gi");
    const gavetas = document.querySelectorAll('.gaveta');
    let elementosEncontrados = [];
    
    gavetas.forEach(gaveta => {
      const conteudoEl = gaveta.querySelector('.gaveta-conteudo');
      if (conteudoEl) {
        removeHighlights(conteudoEl);
        if (conteudoEl.innerText.toLowerCase().includes(termo.toLowerCase())) {
          gaveta.classList.add('aberta');
          highlightTextNodes(conteudoEl, regex);
          elementosEncontrados.push(conteudoEl);
        } else {
          gaveta.classList.remove('aberta');
        }
      }
    });
    
    if (elementosEncontrados.length > 0) {
      elementosEncontrados[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }
  
  document.addEventListener('DOMContentLoaded', function() {
    const buscaInput = document.getElementById('busca');
    buscaInput.addEventListener('keydown', function(e) {
      if (e.key === "Enter") {
        e.preventDefault();
        buscarPalavra();
      }
    });
  });
  
  // --- Função para converter data ---
  function parseDateBR(dateStr) {
    let delimiter = dateStr.includes('/') ? '/' : '-';
    const parts = dateStr.split(delimiter);
    if (parts.length !== 3) return null;
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const year = parseInt(parts[2], 10);
    return new Date(year, month, day);
  }
  
  // --- Função para calcular CBK e gerar mensagens ---
  function calcularCBK() {
    console.log("Calculando CBK...");
    const valorAtual = parseFloat(document.getElementById('valor_atual').value);
    const debito = parseFloat(document.getElementById('debito_valor').value) || 0;
    
    const dataVencimentoStr = document.getElementById('data_vencimento').value;
    const dataHojeStr = document.getElementById('data_hoje').value;
    
    const dataVencimento = parseDateBR(dataVencimentoStr);
    const dataHoje = parseDateBR(dataHojeStr);
    
    console.log("valorAtual:", valorAtual);
    console.log("debito:", debito);
    console.log("dataVencimento:", dataVencimento);
    console.log("dataHoje:", dataHoje);
    
    if (isNaN(valorAtual)) {
      alert("Informe um valor atual válido.");
      return;
    }
    
    if (!dataVencimento || !dataHoje || isNaN(dataVencimento.getTime()) || isNaN(dataHoje.getTime())) {
      alert("Informe datas válidas no formato dd/mm/aaaa.");
      return;
    }
    
    const diffTime = dataHoje - dataVencimento;
    const diffDays = Math.max(Math.floor(diffTime / (1000 * 60 * 60 * 24)), 0);
    console.log("diffDays:", diffDays);
    
    const baseValue = valorAtual - debito;
    const updatedValue = baseValue * (1 + 0.013 * diffDays);
    console.log("updatedValue:", updatedValue);
    
    // Atualiza o campo do CBK atualizado
    document.getElementById('cbk_atualizado').value = updatedValue.toFixed(2);
    
    // Gera as mensagens conforme a presença de débito
    const valorAtualText = document.getElementById('valor_atual').value;
    const debitoText = document.getElementById('debito_valor').value;
    const cbkAtualizadoText = document.getElementById('cbk_atualizado').value;
    const dataHojeText = document.getElementById('data_hoje').value;
    
    let boletoMsg = "";
    let tidMsg = "";
    if (debitoText && parseFloat(debitoText) !== 0) {
      boletoMsg = `Débito no valor de R$${debitoText} - Boleto atualizado de R$${valorAtualText} para R$${cbkAtualizadoText} data de vencimento inicial ${dataHojeText} - Escuta_ativa`;
      tidMsg = `Comentário no TID: Débito no valor de R$${debitoText} - Transação xxxxxxx - Escuta_ativa`;
    } else {
      boletoMsg = `Boleto atualizado de R$${valorAtualText} para R$${cbkAtualizadoText} data de vencimento inicial ${dataHojeText}.`;
    }
    
    // Insere as mensagens no container de resultado
    const resultadoContainer = document.getElementById("resultadoContainer");
    resultadoContainer.innerHTML = `
      <textarea rows="4" cols="50" readonly>${boletoMsg}</textarea>
      ${tidMsg ? `<br><textarea rows="2" cols="50" readonly>${tidMsg}</textarea>` : ""}
    `;
  }
  
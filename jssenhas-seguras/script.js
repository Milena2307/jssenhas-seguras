const campoSenha = document.querySelector('#campo-senha');
const tamanhoSenha = document.querySelector('#tamanho-senha');
const botaoMenos = document.querySelector('#diminuir-tamanho');
const botaoMais = document.querySelector('#aumentar-tamanho');
const botaoGerar = document.querySelector('#gerar-senha');
const botaoCopiar = document.querySelector('#copiar-senha');
const checkMaiusculas = document.querySelector('#incluir-maiusculas');
const checkMinusculas = document.querySelector('#incluir-minusculas');
const checkNumeros = document.querySelector('#incluir-numeros');
const checkSimbolos = document.querySelector('#incluir-simbolos');
const forcaSenha = document.querySelector('#forca-senha');

const TAMANHO_MIN = 4;
const TAMANHO_MAX = 32;
const CHARSETS = {
  upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lower: 'abcdefghijklmnopqrstuvwxyz',
  number: '0123456789',
  symbol: "!@#$%^&*()_+[]{}|;:,.<>?/~`-='"
};

function atualizarTamanho() {
  tamanhoSenha.textContent = campoSenha.dataset.tamanho;
}

function atualizarForca() {
  const tamanho = Number(campoSenha.dataset.tamanho);
  const selecao = [checkMaiusculas.checked, checkMinusculas.checked, checkNumeros.checked, checkSimbolos.checked].filter(Boolean).length;
  let texto = 'Fraca';
  let cor = '#FF5656';

  if (tamanho >= 16 && selecao >= 3) {
    texto = 'Forte';
    cor = '#36D399';
  } else if (tamanho >= 10 && selecao >= 2) {
    texto = 'Moderada';
    cor = '#FFD166';
  }

  forcaSenha.textContent = texto;
  forcaSenha.style.color = cor;
}

function criarSenha() {
  const tamanho = Number(campoSenha.dataset.tamanho);
  const possiveis = [];
  let senha = '';

  if (checkMaiusculas.checked) possiveis.push(CHARSETS.upper);
  if (checkMinusculas.checked) possiveis.push(CHARSETS.lower);
  if (checkNumeros.checked) possiveis.push(CHARSETS.number);
  if (checkSimbolos.checked) possiveis.push(CHARSETS.symbol);

  if (possiveis.length === 0) {
    campoSenha.value = 'Selecione pelo menos uma opção';
    return;
  }

  // Garante pelo menos um caractere de cada conjunto selecionado
  possiveis.forEach((charset) => {
    senha += charset[Math.floor(Math.random() * charset.length)];
  });

  const conjuntoCompleto = possiveis.join('');
  for (let i = senha.length; i < tamanho; i += 1) {
    senha += conjuntoCompleto[Math.floor(Math.random() * conjuntoCompleto.length)];
  }

  campoSenha.value = senha.split('').sort(() => Math.random() - 0.5).join('');
}

function ajustarTamanho(delta) {
  let tamanho = Number(campoSenha.dataset.tamanho) + delta;
  tamanho = Math.max(TAMANHO_MIN, Math.min(TAMANHO_MAX, tamanho));
  campoSenha.dataset.tamanho = String(tamanho);
  atualizarTamanho();
  atualizarForca();
}

botaoMenos.addEventListener('click', () => ajustarTamanho(-1));
botaoMais.addEventListener('click', () => ajustarTamanho(1));

[checkMaiusculas, checkMinusculas, checkNumeros, checkSimbolos].forEach((checkbox) => {
  checkbox.addEventListener('change', atualizarForca);
});

botaoGerar.addEventListener('click', () => {
  criarSenha();
  atualizarForca();
});

botaoCopiar.addEventListener('click', async () => {
  if (!campoSenha.value) return;
  try {
    await navigator.clipboard.writeText(campoSenha.value);
    botaoCopiar.textContent = 'Copiado!';
    setTimeout(() => { botaoCopiar.textContent = 'Copiar'; }, 1500);
  } catch (err) {
    console.error('Erro ao copiar:', err);
  }
});

// Inicializa valores
campoSenha.dataset.tamanho = '12';
atualizarTamanho();
atualizarForca();
criarSenha();

// ==========================================================================
// FitLife — lógica do Controle de Hidratação
// Usa localStorage para lembrar os registros do dia mesmo se a página
// for fechada e reaberta.
// ==========================================================================

const META_ML = 2500;
const CHAVE_STORAGE = "fitlife_water_log";

const ring = document.getElementById("ring-progress");
const amountLabel = document.getElementById("amount-label");
const goalLabel = document.getElementById("goal-label");
const statusMsg = document.getElementById("status-msg");
const logList = document.getElementById("log-list");
const customInput = document.getElementById("custom-ml");

// Perímetro do círculo do anel (2 * PI * raio), raio = 86
const PERIMETRO = 2 * Math.PI * 86;
ring.style.strokeDasharray = PERIMETRO;

goalLabel.textContent = `meta: ${META_ML} ml`;

// Carrega os registros salvos ou começa uma lista vazia
function carregarRegistros() {
  const dados = localStorage.getItem(CHAVE_STORAGE);
  return dados ? JSON.parse(dados) : [];
}

function salvarRegistros(registros) {
  localStorage.setItem(CHAVE_STORAGE, JSON.stringify(registros));
}

function formatarHora(timestamp) {
  const data = new Date(timestamp);
  return data.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}

function renderizar() {
  const registros = carregarRegistros();
  const total = registros.reduce((soma, r) => soma + r.ml, 0);
  const progresso = Math.min(total / META_ML, 1);

  // Atualiza o anel (SVG stroke-dashoffset)
  ring.style.strokeDashoffset = PERIMETRO * (1 - progresso);
  ring.classList.toggle("goal-reached", total >= META_ML);

  amountLabel.textContent = `${total} ml`;

  if (total >= META_ML) {
    statusMsg.textContent = "Meta batida! Parabéns 💧";
    statusMsg.classList.add("done");
  } else {
    const restante = META_ML - total;
    statusMsg.textContent = `Faltam ${restante} ml para a meta.`;
    statusMsg.classList.remove("done");
  }

  // Atualiza a lista de registros
  if (registros.length === 0) {
    logList.innerHTML = `<li class="empty">Nenhum registro ainda.</li>`;
    return;
  }

  logList.innerHTML = registros
    .slice()
    .reverse()
    .map((r) => `<li><span>${r.ml} ml</span><span>${formatarHora(r.hora)}</span></li>`)
    .join("");
}

function adicionarAgua(ml) {
  if (!ml || ml <= 0) return;
  const registros = carregarRegistros();
  registros.push({ ml, hora: Date.now() });
  salvarRegistros(registros);
  renderizar();
}

// Botões de quantidade fixa (+200 / +300 / +500)
document.querySelectorAll(".water-btn").forEach((botao) => {
  botao.addEventListener("click", () => {
    adicionarAgua(parseInt(botao.dataset.ml, 10));
  });
});

// Quantidade personalizada
document.getElementById("add-custom").addEventListener("click", () => {
  const valor = parseInt(customInput.value, 10);
  adicionarAgua(valor);
  customInput.value = "";
});

// Reiniciar o dia
document.getElementById("reset-btn").addEventListener("click", () => {
  if (confirm("Tem certeza que deseja reiniciar os registros de hoje?")) {
    salvarRegistros([]);
    renderizar();
  }
});

renderizar();

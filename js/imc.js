// ==========================================================================
// FitLife — lógica da Calculadora de IMC
// ==========================================================================

const form = document.getElementById("imc-form");
const pesoInput = document.getElementById("peso");
const alturaInput = document.getElementById("altura");
const erroPeso = document.getElementById("erro-peso");
const erroAltura = document.getElementById("erro-altura");
const resultCard = document.getElementById("result-card");

// Classifica o IMC de acordo com as faixas da Organização Mundial da Saúde
function classificarIMC(imc) {
  if (imc < 18.5) {
    return { texto: "Abaixo do peso", classe: "low" };
  }
  if (imc < 25) {
    return { texto: "Peso normal", classe: "normal" };
  }
  if (imc < 30) {
    return { texto: "Sobrepeso", classe: "over" };
  }
  return { texto: "Obesidade", classe: "obese" };
}

function validar() {
  let valido = true;
  erroPeso.textContent = "";
  erroAltura.textContent = "";

  const peso = parseFloat(pesoInput.value.replace(",", "."));
  const altura = parseFloat(alturaInput.value.replace(",", "."));

  if (isNaN(peso) || peso <= 0 || peso > 500) {
    erroPeso.textContent = "Informe um peso válido (entre 1 e 500 kg).";
    valido = false;
  }

  if (isNaN(altura) || altura <= 0 || altura > 250) {
    erroAltura.textContent = "Informe uma altura válida (entre 30 e 250 cm).";
    valido = false;
  }

  return { valido, peso, altura };
}

function exibirResultado(imc, classificacao) {
  resultCard.innerHTML = `
    <p class="result-value">${imc.toFixed(1)}</p>
    <span class="result-tag ${classificacao.classe}">${classificacao.texto}</span>
    <p class="result-note">Este número é apenas uma referência geral e não substitui
      a avaliação de um profissional de saúde.</p>
  `;
}

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const { valido, peso, altura } = validar();
  if (!valido) return;

  // Fórmula do IMC: peso (kg) dividido pela altura (m) ao quadrado
  const alturaEmMetros = altura / 100;
  const imc = peso / (alturaEmMetros * alturaEmMetros);

  const classificacao = classificarIMC(imc);
  exibirResultado(imc, classificacao);
});

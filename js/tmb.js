// ==========================================================================
// FitLife — lógica da Taxa Metabólica Basal (fórmula de Harris-Benedict)
// ==========================================================================

const form = document.getElementById("tmb-form");
const pesoInput = document.getElementById("peso");
const alturaInput = document.getElementById("altura");
const idadeInput = document.getElementById("idade");
const erroPeso = document.getElementById("erro-peso");
const erroAltura = document.getElementById("erro-altura");
const erroIdade = document.getElementById("erro-idade");
const resultCard = document.getElementById("result-card");

// Fórmula de Harris-Benedict (revisada)
// Homens:   TMB = 88.36 + (13.4 x peso) + (4.8 x altura) - (5.7 x idade)
// Mulheres: TMB = 447.6 + (9.2  x peso) + (3.1 x altura) - (4.3 x idade)
function calcularTMB(sexo, peso, altura, idade) {
  if (sexo === "masculino") {
    return 88.36 + 13.4 * peso + 4.8 * altura - 5.7 * idade;
  }
  return 447.6 + 9.2 * peso + 3.1 * altura - 4.3 * idade;
}

function validar() {
  let valido = true;
  erroPeso.textContent = "";
  erroAltura.textContent = "";
  erroIdade.textContent = "";

  const peso = parseFloat(pesoInput.value.replace(",", "."));
  const altura = parseFloat(alturaInput.value.replace(",", "."));
  const idade = parseInt(idadeInput.value, 10);

  if (isNaN(peso) || peso <= 0 || peso > 500) {
    erroPeso.textContent = "Informe um peso válido (entre 1 e 500 kg).";
    valido = false;
  }
  if (isNaN(altura) || altura <= 0 || altura > 250) {
    erroAltura.textContent = "Informe uma altura válida (entre 30 e 250 cm).";
    valido = false;
  }
  if (isNaN(idade) || idade <= 0 || idade > 120) {
    erroIdade.textContent = "Informe uma idade válida (entre 10 e 120 anos).";
    valido = false;
  }

  return { valido, peso, altura, idade };
}

function exibirResultado(tmb) {
  resultCard.innerHTML = `
    <p class="result-value">${Math.round(tmb)}</p>
    <span class="result-tag normal">kcal / dia em repouso</span>
    <p class="result-note">Esse é o mínimo de energia que seu corpo consome
      em repouso. Para saber seu gasto total, multiplique pelo seu nível de
      atividade física.</p>
  `;
}

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const sexo = document.querySelector('input[name="sexo"]:checked').value;
  const { valido, peso, altura, idade } = validar();
  if (!valido) return;

  const tmb = calcularTMB(sexo, peso, altura, idade);
  exibirResultado(tmb);
});

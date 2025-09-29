document.addEventListener("DOMContentLoaded", async function () {
  const hoje = new Date();
  const dataChave = hoje.toISOString().split("T")[0]; // 2025-09-29
  const dataFormatada = hoje.toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
  });
  document.getElementById("dataLiturgia").innerText = dataFormatada;

  try {
    const resposta = await fetch("liturgia.json");
    const todas = await resposta.json();
    const dados = todas[dataChave];

    if (dados) {
      document.getElementById("resumo1").innerText = dados.primeira;
      document.getElementById("resumoSalmo").innerText = dados.salmo;
      document.getElementById("resumoEvan").innerText = dados.evangelho;
      document.getElementById("liturgia-completa").innerHTML = `
        <h3>Primeira Leitura</h3><p>$${dados.primeira}</p>
        <h3>Salmo</h3><p>$${dados.salmo}</p>
        <h3>Evangelho</h3><p>$${dados.evangelho}</p>
      `;
    } else {
      document.getElementById("liturgia-completa").innerHTML = `
        ⚠️ Leituras não cadastradas para hoje.
      `;
    }
  } catch (e) {
    console.error("Erro:", e);
    document.getElementById("liturgia-completa").innerHTML = `
      ⚠️ Não foi possível ler as leituras locais.
    `;
  }
});

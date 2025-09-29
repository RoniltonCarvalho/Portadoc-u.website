document.addEventListener("DOMContentLoaded", async function () {
  const hoje = new Date();
  const dataFormatada = hoje.toISOString().split("T")[0]; // exemplo: 2025-09-29
  const dataFormatadaBr = hoje.toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
  });

  document.getElementById("dataLiturgia").innerText = dataFormatadaBr;

  try {
    const resposta = await fetch("https://liturgiadiaria.site/api/" + dataFormatada);
    if (!resposta.ok) throw new Error("Erro API");

    const dados = await resposta.json();

    // Atualiza resumos no topo
    document.getElementById("resumo1").innerText = dados.primeira || "Leitura não disponível";
    document.getElementById("resumoSalmo").innerText = dados.salmo || "Salmo não disponível";
    document.getElementById("resumoEvan").innerText = dados.evangelho || "Evangelho não disponível";

    // Mostra a liturgia completa
    document.getElementById("liturgia-completa").innerHTML = `
      <h3>Primeira Leitura</h3><p>$${dados.primeira}</p>
      <h3>Salmo</h3><p>$${dados.salmo}</p>
      <h3>Evangelho</h3><p>$${dados.evangelho}</p>
    `;
  } catch (e) {
    console.error("Erro:", e);
    document.getElementById("liturgia-completa").innerHTML = `
      ⚠️ Não foi possível carregar as leituras de hoje.
      Consulte: <a href="https://www.evangelizo.org" target="_blank">Evangelizo.org</a>
    `;
  }
});

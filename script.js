document.addEventListener("DOMContentLoaded", async function () {
  const hoje = new Date();
  const dataISO = hoje.toISOString().split("T")[0]; // formato YYYY-MM-DD
  const dataFormatada = hoje.toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
  });
  document.getElementById("dataLiturgia").innerText = dataFormatada;

  const fallback = `
    ⚠️ Leituras indisponíveis.  
    Consulte em <a href="https://evangelizo.org" target="_blank">Evangelizo.org</a>
  `;

  try {
    const url = "https://liturgiadiaria.site/api/" + dataISO;
    const resposta = await fetch(url);
    if (!resposta.ok) throw new Error("Erro ao buscar API");
    const dados = await resposta.json();

    document.getElementById("resumo1").innerText = dados.primeira || "Indisponível";
    document.getElementById("resumoSalmo").innerText = dados.salmo || "Indisponível";
    document.getElementById("resumoEvan").innerText = dados.evangelho || "Indisponível";

    document.getElementById("liturgia-completa").innerHTML = `
      <h3>Primeira Leitura</h3><p>$${dados.primeira}</p>
      <h3>Salmo</h3><p>$${dados.salmo}</p>
      <h3>Evangelho</h3><p>${dados.evangelho}</p>
    `;
  } catch (e) {
    console.error("Erro:", e);
    document.getElementById("liturgia-completa").innerHTML = fallback;
  }
});

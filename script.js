document.addEventListener("DOMContentLoaded", async function () {
  const hoje = new Date();
  const dataFormatada = hoje.toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
  });
  document.getElementById("dataLiturgia").innerText = dataFormatada;

  // Sempre mostra iniciais básicas
  document.getElementById("resumo1").innerText = "Leitura da carta de São Paulo...";
  document.getElementById("resumoSalmo").innerText = "O Senhor é meu pastor...";
  document.getElementById("resumo2").innerText = "Leitura da segunda carta...";
  document.getElementById("resumoEvan").innerText = "Evangelho de São Mateus...";

  try {
    const rssUrl = "https://api.allorigins.win/raw?url=" +
      encodeURIComponent("https://www.evangelizo.org/rss/evangelho.xml");

    const resposta = await fetch(rssUrl);
    if (!resposta.ok) return;

    const xmlText = await resposta.text();
    const parser = new DOMParser();
    const xml = parser.parseFromString(xmlText, "application/xml");

    const item = xml.querySelector("item");
    if (item) {
      const titulo = item.querySelector("title")?.textContent || "";
      const descricao = item.querySelector("description")?.textContent || "";

      if (titulo) document.getElementById("resumo1").innerText = titulo;
      if (descricao) document.getElementById("resumoEvan").innerText = descricao;
    }
  } catch (e) {
    console.error("Erro ao buscar leituras", e);
  }
});
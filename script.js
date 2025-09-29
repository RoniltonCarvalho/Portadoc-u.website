document.addEventListener("DOMContentLoaded", async function () {
  const hoje = new Date();
  const dataFormatada = hoje.toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
  });
  document.getElementById("dataLiturgia").innerText = dataFormatada;

  // defaults
  document.getElementById("resumo1").innerText = "Leitura da carta de São Paulo...";
  document.getElementById("resumoSalmo").innerText = "O Senhor é meu pastor...";
  document.getElementById("resumo2").innerText = "Leitura da segunda carta...";
  document.getElementById("resumoEvan").innerText = "Evangelho de São Mateus...";
  document.getElementById("santoDia").innerText = "Hoje: São Miguel Arcanjo";

  try {
    // Liturgia do dia
    const rssUrl = "https://api.allorigins.win/raw?url=" +
      encodeURIComponent("https://www.evangelizo.org/rss/evangelho.xml");
    const resp = await fetch(rssUrl);
    if (resp.ok) {
      const xmlText = await resp.text();
      const parser = new DOMParser();
      const xml = parser.parseFromString(xmlText, "application/xml");
      const item = xml.querySelector("item");
      if (item) {
        const titulo = item.querySelector("title")?.textContent || "";
        const descricao = item.querySelector("description")?.textContent || "";
        if (titulo) document.getElementById("resumo1").innerText = titulo;
        if (descricao) document.getElementById("resumoEvan").innerText = descricao;
      }
    }
    // Santo do dia
    const rssSanto = "https://api.allorigins.win/raw?url=" +
      encodeURIComponent("https://www.evangelizo.org/rss/saint.xml");
    const respSanto = await fetch(rssSanto);
    if (respSanto.ok) {
      const xmlText = await respSanto.text();
      const parser = new DOMParser();
      const xml = parser.parseFromString(xmlText, "application/xml");
      const item = xml.querySelector("item");
      if (item) {
        const titulo = item.querySelector("title")?.textContent || "";
        if (titulo) document.getElementById("santoDia").innerText = "Hoje: " + titulo;
      }
    }
  } catch (e) {
    console.error("Erro ao buscar leituras ou santo do dia", e);
  }
});
document.addEventListener("DOMContentLoaded", async function () {
  const hoje = new Date();
  const dataFormatada = hoje.toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
  });
  document.getElementById("dataLiturgia").innerText = dataFormatada;

  const fallback = `
    ⚠️ Não foi possível carregar as leituras de hoje.<br>
    Acesse diretamente em: <a href="https://evangelizo.org" target="_blank">Evangelizo.org</a>
  `;

  try {
    // RSS Evangelho do Evangelizo.org (mais estável)
    const rssUrl = "https://www.evangelizo.org/rss/evangelho.xml";
    const resposta = await fetch(rssUrl);
    const xmlText = await resposta.text();

    const parser = new DOMParser();
    const xml = parser.parseFromString(xmlText, "application/xml");
    const items = xml.querySelectorAll("item");

    if (items.length > 0) {
      const titulo = items[0].querySelector("title")?.textContent || "Liturgia do Dia";
      const corpoHtml = items[0].querySelector("description")?.textContent || "";

      // Resumo no banner
      document.getElementById("resumo1").innerText = titulo;
      document.getElementById("resumoSalmo").innerText = "Salmo: veja abaixo";
      document.getElementById("resumoEvan").innerText = "Evangelho: veja abaixo";

      // Conteúdo completo
      document.getElementById("liturgia-completa").innerHTML = corpoHtml;
      return;
    }
  } catch (e) {
    console.error("Erro ao carregar liturgia:", e);
  }

  // Se tudo falhar
  document.getElementById("liturgia-completa").innerHTML = fallback;
});

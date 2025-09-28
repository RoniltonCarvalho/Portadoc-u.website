document.addEventListener("DOMContentLoaded", async function () {
  const hoje = new Date();
  const dataFormatada = hoje.toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
  });
  document.getElementById("dataLiturgia").innerText = dataFormatada;

  try {
    const rssUrl = "https://liturgia.cancaonova.com/pb/feed/";
    const proxyUrl = "https://api.allorigins.win/get?url=" + encodeURIComponent(rssUrl);

    const resposta = await fetch(proxyUrl);
    const data = await resposta.json();

    const parser = new DOMParser();
    const xml = parser.parseFromString(data.contents, "application/xml");

    const items = xml.querySelectorAll("item");

    if (items.length > 0) {
      const titulo = items[0].querySelector("title")?.textContent || "Liturgia do Dia";
      const corpoHtml = items[0].querySelector("description")?.textContent || "";

      // Resumo no banner
      document.getElementById("resumo1").innerText = titulo;
      document.getElementById("resumoSalmo").innerText = "Salmo: incluído abaixo";
      document.getElementById("resumoEvan").innerText = "Evangelho: incluído abaixo";

      // Exibe o conteúdo completo
      document.getElementById("liturgia-completa").innerHTML = corpoHtml;
    }
  } catch (error) {
    console.error("Erro ao carregar liturgia:", error);
    document.getElementById("liturgia-completa").innerText =
      "Não foi possível carregar a Liturgia do Dia.";
  }
});

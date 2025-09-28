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
    // novo proxy mais estável
    const proxyUrl = "https://thingproxy.freeboard.io/fetch/" + rssUrl;

    const resposta = await fetch(proxyUrl);
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

      // Texto completo
      document.getElementById("liturgia-completa").innerHTML = corpoHtml;
    }
  } catch (error) {
    console.error("Erro ao carregar liturgia:", error);
    document.getElementById("liturgia-completa").innerText =
      "Não foi possível carregar a Liturgia do Dia.";
  }
});

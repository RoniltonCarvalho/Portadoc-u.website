document.addEventListener("DOMContentLoaded", async function () {
  const hoje = new Date();
  const dataFormatada = hoje.toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
  });
  document.getElementById("dataLiturgia").innerText = dataFormatada;

  // Mensagem fallback
  const fallback = `
    ⚠️ Leituras indisponíveis.<br>
    Consulte em <a href="https://www.evangelizo.org" target="_blank">Evangelizo.org</a>
  `;

  try {
    // RSS do Evangelizo (via proxy AllOrigins)
    const rssUrl = "https://api.allorigins.win/raw?url=" 
      + encodeURIComponent("https://www.evangelizo.org/rss/evangelho.xml");

    const resposta = await fetch(rssUrl);
    if (!resposta.ok) throw new Error("RSS não disponível");

    const xmlText = await resposta.text();
    const parser = new DOMParser();
    const xml = parser.parseFromString(xmlText, "application/xml");

    const item = xml.querySelector("item");
    if (item) {
      const titulo = item.querySelector("title")?.textContent || "Liturgia do Dia";
      const descricao = item.querySelector("description")?.textContent || "";

      // Atualiza resumo no topo
      document.getElementById("resumo1").innerText = titulo;
      document.getElementById("resumoSalmo").innerText = "Salmo: veja abaixo";
      document.getElementById("resumoEvan").innerText = "Evangelho: veja abaixo";

      // Mostra algo no corpo
      document.getElementById("liturgia-completa").innerHTML = descricao;
      return;
    }
  } catch (e) {
    console.error("Erro:", e);
  }

  // Se tudo falhar -> mostra fallback
  document.getElementById("liturgia-completa").innerHTML = fallback;
});

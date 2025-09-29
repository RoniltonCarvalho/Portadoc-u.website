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
    ⚠️ Leituras indisponíveis.<br>
    Consulte em <a href="https://www.evangelizo.org" target="_blank">Evangelizo.org</a>
  `;

  try {
    // RSS do Evangelizo (via proxy)
    const rssUrl = "https://api.allorigins.win/raw?url=" + encodeURIComponent("https://www.evangelizo.org/rss/evangelho.xml");

    const resposta = await fetch(rssUrl);
    if (!resposta.ok) throw new Error("RSS não disponível");

    const xmlText = await resposta.text();
    const parser = new DOMParser();
    const xml = parser.parseFromString(xmlText, "application/xml");

    const item = xml.querySelector("item");
    if (item) {
      const titulo = item.querySelector("title")?.textContent || "";
      const descricao = item.querySelector("description")?.textContent || "";

      // joga direto nos blocos da área ROSA
      document.getElementById("resumo1").innerText = titulo;
      document.getElementById("resumoSalmo").innerText = "Resumo: veja no link abaixo";
      document.getElementById("resumoEvan").innerHTML = descricao;

      return;
    }
  } catch (e) {
    console.error("Erro:", e);
  }

  // Se nada carregar
  document.getElementById("resumo1").innerHTML = fallback;
  document.getElementById("resumoSalmo").innerHTML = "";
  document.getElementById("resumoEvan").innerHTML = "";
});

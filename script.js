document.addEventListener("DOMContentLoaded", async function () {
  const hoje = new Date();
  const dataISO = hoje.toISOString().split("T")[0]; // Ex: 2025-09-28
  const dataFormatada = hoje.toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
  });
  document.getElementById("dataLiturgia").innerText = dataFormatada;

  const fallback = `
    ⚠️ Leituras indisponíveis online.<br>
    Consulte: <a href="https://www.evangelizo.org" target="_blank">Evangelizo.org</a>
  `;

  // 1ª tentativa: RSS
  try {
    const rssUrl = "https://api.allorigins.win/raw?url=" 
      + encodeURIComponent("https://www.evangelizo.org/rss/evangelho.xml");

    const resposta = await fetch(rssUrl);
    if (resposta.ok) {
      const xmlText = await resposta.text();
      const parser = new DOMParser();
      const xml = parser.parseFromString(xmlText, "application/xml");

      const item = xml.querySelector("item");
      if (item) {
        document.getElementById("liturgia-completa").innerHTML =
          item.querySelector("description")?.textContent || fallback;
        return;
      }
    }
  } catch (e) {
    console.error("Erro RSS:", e);
  }

  // 2ª tentativa: liturgia.json local
  try {
    const respLocal = await fetch("liturgia.json");
    const todas = await respLocal.json();
    const dados = todas[dataISO];

    if (dados) {
      document.getElementById("liturgia-completa").innerHTML = `
        <h3>Primeira Leitura</h3><p>$${dados.primeira}</p>
        <h3>Salmo</h3><p>$${dados.salmo}</p>
        <h3>Evangelho</h3><p>${dados.evangelho}</p>
      `;
      return;
    }
  } catch (e) {
    console.error("Erro JSON local:", e);
  }

  // Se nada der certo
  document.getElementById("liturgia-completa").innerHTML = fallback;
});

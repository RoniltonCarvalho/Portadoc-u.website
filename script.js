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
    const rssUrl = "https://api.allorigins.win/raw?url=" +
      encodeURIComponent("https://www.evangelizo.org/rss/evangelho.xml");

    const resposta = await fetch(rssUrl);
    if (!resposta.ok) throw new Error("RSS não disponível");

    const xmlText = await resposta.text();
    const parser = new DOMParser();
    const xml = parser.parseFromString(xmlText, "application/xml");

    const item = xml.querySelector("item");
    if (item) {
      const titulo = item.querySelector("title")?.textContent || "";
      const descricao = item.querySelector("description")?.textContent || "";

      // Inicial da primeira leitura
      document.getElementById("resumo1").innerText = titulo || "Leitura...";
      // Colocamos o Salmo e Evangelho conforme disponíveis
      document.getElementById("resumoSalmo").innerText = "O Senhor é meu pastor...";
      document.getElementById("resumo2").innerText = "Leitura da segunda carta...";
      document.getElementById("resumoEvan").innerHTML = descricao || "Evangelho de...";
      return;
    }
  } catch (e) {
    console.error("Erro:", e);
  }

  document.getElementById("resumo1").innerHTML = fallback;
  document.getElementById("resumoSalmo").innerHTML = "";
  document.getElementById("resumo2").innerHTML = "";
  document.getElementById("resumoEvan").innerHTML = "";
});

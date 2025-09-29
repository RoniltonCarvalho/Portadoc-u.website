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
    ⚠️ Não foi possível carregar as leituras de hoje.<br>
    Acesse diretamente em: <a href="https://evangelizo.org" target="_blank">Evangelizo.org</a>
  `;

  try {
    // RSS Evangelho do Evangelizo.org (mais estável)
    const rssUrl = "https://www.evangelizo.org/rss/evangelho.xml";

    // Força abrir o RSS como texto
    const resposta = await fetch(rssUrl, { cache: "no-store" });
    if (!resposta.ok) throw new Error("Falha ao buscar RSS");

    const xmlText = await resposta.text();
    const parser = new DOMParser();
    const xml = parser.parseFromString(xmlText, "application/xml");

    const item = xml.querySelector("item");
    if (item) {
      const titulo = item.querySelector("title")?.textContent || "Liturgia do Dia";
      const descricao = item.querySelector("description")?.textContent || "";

      // Atualiza resumo no banner
      document.getElementById("resumo1").innerText = titulo;
      document.getElementById("resumoSalmo").innerText = "Salmo: veja abaixo";
      document.getElementById("resumoEvan").innerText = "Evangelho: veja abaixo";

      // Mostra conteúdo completo
      document.getElementById("liturgia-completa").innerHTML = descricao;
      return;
    }
  } catch (e) {
    console.error("Erro ao carregar liturgia:", e);
  }

  // Se falhar, mostra mensagem padrão
  document.getElementById("liturgia-completa").innerHTML = fallback;
});

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
    // Chama a API no próprio projeto Vercel
    const resposta = await fetch("/api/liturgia");
    if (!resposta.ok) throw new Error("Erro no servidor");

    const xmlText = await resposta.text();
    const parser = new DOMParser();
    const xml = parser.parseFromString(xmlText, "application/xml");

    const item = xml.querySelector("item");
    if (item) {
      const titulo = item.querySelector("title")?.textContent || "Liturgia do Dia";
      const descricao = item.querySelector("description")?.textContent || "";

      document.getElementById("resumo1").innerText = titulo;
      document.getElementById("resumoSalmo").innerText = "Salmo: veja abaixo";
      document.getElementById("resumoEvan").innerText = "Evangelho: veja abaixo";
      document.getElementById("liturgia-completa").innerHTML = descricao;
      return;
    }
  } catch (e) {
    console.error("Erro ao carregar liturgia:", e);
  }

  document.getElementById("liturgia-completa").innerHTML = fallback;
});

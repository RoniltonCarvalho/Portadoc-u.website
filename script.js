document.addEventListener("DOMContentLoaded", async function () {
  const hoje = new Date();
  const dataFormatada = hoje.toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
  });
  document.getElementById("dataLiturgia").innerText = dataFormatada;

  // Texto padrão de segurança (fallback)
  const fallback = {
    resumo: "Leituras de hoje não disponíveis no momento.",
    primeira: "Primeira Leitura: (adicione manualmente se necessário)",
    salmo: "Salmo Responsorial: (adicione manualmente se necessário)",
    segunda: "Segunda Leitura: (adicione se houver)",
    evangelho: "Evangelho: (adicione manualmente se necessário)"
  };

  try {
    const rssUrl = "https://liturgia.cancaonova.com/pb/feed/";
    // usamos /raw para obter somente o XML direto
    const proxyUrl = "https://api.allorigins.win/raw?url=" + encodeURIComponent(rssUrl);

    const resposta = await fetch(proxyUrl);
    const xmlText = await resposta.text();

    const parser = new DOMParser();
    const xml = parser.parseFromString(xmlText, "application/xml");
    const items = xml.querySelectorAll("item");

    if (items.length > 0) {
      const titulo = items[0].querySelector("title")?.textContent || fallback.resumo;
      const corpoHtml = items[0].querySelector("description")?.textContent || "";

      // Resumo no topo
      document.getElementById("resumo1").innerText = titulo;
      document.getElementById("resumoSalmo").innerText = "Salmo: veja abaixo";
      document.getElementById("resumoEvan").innerText = "Evangelho: veja abaixo";

      // Liturgia completa
      document.getElementById("liturgia-completa").innerHTML = corpoHtml || fallback.primeira;
      return;
    }
  } catch (error) {
    console.error("Erro ao carregar a liturgia:", error);
  }

  // Se der erro, mostra o fallback
  document.getElementById("resumo1").innerText = fallback.resumo;
  document.getElementById("resumoSalmo").innerText = fallback.salmo;
  document.getElementById("resumoEvan").innerText = fallback.evangelho;
  document.getElementById("liturgia-completa").innerHTML =
    `<h3>$${fallback.primeira}</h3><p>$${fallback.salmo}</p><p>$${fallback.segunda}</p><p>$${fallback.evangelho}</p>`;
});

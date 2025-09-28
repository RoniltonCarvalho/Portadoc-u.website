document.addEventListener("DOMContentLoaded", async function () {
  const hoje = new Date();
  const dataFormatada = hoje.toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
  });
  document.getElementById("dataLiturgia").innerText = dataFormatada;

  // Plano B: liturgia manual (sempre aparece se automático falhar)
  const fallback = {
    resumo: "Leituras de hoje não disponíveis online.",
    primeira: "Primeira Leitura: (adicione aqui caso necessário)",
    salmo: "Salmo Responsorial: (adicione aqui manualmente)",
    segunda: "Segunda Leitura: (adicione se houver)",
    evangelho: "Evangelho: (adicione aqui)"
  };

  try {
    const rssUrl = "https://liturgia.cancaonova.com/pb/feed/";
    const proxyUrl = "https://api.allorigins.win/raw?url=" + encodeURIComponent(rssUrl);

    const resposta = await fetch(proxyUrl);
    const xmlText = await resposta.text();

    const parser = new DOMParser();
    const xml = parser.parseFromString(xmlText, "application/xml");
    const items = xml.querySelectorAll("item");

    if (items.length > 0) {
      const titulo = items[0].querySelector("title")?.textContent || fallback.resumo;
      const corpoHtml = items[0].querySelector("description")?.textContent || "";

      // Resumo no banner
      document.getElementById("resumo1").innerText = titulo;
      document.getElementById("resumoSalmo").innerText = "Salmo: veja abaixo";
      document.getElementById("resumoEvan").innerText = "Evangelho: veja abaixo";

      // Exibe conteúdo completo
      document.getElementById("liturgia-completa").innerHTML = corpoHtml || fallback.primeira;
      return;
    }
  } catch (error) {
    console.error("Erro ao carregar liturgia:", error);
  }

  // Se der erro → mostra fallback manual
  document.getElementById("resumo1").innerText = fallback.resumo;
  document.getElementById("resumoSalmo").innerText = fallback.salmo;
  document.getElementById("resumoEvan").innerText = fallback.evangelho;
  document.getElementById("liturgia-completa").innerHTML =
    `<h3>$${fallback.primeira}</h3><p>$${fallback.salmo}</p><p>$${fallback.segunda}</p><p>$${fallback.evangelho}</p>`;
});

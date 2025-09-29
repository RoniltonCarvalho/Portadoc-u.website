document.addEventListener("DOMContentLoaded", async function () {
  const hoje = new Date();
  const dataFormatada = hoje.toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  document.getElementById("dataLiturgia").innerText = dataFormatada;

  // Texto de fallback
  const fallback = {
    resumo: "⚠️ Leituras de hoje não disponíveis no momento.",
    primeira: "Primeira Leitura: consulte diretamente no site da CNBB ou Canção Nova.",
    salmo: "Salmo: consulte diretamente.",
    segunda: "Segunda Leitura (se houver).",
    evangelho: "Evangelho: consulte diretamente.",
  };

  try {
    // URL do feed
    const rssUrl = "https://liturgia.cancaonova.com/pb/feed/";

    // Usar proxy para evitar problema de CORS
    const proxyUrl = "https://api.allorigins.win/get?url=" + encodeURIComponent(rssUrl);

    const resposta = await fetch(proxyUrl);
    if (!resposta.ok) throw new Error("Erro ao buscar o feed");

    const data = await resposta.json();
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(data.contents, "text/xml");

    const items = xmlDoc.querySelectorAll("item");

    if (items.length > 0) {
      const titulo = items[0].querySelector("title")?.textContent || fallback.resumo;
      const descricao = items[0].querySelector("description")?.textContent || "";

      // Coloca resumo no topo
      document.getElementById("resumo1").innerText = titulo;
      document.getElementById("resumoSalmo").innerText = descricao.includes("Salmo") ? descricao : fallback.salmo;
      document.getElementById("resumoEvan").innerText = descricao.includes("Evangelho") ? descricao : fallback.evangelho;

      // Conteúdo completo
      document.getElementById("liturgia-completa").innerHTML = descricao || fallback.primeira;
    } else {
      throw new Error("Nenhum item encontrado no feed");
    }
  } catch (erro) {
    console.error("Erro ao carregar liturgia:", erro);

    // Se erro → mostrar fallback
    document.getElementById("resumo1").innerText = fallback.resumo;
    document.getElementById("resumoSalmo").innerText = fallback.salmo;
    document.getElementById("resumoEvan").innerText = fallback.evangelho;
    document.getElementById("liturgia-completa").innerHTML = `
      <h3>$${fallback.primeira}</h3>
      <p>$${fallback.salmo}</p>
      <p>$${fallback.segunda}</p>
      <p>$${fallback.evangelho}</p>
      <p>Acesse diretamente: 
        <a href="https://liturgia.cancaonova.com/pb/" target="_blank">Canção Nova</a>
      </p>`;
  }
});

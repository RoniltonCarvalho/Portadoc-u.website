document.addEventListener("DOMContentLoaded", async () => {
  const hoje = new Date();
  const dataIso = hoje.toISOString().split("T")[0]; // YYYY-MM-DD

  // Mostrar data formatada no topo
  const dataFormatada = hoje.toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  document.getElementById("dataLiturgia").innerText = dataFormatada;

  // Fallback
  const fallback = {
    primeira: "⚠️ Primeira Leitura não disponível.",
    salmo: "⚠️ Salmo não disponível.",
    segunda: "Segunda Leitura (se houver).",
    evangelho: "⚠️ Evangelho não disponível.",
  };

  try {
    // Evangelizo API via corsproxy.io
    const apiUrl = `https://api.evangelizo.org/v2/reading/day?date=$${dataIso}&lang=PT`;
    const proxyUrl = "https://corsproxy.io/?" + encodeURIComponent(apiUrl);

    const resposta = await fetch(proxyUrl);
    if (!resposta.ok) throw new Error("Erro ao buscar leituras");
    const data = await resposta.json();

    // Leituras
    const primeira = data?.readings?.find(r => r.type === "reading_1")?.text || fallback.primeira;
    const salmo = data?.readings?.find(r => r.type === "psalm")?.text || fallback.salmo;
    const segunda = data?.readings?.find(r => r.type === "reading_2")?.text || "";
    const evangelho = data?.readings?.find(r => r.type === "gospel")?.text || fallback.evangelho;

    // Resumo (parte de cima)
    document.getElementById("resumo1").innerText = primeira;
    document.getElementById("resumoSalmo").innerText = salmo;
    document.getElementById("resumoEvan").innerText = evangelho;

    // Liturgia completa
    document.getElementById("liturgia-completa").innerHTML = `
      <h3>Primeira Leitura</h3><p>$${primeira}</p>
      $${segunda ? `<h3>Segunda Leitura</h3><p>$${segunda}</p>` : ""}
      <h3>Salmo</h3><p>$${salmo}</p>
      <h3>Evangelho</h3><p>$${evangelho}</p>
    `;
  } catch (erro) {
    console.error("Erro ao carregar leituras:", erro);
    document.getElementById("liturgia-completa").innerHTML = `
      <p>⚠️ Não foi possível carregar as leituras de hoje.<br>
      Acesse diretamente em:
      <a href="https://www.evangelizo.org/" target="_blank">Evangelizo.org</a></p>
    `;
  }
});

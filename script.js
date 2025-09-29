document.addEventListener("DOMContentLoaded", async () => {
  const hoje = new Date();
  const dataIso = hoje.toISOString().split("T")[0]; // YYYY-MM-DD

  // Mostrar data no topo
  const dataFormatada = hoje.toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  document.getElementById("dataLiturgia").innerText = dataFormatada;

  // Fallback padrão
  const fallback = {
    primeira: "⚠️ Primeira Leitura não disponível.",
    salmo: "⚠️ Salmo não disponível.",
    segunda: "Segunda Leitura (se houver).",
    evangelho: "⚠️ Evangelho não disponível.",
  };

  try {
    // URL da API do Evangelizo
    const apiUrl = `https://api.evangelizo.org/v2/reading/day?date=$${dataIso}&lang=PT`;
    const proxyUrl = `https://api.allorigins.win/get?url=$${encodeURIComponent(apiUrl)}`;

    // Buscar via proxy para evitar CORS
    const resposta = await fetch(proxyUrl);
    if (!resposta.ok) throw new Error("Erro no proxy");

    const resultado = await resposta.json();
    const data = JSON.parse(resultado.contents);

    // Buscar as leituras
    const primeira = data?.readings?.find(r => r.type === "reading_1")?.text || fallback.primeira;
    const salmo = data?.readings?.find(r => r.type === "psalm")?.text || fallback.salmo;
    const segunda = data?.readings?.find(r => r.type === "reading_2")?.text || "";
    const evangelho = data?.readings?.find(r => r.type === "gospel")?.text || fallback.evangelho;

    // Preencher no resumo
    document.getElementById("resumo1").innerText = primeira;
    document.getElementById("resumoSalmo").innerText = salmo;
    document.getElementById("resumoEvan").innerText = evangelho;

    // Preencher na seção completa
    document.getElementById("liturgia-completa").innerHTML = `
      <h3>Primeira Leitura</h3><p>$${primeira}</p>
      $${segunda ? `<h3>Segunda Leitura</h3><p>$${segunda}</p>` : ""}
      <h3>Salmo</h3><p>$${salmo}</p>
      <h3>Evangelho</h3><p>${evangelho}</p>
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

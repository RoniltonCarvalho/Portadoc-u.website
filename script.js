document.addEventListener("DOMContentLoaded", async () => {
  const hoje = new Date();
  const dataIso = hoje.toISOString().split("T")[0]; // Formato YYYY-MM-DD

  // Mostrar a data atual formatada
  const dataFormatada = hoje.toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  document.getElementById("dataLiturgia").innerText = dataFormatada;

  try {
    // 🔗 API Evangelizo - retorna leituras completas por data
    const url = `https://api.evangelizo.org/v2/reading/day?date=$${dataIso}&lang=PT`;
    const resposta = await fetch(url);

    if (!resposta.ok) throw new Error("Erro ao buscar leituras");

    const data = await resposta.json();

    // Leituras específicas
    const primeira = data?.readings?.find(r => r.type === "reading_1")?.text || "Primeira leitura não disponível.";
    const salmo = data?.readings?.find(r => r.type === "psalm")?.text || "Salmo não disponível.";
    const segunda = data?.readings?.find(r => r.type === "reading_2")?.text || ""; // só aparece em domingos e festas
    const evangelho = data?.readings?.find(r => r.type === "gospel")?.text || "Evangelho não disponível.";

    // Preencher no resumo (parte de cima do site)
    document.getElementById("resumo1").innerText = primeira;
    document.getElementById("resumoSalmo").innerText = salmo;
    document.getElementById("resumoEvan").innerText = evangelho;

    // Conteúdo completo da liturgia (parte inferior do site)
    document.getElementById("liturgia-completa").innerHTML = `
      <h3>Primeira Leitura</h3><p>$${primeira}</p>
      $${segunda ? `<h3>Segunda Leitura</h3><p>$${segunda}</p>` : ""}
      <h3>Salmo</h3><p>$${salmo}</p>
      <h3>Evangelho</h3><p>$${evangelho}</p>
    `;
  } catch (erro) {
    console.error("Erro ao carregar leiturgia:", erro);

    // fallback amigável
    document.getElementById("liturgia-completa").innerHTML = `
      <p>⚠️ Não foi possível carregar as leituras de hoje. 
      Acesse diretamente: <a href="https://www.evangelizo.org/" target="_blank">Evangelizo.org</a></p>
    `;
  }
});

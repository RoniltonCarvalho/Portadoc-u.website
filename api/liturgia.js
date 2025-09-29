export default async function handler(req, res) {
  try {
    const rssUrl = "https://www.evangelizo.org/rss/evangelho.xml";
    const resposta = await fetch(rssUrl);

    if (!resposta.ok) {
      throw new Error("Erro ao buscar RSS");
    }

    const texto = await resposta.text();

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Content-Type", "application/xml; charset=utf-8");
    res.status(200).send(texto);
  } catch (err) {
    console.error("Erro na API:", err);
    res.status(500).json({ erro: "Falha ao carregar liturgia", detalhe: err.message });
  }
}

export default async function handler(req, res) {
  try {
    const targetUrl = "https://www.evangelizo.org/rss/evangelho.xml";
    const rssUrl = "https://api.allorigins.win/raw?url=" + encodeURIComponent(targetUrl);

    const resposta = await fetch(rssUrl);
    if (!resposta.ok) throw new Error("Erro no Proxy");

    const texto = await resposta.text();

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Content-Type", "application/xml; charset=utf-8");
    res.status(200).send(texto);
  } catch (err) {
    console.error("Erro na API:", err);
    res.status(500).json({ erro: "Falha ao carregar liturgia", detalhe: err.message });
  }
}

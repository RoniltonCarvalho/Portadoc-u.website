export default async function handler(req, res) {
  try {
    // URL Evangelizo (evangelho)
    const evangelizoUrl = "https://api.allorigins.win/raw?url=" + encodeURIComponent("https://www.evangelizo.org/rss/evangelho.xml");

    // URL A12 (fallback)
    const a12Url = "https://api.allorigins.win/raw?url=" + encodeURIComponent("https://www.a12.com/rss");

    // 1ª tentativa → Evangelizo
    let resposta = await fetch(evangelizoUrl);
    if (!resposta.ok) throw new Error("Evangelizo indisponível");
    let texto = await resposta.text();

    if (texto && texto.length > 50) {
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Content-Type", "application/xml; charset=utf-8");
      return res.status(200).send(texto);
    }

    // 2ª tentativa → A12
    resposta = await fetch(a12Url);
    if (!resposta.ok) throw new Error("A12 indisponível");
    texto = await resposta.text();

    if (texto && texto.length > 50) {
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Content-Type", "application/xml; charset=utf-8");
      return res.status(200).send(texto);
    }

    // 3ª tentativa → fallback fixo
    throw new Error("Nenhuma fonte disponível");
  } catch (err) {
    console.error("Erro final na API:", err);
    res.status(200).send(`
      <rss>
        <channel>
          <item>
            <title>Leituras não disponíveis no momento</title>
            <description>
              ⚠️ Acesse diretamente em: 
              <a href="https://www.evangelizo.org" target="_blank">Evangelizo.org</a>
              ou 
              <a href="https://www.a12.com" target="_blank">A12.com</a>
            </description>
          </item>
        </channel>
      </rss>
    `);
  }
}

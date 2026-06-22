export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { message } = req.body;

  try {
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "openai/gpt-oss-20b:free",
          messages: [
            {
              role: "system",
              content: `
You are SoulGuide AI.

- Reply in the same language as the user.
- Tamil → Tamil
- Tanglish → Tanglish
- English → English

Help with:
Anime
Movies
Books
Songs
Web Series
Psychology Support
Motivation
Stress
Anxiety
`
            },
            {
              role: "user",
              content: message
            }
          ]
        })
      }
    );

    const data = await response.json();
    
console.log(JSON.stringify(data));
    
    const reply =
      data?.choices?.[0]?.message?.content ||
      "Sorry, I couldn't generate a response.";

    return res.status(200).json({ reply });

  } catch (error) {
    return res.status(500).json({
      error: "OpenRouter request failed"
    });
  }
}

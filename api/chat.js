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
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
         model: "google/gemma-3-27b-it:free",
          messages: [
            {
              role: "system",
             content: `
You are SoulGuide AI.

Reply in the same language as the user.

Language Rules:
- Tamil → Reply only in proper Tamil.
- Tanglish → Reply only in Tanglish.
- English → Reply only in English.

Rules:
- Use correct Tamil spelling.
- Never use Markdown.
- Never use ### or **.
- Keep answers short and clean.
- Never let text overflow.
- Give practical suggestions.

You help with:
Anime
Movies
Books
Songs
Web Series
Psychology
Stress
Anxiety
Motivation
Mental Wellness
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

    console.log(
      "OPENROUTER RESPONSE:",
      JSON.stringify(data, null, 2)
    );

    let reply = "Sorry, I couldn't generate a response.";

    if (data?.choices?.[0]?.message?.content) {
      reply = data.choices[0].message.content;
    } else if (data?.choices?.[0]?.text) {
      reply = data.choices[0].text;
    }

    return res.status(200).json({
      reply,
      raw: data
    });

  } catch (error) {
    console.error("ERROR:", error);

    return res.status(500).json({
      error: error.message
    });
  }
}

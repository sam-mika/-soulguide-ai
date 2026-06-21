export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { message } = req.body;

  const prompt = `
You are SoulGuide AI.

Rules:
- Detect the user's language automatically.
- Reply in the SAME language used by the user.
- If Tamil → Tamil reply.
- If Tanglish → Tanglish reply.
- If Hindi → Hindi reply.
- If English → English reply.
- Anime names must remain original.
- Recommend Anime, Movies, Songs, Books, Web Series, YouTube videos, Poetry, Psychology support.
- If user mentions stress, anxiety, sadness, loneliness, heartbreak, study pressure, motivation, suggest suitable content.
- If user mentions self-harm or suicide, immediately provide emergency support numbers.

India Emergency:
112
Tele-MANAS: 14416
Women: 181
Childline: 1098

User message:
${message}
`;

  try {
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" +
        process.env.GEMINI_API_KEY,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
        }),
      }
    );

    const data = await response.json();
console.log("Gemini Response:", JSON.stringify(data, null, 2));
    const reply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Sorry, I couldn't generate a response.";

    return res.status(200).json({ reply });
  } catch (error) {
    return res.status(500).json({
      error: "Gemini request failed",
    });
  }
}

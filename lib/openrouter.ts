export const openRouterCall = async (prompt: string, jsonMode: boolean = true) => {
  const apiKey = process.env.OPENROUTER_API_KEY || "";
  
  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "HTTP-Referer": "https://hackathon-earth-os.vercel.app", // Optional
      "X-Title": "Earth OS", // Optional
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      "model": "openai/gpt-4o-mini",
      "messages": [
        { "role": "user", "content": prompt }
      ],
      "response_format": jsonMode ? { "type": "json_object" } : undefined
    })
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData?.error?.message || `OpenRouter Error: ${response.status}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
};

const OLLAMA_URL = "http://localhost:11434/api/generate";
const MODEL = "gpt-oss:20b-cloud";

export async function generateWithOllama(prompt: string): Promise<string> {
  const controller = new AbortController();

  const timeout = setTimeout(() => {
    controller.abort();
  }, 10 * 60 * 1000); // 10 minutes

  try {
    const response = await fetch(OLLAMA_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: MODEL,
        prompt,
        stream: false
      }),
      signal: controller.signal
    });

    if (!response.ok) {
      throw new Error(
        `Ollama request failed: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();

    return data.response;
  } finally {
    clearTimeout(timeout);
  }
}
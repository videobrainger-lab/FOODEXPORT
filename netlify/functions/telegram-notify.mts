export default async (req: Request) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const token = Netlify.env.get("TELEGRAM_BOT_TOKEN");
  const chatId = Netlify.env.get("TELEGRAM_CHAT_ID");

  if (!token || !chatId) {
    console.error("Telegram environment variables are not configured");
    return new Response("Telegram is not configured", { status: 500 });
  }

  let data: Record<string, string>;
  try {
    data = await req.json();
  } catch {
    return new Response("Invalid request", { status: 400 });
  }

  if (data["bot-field"]) {
    return new Response("OK", { status: 200 });
  }

  const clean = (value?: string) => (value || "—").trim().slice(0, 1500);

  const text = [
    "🔔 NEW INQUIRY — FOODEXPORTSPRO",
    "",
    `Name: ${clean(data.name)}`,
    `Email: ${clean(data.email)}`,
    `Company: ${clean(data.company)}`,
    `Country: ${clean(data.country)}`,
    `Product / Category: ${clean(data.product)}`,
    "",
    "Message:",
    clean(data.message),
  ].join("\n");

  const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      disable_web_page_preview: true,
    }),
  });

  if (!response.ok) {
    console.error("Telegram API error", response.status, await response.text());
    return new Response("Telegram delivery failed", { status: 502 });
  }

  return new Response("OK", { status: 200 });
};

export const config = {
  path: "/telegram-notify",
};

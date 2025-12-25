// =======================
// Telegram API
// =======================
async function sendMessage(token, chatId, text) {
  await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: "Markdown"
    })
  });
}

// =======================
// Worker Entry
// =======================
export default {
  async fetch(req, env) {
    if (req.method !== "POST") {
      return new Response("OK");
    }

    let update;
    try {
      update = await req.json();
    } catch {
      return new Response("OK");
    }

    const message = update.message;
    if (!message) {
      return new Response("OK");
    }

    const chatId = message.chat?.id;
    if (!chatId) {
      return new Response("OK");
    }

    // Format the entire message object as JSON and wrap in code block
    const formattedMessage = "```json\n" + JSON.stringify(message, null, 2) + "\n```";

    try {
      await sendMessage(env.BOT_TOKEN, chatId, formattedMessage);
    } catch (err) {
      console.error("Failed to send message:", err);
    }

    return new Response("OK");
  }
};
```
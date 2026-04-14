// Send alert when rate limit is hit
export async function sendRateLimitAlert(userId: string, ip: string, identifier: string) {
  const message = `🚨 RATE LIMIT na Revivio!\n\nUporabnik: ${userId}\nIP: ${ip}\nIdentifier: ${identifier}\nČas: ${new Date().toLocaleString("sl-SI")}`;

  // Log to Vercel console
  console.error(message);

  // Send push notification via ntfy.sh (free, no signup)
  try {
    await fetch("https://ntfy.sh/revivio-alerts-d4l1b0r", {
      method: "POST",
      headers: {
        Title: "Revivio: Rate Limit Alert",
        Priority: "high",
        Tags: "warning",
      },
      body: message,
    });
  } catch {
    // Silent fail — alert is already logged
  }
}

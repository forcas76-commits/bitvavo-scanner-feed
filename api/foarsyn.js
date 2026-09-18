// FOARSYN server-rendered feed
export default async function handler(req, res) {
  try {
    const cacheBuster = Date.now();

    const response = await fetch(
      `https://raw.githubusercontent.com/forcas76-commits/bitvavo-scanner-feed/main/chatgpt_feed.json?t=${cacheBuster}`,
      {
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache"
        }
      }
    );

    if (!response.ok) {
      throw new Error(`GitHub returned ${response.status}`);
    }

    const data = await response.json();

    const html = `
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>FOARSYN Scanner Feed</title>
</head>
<body>
  <h1>FOARSYN Scanner Feed</h1>

  <p>scanner: ${data.scanner ?? ""}</p>
  <p>feed_version: ${data.feed_version ?? ""}</p>
  <p>feed_created: ${data.feed_created ?? ""}</p>
  <p>latest_scan: ${data.latest_scan ?? ""}</p>
  <p>cash_eur: ${data.cash_eur ?? ""}</p>

  <h2>Full current scanner feed</h2>
  <pre>${escapeHtml(JSON.stringify(data, null, 2))}</pre>
</body>
</html>
    `;

    res.setHeader(
      "Cache-Control",
      "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0"
    );
    res.setHeader("CDN-Cache-Control", "no-store");
    res.setHeader("Vercel-CDN-Cache-Control", "no-store");
    res.setHeader("Content-Type", "text/html; charset=utf-8");

    return res.status(200).send(html);

  } catch (error) {
    return res.status(500).send(
      `<html><body><h1>FOARSYN feed unavailable</h1><p>${escapeHtml(error.message)}</p></body></html>`
    );
  }
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

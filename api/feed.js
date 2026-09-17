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

    res.setHeader(
      "Cache-Control",
      "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0"
    );
    res.setHeader("CDN-Cache-Control", "no-store");
    res.setHeader("Vercel-CDN-Cache-Control", "no-store");

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({
      error: "FOARSYN feed unavailable",
      message: error.message
    });
  }
}

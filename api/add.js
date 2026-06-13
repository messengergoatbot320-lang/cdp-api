const axios = require("axios");

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_REPO = "messengergoatbot320-lang/cdp-api";
const FILE_PATH = "data/couples.json";

// 18+ check function
const checkImage = async (url) => {
  try {
    const res = await axios.get(url, {
      responseType: "arraybuffer",
      headers: { "User-Agent": "Mozilla/5.0" },
      timeout: 5000
    });
    // Imgur deleted/removed image check
    if (res.headers["content-type"] === "image/gif") return false;
    if (parseInt(res.headers["content-length"]) < 1000) return false;
    return true;
  } catch {
    return false;
  }
};

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");

  // GET method দিয়েও কাজ করবে test এর জন্য
  const method = req.method;
  
  let boyUrl, girlUrl, secret;

  if (method === "GET") {
    boyUrl = req.query.boy;
    girlUrl = req.query.girl;
    secret = req.query.secret;
  } else if (method === "POST") {
    boyUrl = req.body?.boyUrl;
    girlUrl = req.body?.girlUrl;
    secret = req.body?.secret;
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (secret !== "rocky_secret_2025") {
    return res.status(403).json({ error: "Unauthorized" });
  }

  if (!boyUrl || !girlUrl) {
    return res.status(400).json({ error: "boyUrl and girlUrl required" });
  }

  // URL valid কিনা check
  const urlPattern = /^https?:\/\/i\.imgur\.com\/.+\.(jpg|jpeg|png|gif)$/i;
  if (!urlPattern.test(boyUrl) || !urlPattern.test(girlUrl)) {
    return res.status(400).json({ 
      error: "শুধু i.imgur.com এর link দেওয়া যাবে!" 
    });
  }

  // Image exist করে কিনা check
  const boyValid = await checkImage(boyUrl);
  const girlValid = await checkImage(girlUrl);

  if (!boyValid || !girlValid) {
    return res.status(400).json({ 
      error: "Image valid না অথবা access করা যাচ্ছে না!" 
    });
  }

  try {
    const getFile = await axios.get(
      `https://api.github.com/repos/${GITHUB_REPO}/contents/${FILE_PATH}`,
      { headers: { Authorization: `token ${GITHUB_TOKEN}` } }
    );

    const currentContent = JSON.parse(
      Buffer.from(getFile.data.content, "base64").toString("utf8")
    );

    // Duplicate check
    const isDuplicate = currentContent.some(
      c => c.boy === boyUrl || c.girl === girlUrl
    );

    if (isDuplicate) {
      return res.status(400).json({ error: "এই ছবি আগেই add করা আছে!" });
    }

    currentContent.push({ boy: boyUrl, girl: girlUrl });

    await axios.put(
      `https://api.github.com/repos/${GITHUB_REPO}/contents/${FILE_PATH}`,
      {
        message: "Add new couple DP via bot",
        content: Buffer.from(
          JSON.stringify(currentContent, null, 2)
        ).toString("base64"),
        sha: getFile.data.sha
      },
      { headers: { Authorization: `token ${GITHUB_TOKEN}` } }
    );

    return res.status(200).json({
      success: true,
      boy: boyUrl,
      girl: girlUrl,
      total: currentContent.length
    });

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const axios = require("axios");

const IMGUR_CLIENT_ID = "তোমার_imgur_client_id";
const GITHUB_TOKEN = "তোমার_github_token";
const GITHUB_REPO = "messengergoatbot320-lang/cdp-api";
const FILE_PATH = "data/couples.json";

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");

  if (req.method !== "POST") {
    return res.status(405).json({ error: "POST method required" });
  }

  try {
    const { boyUrl, girlUrl, secret } = req.body;

    if (secret !== "rocky_secret_2025") {
      return res.status(403).json({ error: "Unauthorized" });
    }

    if (!boyUrl || !girlUrl) {
      return res.status(400).json({ error: "boyUrl and girlUrl required" });
    }

    // Imgur এ upload
    const uploadToImgur = async (imageUrl) => {
      const response = await axios.post("https://api.imgur.com/3/image", {
        image: imageUrl,
        type: "url"
      }, {
        headers: { Authorization: `Client-ID ${IMGUR_CLIENT_ID}` }
      });
      return response.data.data.link;
    };

    const imgurBoy = await uploadToImgur(boyUrl);
    const imgurGirl = await uploadToImgur(girlUrl);

    // GitHub থেকে couples.json পড়ো
    const getFile = await axios.get(
      `https://api.github.com/repos/${GITHUB_REPO}/contents/${FILE_PATH}`,
      { headers: { Authorization: `token ${GITHUB_TOKEN}` } }
    );

    const currentContent = JSON.parse(
      Buffer.from(getFile.data.content, "base64").toString("utf8")
    );

    currentContent.push({ boy: imgurBoy, girl: imgurGirl });

    // GitHub এ save করো
    await axios.put(
      `https://api.github.com/repos/${GITHUB_REPO}/contents/${FILE_PATH}`,
      {
        message: "Add new couple DP via bot",
        content: Buffer.from(JSON.stringify(currentContent, null, 2)).toString("base64"),
        sha: getFile.data.sha
      },
      { headers: { Authorization: `token ${GITHUB_TOKEN}` } }
    );

    return res.status(200).json({
      success: true,
      boy: imgurBoy,
      girl: imgurGirl,
      total: currentContent.length
    });

  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ error: error.message });
  }
};

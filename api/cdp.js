const axios = require("axios");

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_REPO = "messengergoatbot320-lang/cdp-api";
const FILE_PATH = "data/couples.json";

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  try {
    const getFile = await axios.get(
      `https://api.github.com/repos/${GITHUB_REPO}/contents/${FILE_PATH}`,
      { headers: { Authorization: `token ${GITHUB_TOKEN}` } }
    );
    const couples = JSON.parse(
      Buffer.from(getFile.data.content, "base64").toString("utf8")
    );
    if (!couples || couples.length === 0) {
      return res.status(404).json({ error: "No couples found" });
    }
    const random = couples[Math.floor(Math.random() * couples.length)];
    return res.status(200).json(random);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

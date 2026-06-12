const axios = require("axios");

// তোমার নিজের image list এখানে রাখো
const couples = [
  {
    boy: "https://i.imgur.com/14uLcSi.jpeg",
    girl: "https://i.imgur.com/7eKVQqW.jpeg"
  },
  {
    boy: "https://i.imgur.com/rg22DqL.jpeg",
    girl: "https://i.imgur.com/dCRdzhr.jpeg"
  },
  {
    boy: "https://i.imgur.com/qXIn00k.jpeg",
    girl: "https://i.imgur.com/JJ2Imdp.jpeg"
  }
  // আরো add করো
];

module.exports = (req, res) => {
  const { path } = req.query;

  if (req.url.includes("/list")) {
    return res.json({ total: couples.length });
  }

  const random = couples[Math.floor(Math.random() * couples.length)];
  return res.json(random);
};

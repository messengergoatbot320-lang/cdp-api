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
];

module.exports = (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  const random = couples[Math.floor(Math.random() * couples.length)];
  return res.status(200).json(random);
};

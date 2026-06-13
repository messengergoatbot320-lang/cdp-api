if (args[0] === "add") {
  const fullText = args.slice(1).join(" ");
  const urls = fullText.match(/https?:\/\/i\.imgur\.com\/[^\s\[\]<>\"]+/gi);

  if (!urls || urls.length < 2) {
    return message.reply(
      "⚠️ শুধু Imgur link দাও:\n.cdp add boy https://i.imgur.com/xxx.jpeg girl https://i.imgur.com/yyy.jpeg"
    );
  }

  const boyUrl = urls[0].trim();
  const girlUrl = urls[1].trim();

  await message.reply("⏳ Adding couple DP, please wait...");

  try {
    const addRes = await axios.post(`${baseURL}/api/add`, {
      boyUrl,
      girlUrl,
      secret: "rocky_secret_2025"
    });

    return message.reply(
      `✅ নতুন CDP add হয়েছে!\n\n` +
      `👦 Boy: ${addRes.data.boy}\n` +
      `👧 Girl: ${addRes.data.girl}\n` +
      `🎀 Total CDP: ${addRes.data.total}`
    );
  } catch (err) {
    const errMsg = err.response?.data?.error || err.message;
    return message.reply(`❌ ${errMsg}`);
  }
}

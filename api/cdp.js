if (args[0] === "add") {
  let boyUrl, girlUrl;

  const allArgs = args.slice(1).join(" ");
  
  const boyMatch = allArgs.match(/boy\s+(https?:\/\/\S+)/i);
  const girlMatch = allArgs.match(/girl\s+(https?:\/\/\S+)/i);

  if (boyMatch && girlMatch) {
    boyUrl = boyMatch[1].replace(/[\[\]]/g, "").trim();
    girlUrl = girlMatch[1].replace(/[\[\]]/g, "").trim();
  } else {
    const urls = allArgs.match(/https?:\/\/\S+/gi);
    if (urls && urls.length >= 2) {
      boyUrl = urls[0].replace(/[\[\]]/g, "").trim();
      girlUrl = urls[1].replace(/[\[\]]/g, "").trim();
    }
  }

  if (!boyUrl || !girlUrl) {
    return message.reply(
      "⚠️ সঠিকভাবে দাও:\n.cdp add boy [link] girl [link]"
    );
  }

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
    return message.reply(`❌ API Error: ${err.response?.data?.error || err.message}`);
  }
}

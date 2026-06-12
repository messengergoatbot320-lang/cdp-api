if (args[0] === "add") {
  let boyUrl, girlUrl;

  const boyIndex = args.indexOf("boy");
  const girlIndex = args.indexOf("girl");

  if (boyIndex !== -1 && girlIndex !== -1) {
    boyUrl = args[boyIndex + 1].replace(/[\[\]]/g, "").trim();
    girlUrl = args[girlIndex + 1].replace(/[\[\]]/g, "").trim();
  } else {
    boyUrl = args[1].replace(/[\[\]]/g, "").trim();
    girlUrl = args[2].replace(/[\[\]]/g, "").trim();
  }

  if (!boyUrl || !girlUrl) {
    return message.reply(
      "⚠️ সঠিকভাবে দাও:\n.cdp add boy [link] girl [link]"
    );
  }

  await message.reply("⏳ Adding couple DP, please wait...");

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
}

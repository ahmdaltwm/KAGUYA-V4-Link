class RestartCommand {
  name = "restart";
  author = "Arjhil Dacayanan";
  cooldowns = 0;
  description = "Restarts the bot with a countdown!";
  role = "owner";
  aliases = ["botrestart", "restartbot"];

  async execute({ api, event }) {
    try {
      await api.sendMessage("Are you sure you want to restart the bot? Type 'yes' to confirm.", event.threadID, (err, info) => {
        client.handler.reply.set(info.messageID, {
          name: "restart",
          author: event.senderID,
          type: "confirm",
        });
      });
    } catch (error) {
      console.error("🚫 Error:", error);
      return api.sendMessage("🤖 An error occurred while initiating the restart process.", event.threadID, event.messageID);
    }
  }

  async onReply({ api, event, reply }) {
    if (reply.type === "confirm") {
      if (event.body.toLowerCase() === 'yes') {
        let countdown = 3;
        const countdownMessageID = await api.sendMessage(`Restarting in ${countdown}...`, event.threadID, event.messageID);

        const countdownInterval = setInterval(async () => {
          countdown--;
          if (countdown > 0) {
            await api.editMessage(`Restarting in ${countdown}...`, event.threadID, countdownMessageID.messageID);
          } else {
            clearInterval(countdownInterval);
            await api.editMessage(`Kaguya restarting...`, event.threadID, countdownMessageID.messageID);

            console.log('Bot is restarting...');
            process.exit();
          }
        }, 1000);
      } else {
        return api.sendMessage("Restart aborted.", event.threadID, event.messageID);
      }
    }
  }
}

export default new RestartCommand();

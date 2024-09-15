import axios from 'axios';
import request from 'request';

class MenuCommand {
  constructor() {
    this.name = "menu";
    this.author = "Arjhil Dacayanan";
    this.cooldowns = 10;
    this.description = "View all bot commands!";
    this.role = "member";
    this.aliases = [];
    this.commands = global.client.commands;
  }

  roleText = (role) => ({ member: "User", Admin: "Group Admin", owner: "Bot Owner" }[role] || "Unknown");

  aliasesText = (aliases) => (Array.isArray(aliases) && aliases.length > 0 && !aliases.includes("") ? aliases.join(", ") : "None");

  async execute({ event, api }) {
    const commandList = Array.from(this.commands.values());

    let msg = "📜 Full Command List 📜\n━━━━━━━━━━━━━━━\n";
    commandList.forEach((command, index) => {
      msg += `\n[${index + 1}] → ${command.name}`;
    });

    msg += `\n━━━━━━━━━━━━━━━\nTotal Commands: ${commandList.length}`;
    msg += `\n\nReply with the number of the command to see more details.`;

    const gifUrls = [
      "https://i.postimg.cc/d0FRGMWW/7cb0f6a884078a4bacf5b42b8bd6eb16.gif",
      "https://i.postimg.cc/GpkCSDxL/e39c5d4994e9835270e80e78ca7d7e95.gif",
      "https://i.postimg.cc/Kj3QJPtQ/98025eea0cffc301c68ca9366c7cea25.gif",
    ];
    const randomGifUrl = gifUrls[Math.floor(Math.random() * gifUrls.length)];

    const callback = (stream) => {
      api.sendMessage(
        {
          body: msg,
          attachment: stream,
        },
        event.threadID,
        (err, info) => {
          if (err) console.error(err);
          global.client.handler.reply.set(info.messageID, {
            name: this.name,
            author: event.senderID,
            commands: commandList,
          });
        }
      );
    };

    request(randomGifUrl)
      .on('response', (res) => {
        if (res.statusCode === 200) {
          callback(res);
        } else {
          api.sendMessage("❌ Failed to load the image.", event.threadID);
        }
      });
  }

  async onReply({ reply, event, api }) {
    if (reply.author !== event.senderID) return;

    const commandIndex = parseInt(event.body);
    if (isNaN(commandIndex) || commandIndex < 1 || commandIndex > reply.commands.length) {
      return api.sendMessage("❌ Invalid number! Please try again.", event.threadID, event.messageID);
    }

    const getCommand = reply.commands[commandIndex - 1];

    const replyMsg = `
[ ${getCommand.name.toUpperCase()} ]
━━━━━━━━━━━━━━━
→ Name: ${getCommand.name}
→ Author: ${getCommand.author}
→ Cooldown: ${getCommand.cooldowns}s
→ Description: ${getCommand.description}
→ Permissions: ${this.roleText(getCommand.role)}
→ Aliases: ${this.aliasesText(getCommand.aliases)}
━━━━━━━━━━━━━━━
`;

    const gifUrls = [
      "https://i.postimg.cc/d0FRGMWW/7cb0f6a884078a4bacf5b42b8bd6eb16.gif",
      "https://i.postimg.cc/GpkCSDxL/e39c5d4994e9835270e80e78ca7d7e95.gif",
      "https://i.postimg.cc/Kj3QJPtQ/98025eea0cffc301c68ca9366c7cea25.gif",
    ];
    const randomGifUrl = gifUrls[Math.floor(Math.random() * gifUrls.length)];

    const callback = (stream) => {
      api.sendMessage(
        {
          body: replyMsg,
          attachment: stream,
        },
        event.threadID,
        event.messageID
      );
    };

    request(randomGifUrl)
      .on('response', (res) => {
        if (res.statusCode === 200) {
          callback(res);
        } else {
          api.sendMessage("❌ Failed to load the image.", event.threadID);
        }
      });
  }
}

export default new MenuCommand();

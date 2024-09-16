import axios from 'axios';
import request from 'request';

class Help {
  constructor() {
    this.name = "help";
    this.author = "Arjhil Dacayanan";
    this.cooldowns = 10;
    this.description = "View the bot's command list!";
    this.role = "member";
    this.aliases = [];
    this.commands = global.client.commands;
  }

  roleText = (role) => ({ member: "User", Admin: "Group Admin", owner: "Bot Owner" }[role] || "Unknown");

  aliasesText = (aliases) => (Array.isArray(aliases) && aliases.length > 0 && !aliases.includes("") ? aliases.join(", ") : "None");

  async execute({ args, event }) {
    const [pageStr] = args;
    const getCommands = this.commands.get(pageStr);

    if (!getCommands) {
      const page = parseInt(pageStr) || 1;
      const commandsPerPage = 10;
      const startIndex = (page - 1) * commandsPerPage;
      const endIndex = page * commandsPerPage;

      if (!isNaN(page) && page > 0) {
        const commandList = Array.from(this.commands.values());
        const totalPages = Math.ceil(commandList.length / commandsPerPage);

        if (page <= totalPages) {
          const commandsToDisplay = commandList.slice(startIndex, endIndex);

          let msg = `╔═══════════╗\n               𝐏𝐑𝐎𝐉𝐄𝐂𝐓 𝐊𝐀𝐆𝐔𝐘𝐀\n╚═══════════╝\n\n`;

          commandsToDisplay.forEach((command, index) => {
            if (index % 10 === 0 && index > 0) {
              msg += `╰───────────◊\n\n`;
              msg += `╭─『 𝐊𝐀𝐆𝐔𝐘𝐀 𝐂𝐎𝐌𝐌𝐀𝐍𝐃 ${Math.ceil((startIndex + index) / 10)}』\n`;
            } else if (index === 0) {
              msg += `╭─『 𝐊𝐀𝐆𝐔𝐘𝐀 𝐂𝐎𝐌𝐌𝐀𝐍𝐃 ${Math.ceil((startIndex + index) / 10)}』\n`;
            }
            msg += `│✧${command.name}\n `;
          });

          msg += `\n╰───────────◊\n`;
          msg += `🔍 To view detailed help for a command, reply to this message with the command's name.`;
          msg += `\n🔄 Usage: ${global.client.config.prefix}${this.name} <page> to navigate to the next page!`;

          const gifUrls = [
            "https://i.postimg.cc/qMB8T1GK/f69d562f60418662c0564e3ad345fa17.gif",
            "https://i.postimg.cc/0NBVWjTL/1043fbbcbe1683faecb17e46d6d0b0fb.gif",
            "https://i.postimg.cc/W3qXQjjt/aa29c87da305509a8a4aa38ad45fe508.gif",
          ];
          const randomGifUrl = gifUrls[Math.floor(Math.random() * gifUrls.length)];

          const callback = (stream) => {
            kaguya.reply(
              {
                body: msg,
                attachment: stream,
              },
              (err, info) => {
                client.handler.reply.set(info.messageID, {
                  name: this.name,
                  type: "info",
                  author: event.senderID,
                  commands: commandList,
                });
                setTimeout(() => kaguya.unsend(info.messageID), 50000);
              }
            );
          };

          request(randomGifUrl)
            .on('response', (res) => {
              if (res.statusCode === 200) {
                callback(res);
              } else {
                kaguya.reply("❌ Failed to load the image.");
              }
            });

        } else {
          kaguya.reply("❌ There are no commands to display.");
        }
      }
    } else {
      const replyMsg = `
╭─『 ${getCommands.name.toUpperCase()} 』
│✧Name: ${getCommands.name}
│✧Author: ${getCommands.author}
│✧Cooldown: ${getCommands.cooldowns}s
│✧Description: ${getCommands.description}
│✧Aliases: ${this.aliasesText(getCommands.aliases)}
╰───────────◊
`;
      kaguya.reply(replyMsg);
    }
  }

  async onReply({ reply, event }) {
    if (reply.author !== event.senderID) return;
    const commandName = event.body.toLowerCase();
    const getCommands = reply.commands.find(cmd => cmd.name.toLowerCase() === commandName);

    if (!getCommands) {
      return kaguya.reply("❌ The command name you replied with is invalid! Please try again.");
    }

    const replyMsg = `
╭─『 ${getCommands.name.toUpperCase()} 』
│✧Name: ${getCommands.name}
│✧Author: ${getCommands.author}
│✧Cooldown: ${getCommands.cooldowns}s
│✧Description: ${getCommands.description}
│✧Aliases: ${this.aliasesText(getCommands.aliases)}
╰───────────◊
`;

    const gifUrls = [
      "https://i.postimg.cc/qMB8T1GK/f69d562f60418662c0564e3ad345fa17.gif",
      "https://i.postimg.cc/0NBVWjTL/1043fbbcbe1683faecb17e46d6d0b0fb.gif",
      "https://i.postimg.cc/W3qXQjjt/aa29c87da305509a8a4aa38ad45fe508.gif",
    ];
    const randomGifUrl = gifUrls[Math.floor(Math.random() * gifUrls.length)];

    const callback = (stream) => {
      kaguya.reply(
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
          kaguya.reply("❌ Failed to load the image.");
        }
      });
  }
}

export default new Help();

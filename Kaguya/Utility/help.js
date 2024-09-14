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

          let msg = `📜 Command List (Page ${page}/${totalPages}) 📜\n━━━━━━━━━━━━━━━\n`;

          commandsToDisplay.forEach((command, index) => {
            msg += `\n[${startIndex + index + 1}] → Name: ${command.name}\n→ Permissions: ${this.roleText(command.role)}\n→ Aliases: ${this.aliasesText(command.aliases)}\n━━━━━━━━━━━━━━━`;
          });

          msg += `\n\n🔍 To view detailed help for a command, reply to this message with the command's number.`;
          msg += `\n🔄 Usage: ${global.client.config.prefix}${this.name} <page> to navigate to the next page!`;

          kaguya.reply(msg, (err, info) => {
            client.handler.reply.set(info.messageID, {
              name: this.name,
              type: "info",
              author: event.senderID,
              commands: commandList,
            });
            setTimeout(() => kaguya.unsend(info.messageID), 50000);
          });
        } else {
          kaguya.reply("❌ There are no commands to display.");
        }
      }
    } else {
      const replyMsg = `
[ ${getCommands.name.toUpperCase()} ]
━━━━━━━━━━━━━━━
→ Name: ${getCommands.name}
→ Author: ${getCommands.author}
→ Cooldown: ${getCommands.cooldowns}s
→ Description: ${getCommands.description}
→ Permissions: ${this.roleText(getCommands.role)}
→ Aliases: ${this.aliasesText(getCommands.aliases)}
━━━━━━━━━━━━━━━
`;
      kaguya.reply(replyMsg);
    }
  }

  async onReply({ reply, event }) {
    if (reply.author !== event.senderID) return;
    if (event.body > reply.commands.length || !parseInt(event.body)) {
      return kaguya.reply("❌ The number you replied with is invalid! Please try again.");
    }
    const getCommands = reply.commands[event.body - 1];

    const replyMsg = `
[ ${getCommands.name.toUpperCase()} ]
━━━━━━━━━━━━━━━
→ Name: ${getCommands.name}
→ Author: ${getCommands.author}
→ Cooldown: ${getCommands.cooldowns}s
→ Description: ${getCommands.description}
→ Permissions: ${this.roleText(getCommands.role)}
→ Aliases: ${this.aliasesText(getCommands.aliases)}
━━━━━━━━━━━━━━━
`;

    kaguya.reply(replyMsg);
  }
}

export default new Help();

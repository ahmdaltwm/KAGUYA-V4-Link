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

    api.sendMessage(msg, event.threadID, (err, info) => {
      global.client.handler.reply.set(info.messageID, {
        name: this.name,
        author: event.senderID,
        commands: commandList,
      });
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

    api.sendMessage(replyMsg, event.threadID, event.messageID);
  }
}

export default new MenuCommand();

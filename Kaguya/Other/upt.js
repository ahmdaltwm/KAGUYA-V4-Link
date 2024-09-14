import os from 'os';

class UptimeCommand {
  constructor() {
    this.name = "upt";
    this.version = "1.0.0";
    this.author = "Arjhil Dacayanan";
    this.cooldowns = 5;
    this.description = "Displays bot uptime and current date";
    this.role = "member";
    this.aliases = [];
  }

  async execute({ api, event }) {
    try {
      const uptimeInSeconds = os.uptime();
      const days = Math.floor(uptimeInSeconds / (24 * 60 * 60));
      const hours = Math.floor((uptimeInSeconds % (24 * 60 * 60)) / (60 * 60));
      const minutes = Math.floor((uptimeInSeconds % (60 * 60)) / 60);
      const seconds = Math.floor(uptimeInSeconds % 60);

      const currentDate = new Date().toLocaleString();

      const uptimeMessage = `
      🤖 Kaguya Uptime:
      ━━━━━━━━━━━━━━━━━━
      Days: ${days}
      Hours: ${hours}
      Minutes: ${minutes}
      Seconds: ${seconds}
      ━━━━━━━━━━━━━━━━━━
      Current Date: 
      ${currentDate}
      ━━━━━━━━━━━━━━━━━━
      `;

      return api.sendMessage(uptimeMessage, event.threadID, event.messageID);
    } catch (error) {
      console.error("Error fetching uptime:", error);
      return api.sendMessage("❌ An error occurred while fetching uptime.", event.threadID, event.messageID);
    }
  }
}

export default new UptimeCommand();

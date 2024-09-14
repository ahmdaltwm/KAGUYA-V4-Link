import axios from 'axios';

class ChatGPTCommand {
  name = 'chatgpt';
  version = '1.0.0';
  role = 0;
  hasPrefix = true;
  aliases = ['gpt'];
  description = 'Chat with GPT model';
  usage = 'chatgpt [your message]';
  credits = 'heru';
  cooldown = 3;

  async execute({ api, event, args }) {
    const userMessage = args.join(' ');
    if (!userMessage) {
      return api.sendMessage('Please provide a message to send to ChatGPT.', event.threadID, event.messageID);
    }

    const apiUrl = `https://jonellccprojectapis10.adaptable.app/api/chatgpt?input=${encodeURIComponent(userMessage)}`;

    const initialMessage = await new Promise((resolve, reject) => {
      api.sendMessage('⌛ Thinking...', event.threadID, (err, info) => {
        if (err) return reject(err);
        resolve(info);
      });
    });

    try {
      const response = await axios.get(apiUrl);
      const gptResponse = response.data.result;

      const formattedResponse = `🤖 𝗖𝗵𝗮𝘁𝗚𝗣𝗧\n━━━━━━━━━━━━━━━━━━\n${gptResponse.trim()}\n━━━━━━━━━━━━━━━━━━`;

      await api.editMessage(formattedResponse, initialMessage.messageID);
    } catch (error) {
      await api.editMessage('❌ An error occurred while trying to reach ChatGPT. Please try again later.', initialMessage.messageID);
    }
  }
}

export default new ChatGPTCommand();

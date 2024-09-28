export default {
    name: "changebio",
    author: "Arjhil Dacayanan",
    role: "owner",
    cooldowns: 10,
    description: "Change bot's biography and edit a message",
    async execute({ api, args, event }) {
        try {
            const content = args.join(" ") || "";

            // Send initial message saying the bio is being updated
            const initialMessage = await api.sendMessage("\n━━━━━━━━━━━━━━━━━━\nKaguya Updating Bio, Please Wait...\n━━━━━━━━━━━━━━━━━━\n", event.threadID);

            // Update the initial message with the new bio info
            const editedMessage = `Kaguya Biography updated to:\n━━━━━━━━━━━━━━━━━━\n ${content}\n━━━━━━━━━━━━━━━━━━\n`;
            await api.editMessage(editedMessage, initialMessage.messageID);
        } catch (err) {
            console.error(err);
        }
    },
};

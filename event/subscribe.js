import { log } from "../logger/index.js";

export default {
  name: "subscribe",
  execute: async ({ api, event, Threads, Users }) => {
    var threads = (await Threads.find(event.threadID))?.data?.data;
    const threadID = event.threadID;
    const threadName = threads?.name || "this group";
    const participantIDs = threads?.participants || [];

    switch (event.logMessageType) {
      case "log:unsubscribe": {
        if (event.logMessageData.leftParticipantFbId == api.getCurrentUserID()) {
          await Threads.remove(threadID);
          return log([
            {
              message: "[ THREADS ]: ",
              color: "yellow",
            },
            {
              message: `Deleted data of the group with TID: ${threadID} because the bot was kicked out of the group`,
              color: "green",
            },
          ]);
        }

        await Threads.update(threadID, {
          members: +threads.members - 1,
        });

        kaguya.reply(event.logMessageBody);
        break;
      }

      case "log:subscribe": {
        const addedParticipants = event.logMessageData.addedParticipants;

        if (addedParticipants.some((i) => i.userFbId == api.getCurrentUserID())) {
          api.changeNickname(
            `Prefix: ${global.client.config.prefix}  ${!global.client.config.BOT_NAME ? "Github: Arjhil" : global.client.config.BOT_NAME}`,
            threadID,
            api.getCurrentUserID()
          );

          const activationMessage = `𝐏𝐑𝐎𝐉𝐄𝐂𝐓 𝐊𝐀𝐆𝐔𝐘𝐀 𝐀𝐂𝐓𝐈𝐕𝐀𝐓𝐄𝐃 \n━━━━━━━━━━━━━━━━━━\nConnection successful! This bot [ KAGUYA PROJECT ], created by Arjhil Dacayanan, is now available to you.\n\nThank you for your interest in our products. Have fun spending time with us!\n━━━━━━━━━━━━━━━━━━\n`;

          // Share the activation message as a contact
          api.shareContact(activationMessage, api.getCurrentUserID(), threadID);

          return kaguya.send(activationMessage, threadID);
        } else {
          for (let i of addedParticipants) {
            const userID = i.userFbId;

            if (userID !== api.getCurrentUserID()) {
              api.shareContact(
                `𝐏𝐑𝐎𝐉𝐄𝐂𝐓 𝐊𝐀𝐆𝐔𝐘𝐀\n━━━━━━━━━━━━━━━━━━\nHello! Welcome to ${threadName}, you're the ${participantIDs.length}th member of this group. Enjoy!\n━━━━━━━━━━━━━━━━━━\n`,
                userID,
                threadID
              );

              await Users.create(userID);
            }
          }

          await Threads.update(threadID, {
            members: +threads.members + +addedParticipants.length,
          });

          return kaguya.send(event.logMessageBody);
        }
      }
    }
  },
};

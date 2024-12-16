export default {
    "prefix": ".", 
    "BOT_NAME": " Kaguya",
    "ADMIN_IDS": ["100018451976977"],
    "options": {
        "forceLogin": true,
        "listenEvents": true,
        "listenTyping": true,
        "logLevel": "silent",
        "updatePresence": true,
        "selfListen": false,
        "usedDatabase":false
    },
    database: {
        type: "json",
        mongodb: {
            uri: "mongodb://0.0.0.0:27017"
        }
    },
    port: process.env.PORT || 8084,
    mqtt_refresh: 1200000
};

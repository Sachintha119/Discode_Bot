require('dotenv').config();
const MusicBot = require('./MusicBot');

// Create and start the bot
const bot = new MusicBot();

// Start the bot with your token
bot.start(process.env.DISCORD_TOKEN);

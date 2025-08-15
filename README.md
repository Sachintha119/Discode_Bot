# Discord Music Bot

A lightweight Discord bot for playing YouTube music in voice channels.

## Features

- 🎵 Play music from YouTube (by URL or search)
- ⏭️ Skip songs
- ⏹️ Stop playback and clear queue
- 📋 View current queue
- 🎧 High-quality audio streaming

## Commands

- `!play <song name or YouTube URL>` - Play a song
- `!stop` - Stop music and clear queue
- `!skip` - Skip current song
- `!queue` - Show current queue
- `!help` - Show help message

## Setup

### Prerequisites

- Node.js 16.9.0 or higher
- FFmpeg installed on your system
- A Discord Bot Token

### Installation

1. Clone this repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a Discord Application and Bot:
   - Go to https://discord.com/developers/applications
   - Create a new application
   - Go to the "Bot" section
   - Create a bot and copy the token
   - Enable the following intents:
     - Message Content Intent
     - Server Members Intent

4. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Add your Discord bot token to the `.env` file

5. Invite the bot to your server:
   - Go to the "OAuth2" > "URL Generator" section
   - Select "bot" scope
   - Select the following permissions:
     - Send Messages
     - Connect
     - Speak
     - Use Voice Activity
   - Copy the generated URL and invite the bot to your server

### Running the Bot

```bash
# Development mode (with auto-restart)
npm run dev

# Production mode
npm start
```

## Usage

1. Join a voice channel
2. Use `!play <song name>` to start playing music
3. Use other commands to control playback

## Dependencies

- `discord.js` - Discord API wrapper
- `@discordjs/voice` - Voice connection handling
- `ytdl-core` - YouTube video downloading
- `youtube-search-api` - YouTube search functionality
- `ffmpeg-static` - FFmpeg binary for audio processing

## Notes

- The bot requires FFmpeg to be installed on your system
- Make sure your bot has the necessary permissions in your Discord server
- The bot uses YouTube for music streaming, so it's subject to YouTube's terms of service

## Troubleshooting

- If you get permission errors, make sure the bot has the correct permissions in your Discord server
- If audio doesn't play, ensure FFmpeg is properly installed
- For connection issues, check your Discord bot token and internet connection

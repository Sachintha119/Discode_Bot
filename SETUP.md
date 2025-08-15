# Discord Music Bot Setup Guide

## Quick Start

1. **Create a Discord Application:**
   - Go to https://discord.com/developers/applications
   - Click "New Application" and give it a name
   - Go to the "Bot" section and click "Add Bot"
   - Copy the bot token

2. **Set up the bot token:**
   - Open the `.env` file in this directory
   - Replace `your_discord_bot_token_here` with your actual bot token

3. **Invite the bot to your server:**
   - In the Discord Developer Portal, go to OAuth2 > URL Generator
   - Select "bot" scope
   - Select these permissions:
     - Send Messages
     - Connect
     - Speak
     - Use Voice Activity
   - Copy the generated URL and open it in your browser
   - Select your server and authorize

4. **Install FFmpeg (Required for audio):**
   - Download from: https://ffmpeg.org/download.html
   - Add FFmpeg to your system PATH
   - Or use chocolatey: `choco install ffmpeg`

5. **Run the bot:**
   ```
   npm start
   ```

## Commands

- `!play <YouTube URL>` - Play a song from YouTube
- `!stop` - Stop music and clear queue
- `!skip` - Skip current song
- `!queue` - Show current queue
- `!help` - Show help message

## Important Notes

- This bot requires a YouTube URL (not search terms)
- You must be in a voice channel to use music commands
- FFmpeg must be installed for audio to work
- The bot requires "Message Content Intent" to be enabled in the Discord Developer Portal

## Troubleshooting

1. **Bot doesn't respond:**
   - Check if the bot token is correct
   - Make sure "Message Content Intent" is enabled in Discord Developer Portal

2. **Audio doesn't play:**
   - Ensure FFmpeg is installed and in PATH
   - Check voice channel permissions

3. **"Cannot read properties" errors:**
   - Make sure you're in a voice channel
   - Verify the YouTube URL is valid

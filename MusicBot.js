const { Client, GatewayIntentBits, Collection } = require('discord.js');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus, VoiceConnectionStatus } = require('@discordjs/voice');
const ytdl = require('ytdl-core');

class MusicBot {
    constructor() {
        this.client = new Client({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.MessageContent,
                GatewayIntentBits.GuildVoiceStates
            ]
        });

        this.queue = new Map();
        this.setupEvents();
        this.setupCommands();
    }

    setupEvents() {
        this.client.once('ready', () => {
            console.log(`${this.client.user.tag} is online!`);
        });

        this.client.on('messageCreate', async (message) => {
            if (message.author.bot || !message.content.startsWith('!')) return;

            const args = message.content.slice(1).trim().split(/ +/);
            const command = args.shift().toLowerCase();

            try {
                switch (command) {
                    case 'play':
                        await this.play(message, args.join(' '));
                        break;
                    case 'stop':
                        await this.stop(message);
                        break;
                    case 'skip':
                        await this.skip(message);
                        break;
                    case 'queue':
                        await this.showQueue(message);
                        break;
                    case 'help':
                        await this.showHelp(message);
                        break;
                }
            } catch (error) {
                console.error('Command error:', error);
                message.reply('An error occurred while processing your command.');
            }
        });
    }

    setupCommands() {
        // Commands are handled in the messageCreate event
    }

    async play(message, query) {
        if (!message.member.voice.channel) {
            return message.reply('You need to be in a voice channel to play music!');
        }

        if (!query) {
            return message.reply('Please provide a YouTube URL!');
        }

        const serverQueue = this.queue.get(message.guild.id);

        let song;
        try {
            // Only accept YouTube URLs for simplicity
            if (!ytdl.validateURL(query)) {
                return message.reply('Please provide a valid YouTube URL!');
            }

            const songInfo = await ytdl.getInfo(query);
            song = {
                title: songInfo.videoDetails.title,
                url: songInfo.videoDetails.video_url,
                duration: this.formatDuration(songInfo.videoDetails.lengthSeconds)
            };
        } catch (error) {
            console.error('YouTube error:', error);
            return message.reply('Error getting video information!');
        }

        if (!serverQueue) {
            const queueContract = {
                textChannel: message.channel,
                voiceChannel: message.member.voice.channel,
                connection: null,
                player: null,
                songs: [],
                volume: 5,
                playing: true
            };

            this.queue.set(message.guild.id, queueContract);
            queueContract.songs.push(song);

            try {
                const connection = joinVoiceChannel({
                    channelId: message.member.voice.channel.id,
                    guildId: message.guild.id,
                    adapterCreator: message.guild.voiceAdapterCreator,
                });

                queueContract.connection = connection;
                await this.playSong(message.guild, queueContract.songs[0]);
                message.reply(`🎵 Now playing: **${song.title}**`);
            } catch (error) {
                console.error(error);
                this.queue.delete(message.guild.id);
                return message.reply('There was an error connecting to the voice channel!');
            }
        } else {
            serverQueue.songs.push(song);
            return message.reply(`🎵 **${song.title}** has been added to the queue!`);
        }
    }

    async playSong(guild, song) {
        const serverQueue = this.queue.get(guild.id);

        if (!song) {
            serverQueue.connection.destroy();
            this.queue.delete(guild.id);
            return;
        }

        try {
            const stream = ytdl(song.url, { 
                filter: 'audioonly',
                highWaterMark: 1 << 25,
                quality: 'highestaudio'
            });
            const resource = createAudioResource(stream);
            const player = createAudioPlayer();

            serverQueue.player = player;
            serverQueue.connection.subscribe(player);

            player.play(resource);

            player.on(AudioPlayerStatus.Idle, () => {
                serverQueue.songs.shift();
                this.playSong(guild, serverQueue.songs[0]);
            });

            player.on('error', error => {
                console.error('Audio player error:', error);
                serverQueue.textChannel.send('An error occurred while playing the song!');
                serverQueue.songs.shift();
                this.playSong(guild, serverQueue.songs[0]);
            });

        } catch (error) {
            console.error('Play song error:', error);
            serverQueue.textChannel.send('There was an error playing the song!');
            serverQueue.songs.shift();
            this.playSong(guild, serverQueue.songs[0]);
        }
    }

    async stop(message) {
        const serverQueue = this.queue.get(message.guild.id);

        if (!message.member.voice.channel) {
            return message.reply('You have to be in a voice channel to stop the music!');
        }

        if (!serverQueue) {
            return message.reply('There is no song that I could stop!');
        }

        serverQueue.songs = [];
        if (serverQueue.player) {
            serverQueue.player.stop();
        }
        if (serverQueue.connection) {
            serverQueue.connection.destroy();
        }
        this.queue.delete(message.guild.id);
        
        return message.reply('⏹️ Music stopped and queue cleared!');
    }

    async skip(message) {
        const serverQueue = this.queue.get(message.guild.id);

        if (!message.member.voice.channel) {
            return message.reply('You have to be in a voice channel to skip the music!');
        }

        if (!serverQueue) {
            return message.reply('There is no song that I could skip!');
        }

        if (serverQueue.player) {
            serverQueue.player.stop();
        }
        
        return message.reply('⏭️ Song skipped!');
    }

    async showQueue(message) {
        const serverQueue = this.queue.get(message.guild.id);

        if (!serverQueue) {
            return message.reply('There is no queue!');
        }

        let queueString = '';
        serverQueue.songs.forEach((song, index) => {
            queueString += `${index + 1}. **${song.title}** (${song.duration})\n`;
        });

        if (queueString.length > 2000) {
            queueString = queueString.substring(0, 1900) + '\n... and more';
        }

        return message.reply(`📋 **Current Queue:**\n${queueString}`);
    }

    async showHelp(message) {
        const helpEmbed = {
            color: 0x0099FF,
            title: '🎵 Music Bot Commands',
            fields: [
                {
                    name: '!play <YouTube URL>',
                    value: 'Play a song from a YouTube URL',
                    inline: false
                },
                {
                    name: '!stop',
                    value: 'Stop the music and clear the queue',
                    inline: true
                },
                {
                    name: '!skip',
                    value: 'Skip the current song',
                    inline: true
                },
                {
                    name: '!queue',
                    value: 'Show the current queue',
                    inline: true
                },
                {
                    name: '!help',
                    value: 'Show this help message',
                    inline: true
                }
            ],
            footer: {
                text: 'Music Bot v1.0'
            }
        };

        return message.reply({ embeds: [helpEmbed] });
    }

    formatDuration(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;

        if (hours > 0) {
            return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }
        return `${minutes}:${secs.toString().padStart(2, '0')}`;
    }

    start(token) {
        this.client.login(token);
    }
}

module.exports = MusicBot;

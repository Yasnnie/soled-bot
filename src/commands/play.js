const search = require("yt-search");
const ytdl = require("ytdl-core-discord");
const embed = require('discord.js');

const execute = (client, msg, args) => {
  const s = args.join(" ");
  console.log("---------------------------\nNOVA MÚSICA ADICIONADA\nUSER:"+msg.author.username+"\nNOME DA MÚSICA: "+s+"\nSERVIDOR:"+msg.guild.name+"\n---------------------------");
  try {
    search(s, (err, result) => {
      if (err) {
        throw err;
      } else if (result && result.videos.length > 0) {
        const song = result.videos[0];
        const queue = client.queues.get(msg.guild.id);
        if (queue) {
          queue.songs.push(song);
          client.queues.set(msg.guild.id, queue);
        } else playSong(client, msg, song);
      } else {
        return msg.reply("desculpe, não encontrei o que você desejava!");
      }
    });
  } catch (e) {
    console.error(e);
  }
};

const playSong = async (client, msg, song) => {
  let queue = client.queues.get(msg.member.guild.id);
  if (!song) {
    if (queue) {
      queue.connection.disconnect();
      return client.queues.delete(msg.member.guild.id);
    }
  }
  if (!msg.member.voice.channel) {
    return msg.reply(
      "você precisa estar em um canal de voz para reproduzir uma música!"
    );
  }
  if (!queue) {
    const conn = await msg.member.voice.channel.join();
    queue = {
      volume: 10,
      connection: conn,
      dispatcher: null,
      songs: [song],
    };
  }
  queue.dispatcher = await queue.connection.play(
    await ytdl(song.url, { highWaterMark: 1 << 25, filter: "audioonly" }),
    {
      type: "opus",
    }
  );
  queue.dispatcher.on("finish", () => {
    queue.songs.shift();
    playSong(client, msg, queue.songs[0]);
  });
  var msgmusic = new embed.MessageEmbed()
    .setColor('#e1a700')
    .setTitle('Está tocando:')
    .setDescription(`**Música: ** ${song.title} (${song.timestamp})`);
   var messagem = await msg.channel.send(msgmusic);

   messagem.delete({ timeout: song.seconds*1000 });
   
  client.queues.set(msg.member.guild.id, queue);
};

module.exports = {
  name: "p",
  help: "Reproduz a música desejada.",
  execute,
  playSong,
};
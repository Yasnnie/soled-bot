const search = require("yt-search");
const ytdl = require("ytdl-core-discord");
const ytpl = require('ytpl');
const embed = require('discord.js');
const { reset } = require("nodemon");

const execute = async (client, msg, args) => {

  const s = args.join(" ");

  if (ytpl.validateID(s)) {
    // A PLAYLIST TA SAINDO DE FORMA ALEATÓRIA E FALTANDO MÚSICAS
    const plID = await ytpl.getPlaylistID(s);
    const pl = await ytpl(plID);
    var playadd = [];
    pl.items.map(async musica => {
      const music = await search(musica.shortUrl);
       playadd.push(music.videos[0]);
    });
    const queue = client.queues.get(msg.guild.id);
    if(queue)
    {
      playadd.map(song=> {
      queue.songs.push(song);
     });
      client.queues.set(msg.guild.id, queue);
    }
    else
    {
      await createQueue(msg,client,playadd[0]);
      await playSong(client, msg, playadd[0]);
      const queue = client.queues.get(msg.guild.id);
      for(var i =1; i<playadd.length;i++)
      {
        queue.songs.push(playadd[i]);
      }
      client.queues.set(msg.guild.id, queue);
    }

    console.log("entrei na play list");
  } else {
    const song = await search(s);

    const queue = client.queues.get(msg.guild.id);
    if (queue) {
      console.log("queue");
      queue.songs.push(song.videos[0]);
      client.queues.set(msg.guild.id, queue);
    } else {
      await createQueue(msg,client,song.videos[0]);
      await playSong(client, msg, song.videos[0]);
    };
    
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

  queue.dispatcher = await queue.connection.play(
    await ytdl(song.url, { highWaterMark: 1 << 25, filter: "audioonly" }),
    {
      type: "opus",
    }
  );
  queue.dispatcher.on("finish", async () => {
    await queue.songs.shift();
    await playSong(client, msg, queue.songs[0]);
  });
  var msgmusic = new embed.MessageEmbed()
    .setColor('#e1a700')
    .setTitle('Está tocando:')
    .setDescription(`**Música: ** ${song.title} (${song.timestamp})`);
  var messagem = await msg.channel.send(msgmusic);

  messagem.delete({ timeout: song.seconds * 1000 });

  client.queues.set(msg.member.guild.id, queue);
};


const createQueue = async (msg,client,song) =>
{
  const conn = await msg.member.voice.channel.join();
  queue = {
    volume: 10,
    connection: conn,
    dispatcher: null,
    songs: [song],
  };
  client.queues.set(msg.member.guild.id, queue);
}

module.exports = {
  name: "p",
  help: "Reproduz a música desejada.",
  execute,
  playSong,
};
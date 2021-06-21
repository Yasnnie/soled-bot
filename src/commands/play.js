const search = require("yt-search");
const ytdl = require("ytdl-core-discord");
const ytpl = require('ytpl');
const embed = require('discord.js');


const execute = async (client, msg, args) => {

  const s = args.join(" ");

  if (ytpl.validateID(s)) {

    const plID = await ytpl.getPlaylistID(s);
    const pl = await ytpl(plID);
    let playadd = [];
    console.log("---------------------------\nNOVA PLAYLIST ADICIONADA\nUSER:" + msg.author.username + "\nNOME DA PLAYLIST: " + pl.title + "\nQUANTIDADE DE MÚSICA:" + pl.estimatedItemCount + "\nSERVIDOR:" + msg.guild.name + "\n---------------------------");
    for (var k = 0; k < pl.items.length; k++) {
      const music = await search(pl.items[k].title);
      playadd.push(music.videos[0]);
    }

    const queue = client.queues.get(msg.guild.id);
    if (queue) {

      console.log(playadd.length);
      for (var j = 0; j < playadd.length; j++) {
        queue.songs.push(playadd[j]);
      }


      client.queues.set(msg.guild.id, queue);
    }
    else {

      if (msg.member.voice.channel){
        await createQueue(msg, client, playadd[0]);
        } else return msg.reply( "você precisa estar em um canal de voz para reproduzir uma música!");
     
      await playSong(client, msg, playadd[0]);
      const newqueue = client.queues.get(msg.guild.id);
      console.log(playadd.length);
      for (var i = 1; i < playadd.length; i++) {
        newqueue.songs.push(playadd[i]);
      }
      client.queues.set(msg.guild.id, newqueue);
    }


  } else {
    const song = await search(s);
    if (!song) { return msg.reply("Desculpe, não achei essa música."); }
    else {
      console.log("---------------------------\nNOVA MÚSICA ADICIONADA\nUSER:" + msg.author.username + "\nNOME DA MÚSICA: " + s + "\nSERVIDOR:" + msg.guild.name + "\n---------------------------");
      const queue = client.queues.get(msg.guild.id);
      if (queue) {
        queue.songs.push(song.videos[0]);
        client.queues.set(msg.guild.id, queue);
      } else {
        if (msg.member.voice.channel){
        await createQueue(msg, client, song.videos[0]);
        } else return msg.reply( "você precisa estar em um canal de voz para reproduzir uma música!");
        await playSong(client, msg, song.videos[0]);
      };
    }
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


  if (!msg.member.voice.channel && !queue.connection) {
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


const createQueue = async (msg, client, song) => {
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
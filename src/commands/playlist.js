const ytdl = require("ytdl-core-discord");
const embed = require('discord.js');
const execute = (client, msg, args) => 
{
    const queue = client.queues.get(msg.guild.id);

    if(!queue) return msg.reply("Não existe nenhuma música sendo reproduzida");

    var plinfo = new embed.MessageEmbed()
        .setColor('#e1a700')
        .setTitle('░░░░░░░░░░░░░  PLAYLIST:  ░░░░░░░░░░░░░')
       

    for(var i =0; i<queue.songs.length;i++)
    {
        plinfo.addFields({name :`${i} : ${queue.songs[i].title} `, value:`(${queue.songs[i].timestamp})`});
    }
    
    return msg.channel.send(plinfo);
}

module.exports=
{
 name: "pl",
 help: "Mostra as músicas de sua playlist/queue atual.",
 execute,
}
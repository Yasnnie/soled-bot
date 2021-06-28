const execute = (client, msg, args) => 
{
    const queue = client.queues.get(msg.guild.id);
    console.log("---------------------------\nPAROU A MÚSICA\nUSER:"+msg.author.username+"\nSERVIDOR:"+msg.guild.name+"\n---------------------------");
    if(!queue) return msg.reply("Não existe nenhuma música sendo reproduzida");
    queue.embed.delete();
    queue.songs=[];
    client.queues.set(msg.guild.id,queue);
    queue.dispatcher.end();
}

module.exports=
{
 name: "stop",
 help: "Para a reprodução de música atual.",
 execute,
}
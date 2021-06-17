const execute = (client, msg, args) => 
{
    const queue = client.queues.get(msg.guild.id);

    if(!queue) return msg.reply("Não existe nenhuma música sendo reproduzida");

    queue.dispatcher.pause();
}

module.exports=
{
 name: "pause",
 help: "Pausa a reprodução de música atual.",
 execute,
}
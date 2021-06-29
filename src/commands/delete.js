const execute = (client, msg, args) => 
{

        msg.channel.messages.fetch({ limit: 100 }).then(messages => msg.channel.bulkDelete(messages));
    
}

module.exports=
{
 name: "delete",
 help: "Deleta mensagens. Por padrão ela deletará 100 mensagens.",
 execute,
}
const embed = require('discord.js');
const execute = (client,msg,args) =>
{


    var msghelp = new embed.MessageEmbed()
    .setColor('#e1a700')
    .setTitle('░░░░░░░░░░░░░  COMANDOS:  ░░░░░░░░░░░░░')

    client.commands.forEach((command) => {
        if(command.help)
        {
            msghelp.addFields({name :`Comando:  ${command.name} `, value:`Função:  ${command.help}`, inline:true});
            
        }
    });

    return msg.channel.send(msghelp);
};

module.exports = {
    name: "help",
    help: "Mostra todos os comandos",
    execute,
}
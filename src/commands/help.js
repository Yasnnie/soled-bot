const execute = (client,msg,args) =>
{
    let string = "==== COMANDOS: ====\n";
    client.commands.forEach((command) => {
        if(command.help)
        {
            string += `**${command.name}**: ${command.help} \n`
        }
    });

    return msg.channel.send(string);
};

module.exports = {
    name: "help",
    help: "Mostra todos os comandos",
    execute,
}
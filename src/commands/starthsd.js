const execute = (client, msg, args) =>
{
    let start = client.starthsd.get(msg.member.guild.id);
    

    if(!start)
    {
        start = 
        {
           jogadores: [],
    
        };
    }

    if(start && start.jogadores.length == 2)
    {
     return msg.reply("Já foi iniciado um jogo.");
    }
    else if((start && start.jogadores.length<2) || !start)
    {
        
        start.jogadores.push(msg.author);
        console.log(start.jogadores);
    }else
    {
        start.jogadores.push(msg.author);
    }

}

module.exports =
{
    name:"starthsd",
    help:"Inicia o mini-game Help Server Discord",
    execute,
}
const execute = async (client, msg, args) => {
    // IMPORTANTE!!!!!!
    // COLOCAR CÓDIGO PARA NÃO ADICIONAR O MESMO PLAYER; 
    let start = client.starthsd.get(msg.member.guild.id);

    var quantplayer = 0;

    if (!args[0] && !start) {
        quantplayer = 6;
    } else if ((parseInt(args[0]) < 4 && !start) || (parseInt(args[0]) > 11 && !start)) {
        return msg.reply(" desculpe, não se pode jogar com essa quantidade de jogadores!");
    } else if (4 <= parseInt(args[0]) && !start) {
        quantplayer = parseInt(args[0]);
    }


    if (start && start.jogadores.length === start.typegame && start.gamestart == true) {
        return msg.reply("Já foi iniciado um jogo.");
    } else if (start && start.jogadores.length < start.typegame) {

        start.jogadores.push(msg.author);
        //console.log(start.jogadores);
    } else if (!start) {
        start =
        {
            jogadores: [],
            gamestart: false,
            ass: [],
            typegame: 0,
            category: null,
            channels: [],
        };
        start.typegame = quantplayer;
        client.starthsd.set(msg.member.guild.id, start);
        start.jogadores.push(msg.author);
    }

    if (start && start.gamestart == false && start.jogadores.length == start.typegame) {
        console.log('começou');

        switch (start.typegame) {
            case 4:
            case 5:
                const random = Math.floor(Math.random() * start.jogadores.length);
                start.ass.push(start.jogadores[random]);
                break;


            case 6:
            case 7:
                var i = 0;
                while (i < 2) {
                    const random = Math.floor(Math.random() * start.jogadores.length);
                    start.ass.push(start.jogadores[random]);
                    i++;
                };
                break;


            case 8:
            case 9:
                var i = 0;
                while (i < 3) {
                    const random = Math.floor(Math.random() * start.jogadores.length);
                    start.ass.push(start.jogadores[random]);
                    i++;
                };
                break;


            case 10:
            case 11:
                var i = 0;
                while (i < 4) {
                    const random = Math.floor(Math.random() * start.jogadores.length);
                    start.ass.push(start.jogadores[random]);
                    i++;
                };
                break;
        }

        let category = await msg.guild.channels.create("Hacking Discord Server", { type: "category" });
        start.category = category;

        
        for (var i = 0; i < start.jogadores.length; i++) {
            
            var channel = msg.guild.channels.create(start.jogadores[i].username + "- VOTE", { type: "text",})
            .then(channel => {
                channel.setParent(category);
                channel.overwritePermissions('691032209641046166', { VIEW_CHANNEL: false });
            });
        
            
        }


        start.gamestart = true;
    }


}

module.exports =
{
    name: "hds",
    help: "Inicia o mini-game Help Server Discord",
    execute,
}
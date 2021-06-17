
const discord = require('discord.js');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
const { OpusEncoder } = require('@discordjs/opus');

dotenv.config();

const client = new discord.Client();
client.commands = new discord.Collection();
client.login(process.env.TOKEN);

const commandFiles = fs.readdirSync(path.join(__dirname,"/commands")).filter(filename=> filename.endsWith(".js"));


client.queues = new Map();

//ADICIONA OS COMANDOS
for(var filename of commandFiles)
{
    const command = require(`./commands/${filename}`);
    client.commands.set(command.name,command);
}

//MAPEA OS COMANDOS

console.log(client.commands);

client.on("ready", function(){

    console.log(`ESTOU CONECTADO by ${client.user.username}`);
});

//MEMBRO QUE ENTRA NO SERVIDOR (COM ROLE AUTOMATICA)
client.on("guildMemberAdd", member => {
    console.log(member.user.username + ':(' + member.user + ") entrou no servidor!");
    member.guild.channels.cache.get('854034863749464076').send(member.user.username + ' entrou no servidor! Seja bem-vindo!!');
    member.roles.add('757642838736502916');

});

client.on("message", (msg)=>{

   // if(!msg.content.startWith(process.env.PREFIX)) return;
   if(msg.author.bot) return;
   if (msg.channel.type === "dm") return msg.reply("Desculpe, não respondo a mensagens privadas!\nEntretanto entre em algum dos servidores no qual eu participo.\n");
   if(!msg.content.startsWith(process.env.PREFIX) ) return;
   

   const args = msg.content.slice(process.env.PREFIX.length).split(" ");
   const command = args.shift();

   try{

        client.commands.get(command).execute(client,msg,args);

   }catch(e)
   {
        return msg.reply("Ops! Eu ainda não conheço esse comando!");
   }

});
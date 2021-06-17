const execute = (client, msg,args) =>
{
 return msg.reply("Oi");
};

module.exports = {
    name: "hello",
    help: "Hello, world!",
    execute,

};
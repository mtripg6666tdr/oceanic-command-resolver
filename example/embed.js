// @ts-check
require("dotenv").config();
const oceanic = require("oceanic.js");
const Helper = require("../dist/helper"); // require("@mtripg6666tdr/oceanic-command-resolver") in installed environment

const bot = new oceanic.Client({
  auth: `Bot ${process.env.TOKEN}`,
});

const embed = new Helper.MessageEmbedBuilder()
  .setTitle("Hello world!")
  .setDescription("This is just a test")
  .setAuthor({
    name: "BIG BOSS"
  })
  .setColor(0xffffff)
  .setFooter({
    text: "some amazing footer"
  })
  .addField("A", "ABC")
  .addFields({
    name: "1", 
    value: "123"
  }, {
    name: "あ", 
    value: "あいう"
  })
  .toOceanic()
;

bot.on("messageCreate", message => {
  if(message.author.bot) return;
  if(message.channel instanceof oceanic.TextChannel){
    message.channel.createMessage({embeds: [embed]});
  }
});

bot.connect();

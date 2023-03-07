// @ts-check
require("dotenv").config();
const oceanic = require("oceanic.js");
const Helper = require("../dist/helper"); // require("@mtripg6666tdr/oceanic-command-resolver") in installed environment

const bot = new oceanic.Client({
  auth: `Bot ${process.env.TOKEN}`
});

bot.on("messageCreate", message => {
  if(message.author.bot) return;
  if(message.channel instanceof oceanic.TextChannel){
    message.channel.createMessage({components: [
      new Helper.MessageActionRowBuilder()
        .addComponents(
          new Helper.MessageStringSelectMenuBuilder()
            .setCustomId("id")
            .setOptions({
              value: "1",
              label: "1"
            }),
        )
        .toOceanic(),
      new Helper.MessageActionRowBuilder()
        .addComponents(
          new Helper.MessageInputSelectMenuBuilder(oceanic.ComponentTypes.USER_SELECT)
            .setCustomId("users")
        )
        .toOceanic(),
      new Helper.MessageActionRowBuilder()
        .addComponents(
          new Helper.MessageChannelSelectMenuBuilder()
            .setCustomId("channel")
            .setChannelTypes(oceanic.ChannelTypes.GUILD_FORUM)
        )
        .toOceanic(),
      new Helper.MessageActionRowBuilder()
        .addComponents(
          new Helper.MessageButtonBuilder()
            .setCustomId("aaaaaa")
            .setDisabled(true)
            .setLabel("HELLO")
            .setStyle("PRIMARY"),
          new Helper.MessageButtonBuilder()
            .setUrl("https://example.com")
            .setStyle("LINK")
            .setLabel("Open example site"),
        )
        .toOceanic(),
      ],
    });
  }
});

bot.connect();

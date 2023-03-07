// @ts-check
require("dotenv").config();
const oceanic = require("oceanic.js");
const { CommandMessage } = require("../dist"); // require("@mtripg6666tdr/oceanic-command-resolver") in installed environment

const bot = new oceanic.Client({
  auth: `Bot ${process.env.TOKEN}`,
  gateway: {
    intents: [
      "GUILDS",
      "MESSAGE_CONTENT",
      "GUILD_MESSAGES",
    ]
  },
});

// only one command definition
/** @type {(message:import("../dist/CommandMessage").CommandMessage)=>Promise} */
const pingPongCommand = message => message.reply("pong!");

// and only one command handler
/** @type {(message:import("../dist/CommandMessage").CommandMessage)=>Promise} */
const commandHandler = commandMessage => {
  switch(commandMessage.command){
    case "ping":
      return pingPongCommand(commandMessage);
    default:
      return commandMessage.reply("no command found");
  }
}

bot.on("ready", async () => {
  const commands = await bot.application.getGlobalCommands();
  if(!commands.some(command => command.name === "ping")){
    bot.application.createGlobalCommand({
      name: "ping",
      description: "do ping pong",
      type: oceanic.ApplicationCommandTypes.CHAT_INPUT,
    });
  }
  if(!commands.some(command => command.name === "sub")){
    bot.application.createGlobalCommand({
      name: "sub",
      description: "subcommand example",
      type: oceanic.ApplicationCommandTypes.CHAT_INPUT,
      options: [
        {
          type: oceanic.ApplicationCommandOptionTypes.SUB_COMMAND_GROUP,
          name: "sub",
          description: "sub sub",
          options: [
            {
              type: oceanic.ApplicationCommandOptionTypes.SUB_COMMAND,
              name: "subcommand1",
              description: "subcommand1"
            },
            {
              type: oceanic.ApplicationCommandOptionTypes.SUB_COMMAND,
              name: "subcommand2",
              description: "subcommand2",
            }
          ]
        },
        {
          type: oceanic.ApplicationCommandOptionTypes.SUB_COMMAND,
          name: "subsubcommand",
          description: "big big",
          options: [
            {
              type: oceanic.ApplicationCommandOptionTypes.INTEGER,
              name: "integer",
              description: "number"
            }
          ]
        }
      ],
    })
  }
});

bot.on("messageCreate", message => {
  if(!message.member || message.member.bot || !message.inCachedGuildChannel()) return; // ignore messages sent by bots
  if(!(message.channel instanceof oceanic.TextChannel)) return; // ignore other than guilds
  if(!message.content.startsWith("!")) return; // do nothing to messages without prefix
  const commandMessage = CommandMessage.createFromMessage(message, 1);
  commandHandler(commandMessage);
});

bot.on("interactionCreate", async interaction => {
  if(!interaction.inCachedGuildChannel()) return;
  if(interaction instanceof oceanic.CommandInteraction){
    if(!(interaction.channel instanceof oceanic.TextChannel)) return;
    const commandMessage = await CommandMessage.createFromInteraction(interaction);
    console.log(commandMessage.rawOptions, commandMessage.options);
    commandHandler(commandMessage);
  }
});

bot.on("error", console.error);

bot.connect();

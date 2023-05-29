import { AnyTextableGuildChannel, Message } from "oceanic.js";

export function createMessageUrl(message:Message<AnyTextableGuildChannel>){
  return `https://discord.com/channels/${message.channel.guild.id}/${message.channel.id}/${message.id}`;
}

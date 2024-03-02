> Note: this package is mainly for my own use, but it might be useful if you use as needed  

# oceanic-command-resolver
![npm](https://img.shields.io/npm/v/@mtripg6666tdr/oceanic-command-resolver)

Making a bot for Discord sometimes makes us feel it is difficult now, after the birth of slash-commands and other components.  
However, all interaction emitted by those will be finally a Message, so all messages, command-interactions and components-interactions can be seen as some kind of "command", sent by users. This package was born from and based on this theory.


This package will resolve all of `ComamndInteraction`, `ComponentInteraction` and `Message` as unified `CommandMessage` and you can code with `CommandMessage` with no considering the way the command was passed.  
![oceanic-command-resolver-graph](https://user-images.githubusercontent.com/56076195/223353150-36136315-dd41-4e05-90d3-e79e4d0e0cdb.jpg)

Therefore you can support Message-based-command, Component-based-command, and Interaction-based-command at once, without any redundant codes.  

## Examples
- [Quick example to handle commands](example/index.js)
- [Create embed by using EmbedBuilder](example/embed.js)
- [Create message components by using MessageComponentBuilder](example/components.js)

## API
### [`CommandMesasge`](https://web.usamyon.moe/oceanic-command-resolver/classes/CommandMessage.html)
  Represence the message or interaction that includes command.
- `createFromMessage(message: Message<TextChannel>, prefixLength?: number)`  
  Resolves message to CommandMessage.  
  - Return: [`CommandMesasge`](https://web.usamyon.moe/oceanic-command-resolver/classes/CommandMessage.html)  

- `createFromInteraction(interaction: CommandInteraction<TextableChannel>)`  
  Resolves message to CommandMessage.  
  - Return: [`CommandMesasge`](https://web.usamyon.moe/oceanic-command-resolver/classes/CommandMessage.html)  
  
- `reply(options: MessageOptions)`  
  Reply to the user.  
  - Return: [`ResponseMessage`](https://web.usamyon.moe/oceanic-command-resolver/classes/ResponseMessage.html)
  
### [`ResponseMessage`](https://web.usamyon.moe/oceanic-command-resolver/classes/ResponseMessage.html)
  Represence the message that is the reply to the CommandMessage.
- `edit(options: MessageContent)`  
  Edit the response message.
  - Return: Promise<[`ResponseMessage`](https://web.usamyon.moe/oceanic-command-resolver/classes/ResponseMessage.html)>  
  
*... and so on...*

You can see the full api document [here](https://mtripg6666tdr.github.io/oceanic-command-resolver/).  

## Versions

|oceanic-command-resolver|oceanic.js     |
|------------------------|---------------|
|>=1.0.0 <1.2.0          |>=1.5.0 <1.7.0 |
|>=1.2.0 <1.3.0          |>=1.7.0 <1.8.0 |
|>=1.3.0 <1.4.0          |>=1.8.0 <1.9.0 |
|>=1.4.0 <1.5.0          |>=1.9.0 <1.10.0|

> As of Sep 26, 2023

## License
[LICENSE](LICENSE)

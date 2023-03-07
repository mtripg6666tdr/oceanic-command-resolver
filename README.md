> Note: this package is mainly for my own use, but it might be useful if you use as needed  

# oceanic-command-resolver
![npm](https://img.shields.io/npm/v/@mtripg6666tdr/oceanic-command-resolver)

By using this package, both `ComamndInteraction` and `Message` will be resolved as unified `CommandMessage` and you can code with `CommandMessage` with no considering the way the command passed.  
![image](https://user-images.githubusercontent.com/56076195/216804553-e6b52c10-7a7d-49fb-b9d1-2ae230213cb9.png)

Therefore you can support Message-based-command and Interaction-based-command at once, without any verbose codes.  

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

## License
[LICENSE](LICENSE)

import type { MessageOptions } from "./messageOptions";
import type {
  AnyTextableGuildChannel,
  Client, CommandInteraction,
  ComponentInteraction,
  CreateMessageOptions,
  InteractionOptions,
  Message,
  ModalSubmitInteraction
} from "oceanic.js";

import {
  ApplicationCommandOptionTypes,
  InteractionTypes,
  MessageFlags
} from "oceanic.js";

import { ResponseMessage } from "./ResponseMessage";
import { defaultConfig } from "./config";
import { createMessageUrl } from "./util";

/**
 * Represents CommandInteraction or Message which contains command.
 */
export class CommandMessage {
  protected isMessage = false;
  protected _message: Message<AnyTextableGuildChannel>|null = null;
  protected _interaction: CommandInteraction<AnyTextableGuildChannel>|ComponentInteraction<any, AnyTextableGuildChannel>|ModalSubmitInteraction<AnyTextableGuildChannel>|null = null;
  protected _interactionOption: InteractionOptions[]|null = null;
  protected _interactionReplied = false;
  protected _client: Client = null!;
  protected _command: string = null!;
  protected _options: string[] = null!;
  protected _rawOptions: string = null!;
  protected _responseMessage: ResponseMessage = null!;
  protected constructor(){}

  /**
   * Initialize this from Message
   * @param message Message an user sent that contains command
   * @returns new CommandMessage instance
   */
  static createFromMessage(message: Message<AnyTextableGuildChannel>, prefixLength: number = 1){
    const me = new CommandMessage();
    me.isMessage = true;
    me._message = message;
    me._client = message.channel.client;
    const { command, options, rawOptions } = this.resolveCommandMessage(message.content, prefixLength);
    me._command = command;
    me._options = options;
    me._rawOptions = rawOptions;
    return me;
  }

  /**
   * Create and initialize a new CommandMessage object based on Message, with given pre-parsed options.
   * @param message The Message object that should be treated as a command.
   * @param command The command string that the Message indicates.
   * @param options The command arguments that the Message indicates.
   * @param rawOptions The raw command arguments text that the Message indicates.
   * @returns New CommandMessage object.
   */
  protected static createFromMessageWithParsed(message: Message<AnyTextableGuildChannel>, command: string, options: string[], rawOptions: string){
    const me = new CommandMessage();
    me.isMessage = true;
    me._message = message;
    me._client = message.channel.client;
    me._command = command;
    me._options = options;
    me._rawOptions = rawOptions;
    return me;
  }

  /**
   * Initialize this from command interaction.
   * @param interaction CommandInteraction that contains command.
   * @returns Created CommandMessage object.
   */
  static createFromInteraction(interaction: CommandInteraction<AnyTextableGuildChannel>): CommandMessage;
  /**
   * Initialize this from component interaction.
   * @param interaction ComponentInteraction that will be treated as a command.
   * @param command The command string that the interaction intends to execute.
   * @param options The parsed arguments of the command bound to the interaction.
   * @param rawOptions The raw arguments text of the command bound to the interaction.
   */
  static createFromInteraction(interaction: ComponentInteraction<any, AnyTextableGuildChannel>, command: string, options: string[], rawOptions: string): CommandMessage;
  /**
   * Initialize this from modal-submit interaction.
   * @param interaction ModalSubmitInteraction that will be treated as a command.
   * @param command The command string that the interaction intends to execute.
   * @param options The parsed arguments of the command bound to the interaction.
   * @param rawOptions The raw arguments text of the command bound to the interaction.
   */
  static createFromInteraction(interaction: ModalSubmitInteraction<AnyTextableGuildChannel>, command: string, options: string[], rawOptions: string): CommandMessage;
  static createFromInteraction(
    interaction: CommandInteraction<AnyTextableGuildChannel>|ComponentInteraction<any, AnyTextableGuildChannel>|ModalSubmitInteraction<AnyTextableGuildChannel>,
    command?: string,
    options?: string[],
    rawOptions?: string
  ){
    const me = new CommandMessage();
    me.isMessage = false;
    me._interaction = interaction;
    me._client = interaction.channel.client;
    if(interaction.type === InteractionTypes.APPLICATION_COMMAND){
      const { commandName, options: parsedOptions } = CommandMessage.resolveSubCommandRecursively(interaction);
      me._command = commandName;
      me._interactionOption = parsedOptions || null;
      me._options = parsedOptions
        .filter(option =>
          option.type !== ApplicationCommandOptionTypes.ATTACHMENT
          && option.type !== ApplicationCommandOptionTypes.SUB_COMMAND
          && option.type !== ApplicationCommandOptionTypes.SUB_COMMAND_GROUP
        )
        .map(_options => {
          if("value" in _options){
            return _options.value.toString();
          }else{
            return "";
          }
        });
      me._rawOptions = me._options.join(" ");
    }else{
      me._command = command!;
      me._options = options!;
      me._rawOptions = rawOptions!;
    }
    return me;
  }

  private static resolveSubCommandRecursively(interaction: CommandInteraction<AnyTextableGuildChannel>){
    const commandNameFragments: string[] = [interaction.data.name];
    let options: InteractionOptions[] = interaction.data.options.raw;
    while(options && options[0] && (options[0].type === ApplicationCommandOptionTypes.SUB_COMMAND_GROUP || options[0].type === ApplicationCommandOptionTypes.SUB_COMMAND)){
      commandNameFragments.push(options[0].name);
      if(!options[0].options){
        break;
      }
      options = options[0].options;
    }
    return {
      commandName: commandNameFragments.join(defaultConfig.subCommandSeparator),
      options,
    };
  }

  /**
   * Respond to the command  
   * You can call this once  
   * @param options message content
   * @returns response message bound to this command message
   */
  async reply(options: MessageOptions | string): Promise<ResponseMessage>{
    if(this.isMessage){
      if(this._responseMessage){
        throw new Error("Target message was already replied");
      }else if(!this._message || !this._message.inCachedGuildChannel()){
        throw new Error("No message cached or no cached guild");
      }

      const _opt: CreateMessageOptions & { ephemeral?: boolean } = typeof options === "string" ? { content: options } : Object.assign({}, options);
      delete _opt.ephemeral;
      const msg = await this._message.channel.createMessage(Object.assign(_opt, {
        messageReference: {
          messageID: this._message.id,
          failIfNotExists: false,
          ..._opt.messageReference || {},
        },
        allowedMentions: {
          repliedUser: false,
          ..._opt.allowedMentions || {},
        },
      }));

      return this._responseMessage = ResponseMessage.createFromMessage(msg as Message<AnyTextableGuildChannel>, this);
    }else{
      if(this._interactionReplied){
        throw new Error("Target message was already replied");
      }else if(!this._interaction || !this._interaction.inCachedGuildChannel()){
        throw new Error("No interaction cached or no cached guild");
      }

      const _opt: MessageOptions = typeof options === "string" ? { content: options } : Object.assign({}, options);
      delete _opt.ephemeral;
      delete _opt.editOriginalMessage;
      let mes: Message<AnyTextableGuildChannel> = null!;

      if(this._interaction.type === InteractionTypes.APPLICATION_COMMAND || (typeof options === "object" && options.editOriginalMessage)){
        if(this._interaction.acknowledged){
          mes = await this._interaction.editOriginal(_opt);
        }else if(_opt.files){
          await this._interaction.defer();
          mes = (await this._interaction.createFollowup(Object.assign(_opt, {
            flags: typeof options === "object" && options.ephemeral ? MessageFlags.EPHEMERAL : undefined,
          }))).message;
        }else{
          await this._interaction.createMessage(Object.assign(_opt, {
            flags: typeof options === "object" && options.ephemeral ? MessageFlags.EPHEMERAL : undefined,
          }));
          mes = await this._interaction.getOriginal();
        }
      }else if(this._interaction.type === InteractionTypes.MODAL_SUBMIT){
        await this._interaction.createMessage(Object.assign({
          flags: typeof options === "object" && options.ephemeral ? MessageFlags.EPHEMERAL : undefined,
        }, _opt));
        mes = await this._interaction.getOriginal();
      }else if(this._interaction.acknowledged){
        mes = (await this._interaction.createFollowup(Object.assign({
          flags: typeof options === "object" && options.ephemeral ? MessageFlags.EPHEMERAL : undefined,
        }, _opt))).message;
      }else{
        await this._interaction.createMessage(Object.assign({
          flags: typeof options === "object" && options.ephemeral ? MessageFlags.EPHEMERAL : undefined,
        }, _opt));
        mes = await this._interaction.getOriginal();
      }
      this._interactionReplied = true;
      return this._responseMessage = ResponseMessage.createFromInteraction(this._interaction, mes, this);
    }
  }

  /**
   * Response message bound to this command message
   * @remarks Response message may be stale.
   */
  get response(): ResponseMessage{
    return this._responseMessage;
  }

  /**
   * Set suppress of the embed of command message
   * @param suppress if true suppressed, otherwise false
   */
  async suppressEmbeds(suppress: boolean): Promise<CommandMessage>{
    if(this.isMessage){
      return CommandMessage.createFromMessageWithParsed(await this._message!.edit({
        flags: suppress ? this._message!.flags | MessageFlags.SUPPRESS_EMBEDS : this._message!.flags ^ MessageFlags.SUPPRESS_EMBEDS,
      }), this._command, this._options, this._rawOptions);
    }else{
      return this;
    }
  }

  /**
   * the content of this command message
   */
  get content(){
    if(this.isMessage){
      return this._message!.content;
    }else{
      return `/${this._command} ${this.rawOptions}`.trim();
    }
  }

  /**
   * the author of this command message
   */
  get author(){
    return this.isMessage ? this._message!.author : this._interaction!.user;
  }

  /**
   * the memeber of this command message
   */
  get member(){
    return this.isMessage ? this._message!.member : this._interaction!.member;
  }

  /**
   * the channel of this command message
   */
  get channel(){
    return this.isMessage ? this._message!.channel : this._interaction!.channel;
  }

  /**
   * the guild of this command message
   */
  get guild(){
    return this.isMessage ? this._message!.channel.guild : this._interaction!.channel.guild;
  }

  /**
   * the reactions of this command message
   * If this was created from CommandInteraction, this will always return null.
   */
  get reactions(){
    return this.isMessage ? this._message!.reactions : null;
  }

  /**
   * the url of this command message
   * If this was created from CommandInteraction, this will always return null.
   */
  get url(){
    return this.isMessage ? createMessageUrl(this._message!) : null;
  }

  /**
   * the timestamp of this command message
   */
  get createdTimestamp(){
    return this.isMessage ? this._message!.createdAt : this._interaction!.createdAt;
  }

  /**
   * the date time of this command message
   */
  get createdAt(){
    return new Date(this.createdTimestamp);
  }

  /**
   * the id of this command message
   */
  get id(){
    return this.isMessage ? this._message!.id : this._interaction!.id;
  }

  /**
   * the channel id of this command message
   */
  get channelId(){
    return this.isMessage ? this._message!.channel.id : this._interaction!.channel.id;
  }

  /**
   * the attatchment of this command message.
   * If this was created from CommandInteraction, this will always return empty array.
   */
  get attachments(){
    return this.isMessage
      ? this._message!.attachments
      : this._interaction!.type === InteractionTypes.APPLICATION_COMMAND && [...this._interaction!.data.resolved.attachments.values()] || [];
  }

  /**
   * Command name which was resolved
   */
  get command(){
    return this._command;
  }

  /**
   * Command arguments which was resolved
   */
  get options(){
    return this._options;
  }

  /**
   * Raw command arguments
   */
  get rawOptions(){
    return this._rawOptions;
  }

  protected static parseCommand(cmd: string, prefixLength: number, textNormalizer:((text: string) => string)) {
    const commandString = textNormalizer(cmd).substring(prefixLength);
    const [command, ...options] = commandString.split(" ").filter(content => content.length > 0);
    const rawOptions = options.join(" ");
    return { command, options, rawOptions };
  }

  /**
   * Reslolve command and arguments from message content
   * @param content message content
   * @param prefixLength prefix length
   * @returns object contains resolved command, parsed arguments and raw argument.
   */
  static resolveCommandMessage(content: string, prefixLength: number, textNormalizer:((text: string) => string) = v => v){
    const parsed = this.parseCommand(content, prefixLength, textNormalizer);
    parsed.command = parsed.command.toLowerCase();
    return {
      command: parsed.command,
      rawOptions: parsed.rawOptions,
      options: parsed.options,
    };
  }
}

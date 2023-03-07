import { ChannelSelectMenu, ChannelTypes, ComponentTypes } from "oceanic.js";
import { MessageActionRowComponentsBuilder } from "./actionRowComponent";

/**
 * a helper to build SelectMenu for oceanic.js
 */
export class MessageChannelSelectMenuBuilder extends MessageActionRowComponentsBuilder<ChannelSelectMenu>{
  private _customId: string|undefined;
  private _disabled: boolean|undefined;
  private _maxValues: number|undefined;
  private _minValues: number|undefined;
  private _channelTypes: ChannelTypes[] = [];
  private _placeholder: string|undefined;
  private _type: ComponentTypes.CHANNEL_SELECT = ComponentTypes.CHANNEL_SELECT;

  constructor(_data?: ChannelSelectMenu){
    super();
    if(_data){
      this._customId = _data.customID;
      this._disabled = _data.disabled;
      this._maxValues = _data.maxValues;
      this._minValues = _data.minValues;
      this._channelTypes = [..._data.channelTypes];
      this._placeholder = _data.placeholder;
      this._type = _data.type;
    }
  }

  get customId(){
    return this._customId;
  }

  get disabled(){
    return this._disabled;
  }

  get maxValues(){
    return this._maxValues;
  }

  get minValues(){
    return this._minValues;
  }

  get channelTypes():Readonly<ChannelTypes[]>{
    return this._channelTypes;
  }

  get placeholder(){
    return this._placeholder;
  }

  get type(){
    return this._type;
  }

  addChannelTypes(...options: ChannelTypes[]){
    (this._channelTypes = this._channelTypes || []).push(...options);
    return this;
  }

  setCustomId(customId:string){
    this._customId = customId;
    return this;
  }

  setDisabled(disabled:boolean = true){
    this._disabled = disabled;
    return this;
  }

  setMaxValues(maxValues:number){
    this._maxValues = maxValues;
    return this;
  }

  setMinValues(minValues:number){
    this._minValues = minValues;
    return this;
  }

  setChannelTypes(...options: ChannelTypes[]){
    this._channelTypes = options;
    return this;
  }

  setPlaceholder(placeholder:string){
    this._placeholder = placeholder;
    return this;
  }

  spliceOptions(index:number, deleteCount:number, ...options: ChannelTypes[]){
    return this._channelTypes.splice(index, deleteCount, ...options);
  }

  toOceanic(): ChannelSelectMenu {
    if(!this._customId){
      throw new Error("No customId specifed")
    }
    return {
      customID: this._customId,
      disabled: this.disabled,
      maxValues: !this._maxValues && this._minValues ? this._channelTypes.length : this._maxValues,
      minValues: this._minValues,
      channelTypes: this._channelTypes,
      placeholder: this._placeholder,
      type: this._type,
    }
  }
}

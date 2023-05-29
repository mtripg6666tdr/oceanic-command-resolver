import { ButtonComponent, ComponentTypes, Constants, NullablePartialEmoji, PartialEmoji } from "oceanic.js";
import { MessageActionRowComponentsBuilder } from "./actionRowComponent";

export type ButtonStyles = 
  |"PRIMARY"
  |"SECONDARY"
  |"SUCCESS"
  |"DANGER"
  |"LINK"
;

/**
 * a helper to build Button for oceanic.js
 */
export class MessageButtonBuilder extends MessageActionRowComponentsBuilder<ButtonComponent> {
  private _customId:string|undefined = undefined;
  private _disabled:boolean = false;
  private _emoji:NullablePartialEmoji|undefined = undefined;
  private _label:string|undefined = undefined;
  private _style:ButtonStyles|undefined = undefined;
  private _type:ComponentTypes.BUTTON = ComponentTypes.BUTTON;
  private _url:string|undefined = undefined;

  constructor(_data?:ButtonComponent){
    super();
    if(_data){
      if(_data.style === Constants.ButtonStyles.LINK){
        this._url = _data.url;
      }else{
        this._customId = _data.customID;
      }
      this._disabled = _data.disabled || false;;
      this._emoji = _data.emoji;
      this._label = _data.label;
      this._style = (Object.keys(Constants.ButtonStyles) as (keyof typeof Constants["ButtonStyles"])[]).find(key => Constants.ButtonStyles[key] === _data.style);
    }
  }

  get customId(){
    return this._customId;
  }

  get disabled(){
    return this._disabled;
  }

  get emoji(){
    return this._emoji;
  }

  get label(){
    return this._label;
  }

  get style(){
    return this._style;
  }

  get type(){
    return this._type;
  }

  get url(){
    return this._url;
  }

  setCustomId(customId:string){
    this._customId = customId;
    return this;
  }

  setDisabled(disabled:boolean = true){
    this._disabled = disabled;
    return this;
  }

  setEmoji(emoji:string|Partial<PartialEmoji>){
    if(typeof emoji === "string"){
      if(!emoji) throw new Error("invalid emoji");
      this._emoji = {
        name: emoji,
        id: null,
      }
    }else{
      if(!emoji.name) throw new Error("invalid emoji");
      this._emoji = Object.assign({
        id: null,
      }, emoji) as PartialEmoji;
    }
    return this;
  }

  setLabel(label:string){
    this._label = label;
    return this;
  }

  setStyle(style:ButtonStyles){
    this._style = style;
    return this;
  }

  setUrl(url:string){
    this._url = url;
    return this;
  }

  toOceanic(): ButtonComponent {
    if(this.style === "LINK"){
      if(!this._url){
        throw new Error("No url specified");
      }
      return {
        type: this._type,
        disabled: this._disabled,
        emoji: this._emoji,
        label: this._label,
        style: Constants.ButtonStyles.LINK,
        url: this._url,
      };
    }else{
      if(!this._customId){
        throw new Error("No customId specified");
      }
      return {
        type: this._type,
        disabled: this._disabled,
        emoji: this._emoji,
        label: this._label,
        style: Constants.ButtonStyles[this._style! as Exclude<ButtonStyles, "LINK">],
        customID: this._customId,
      };
    }
  }
}

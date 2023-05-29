import type { ComponentTypes, MentionableSelectMenu, RoleSelectMenu, UserSelectMenu } from "oceanic.js";


import { MessageActionRowComponentsBuilder } from "./actionRowComponent";

/**
 * a helper to build SelectMenu for oceanic.js
 */
export class MessageInputSelectMenuBuilder extends MessageActionRowComponentsBuilder<UserSelectMenu | MentionableSelectMenu | RoleSelectMenu>{
  private _customId: string|undefined;
  private _disabled: boolean|undefined;
  private _maxValues: number|undefined;
  private _minValues: number|undefined;
  private _placeholder: string|undefined;
  private readonly _type: ComponentTypes.USER_SELECT | ComponentTypes.MENTIONABLE_SELECT | ComponentTypes.ROLE_SELECT = 0 as any;

  constructor(_type: ComponentTypes.USER_SELECT | ComponentTypes.MENTIONABLE_SELECT | ComponentTypes.ROLE_SELECT);
  constructor(_data: UserSelectMenu | MentionableSelectMenu | RoleSelectMenu);
  constructor(_data: number | UserSelectMenu | MentionableSelectMenu | RoleSelectMenu){
    super();
    if(typeof _data === "number"){
      this._type = _data;
    }else if(_data){
      this._customId = _data.customID;
      this._disabled = _data.disabled;
      this._maxValues = _data.maxValues;
      this._minValues = _data.minValues;
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

  get placeholder(){
    return this._placeholder;
  }

  get type(){
    return this._type;
  }

  setCustomId(customId: string){
    this._customId = customId;
    return this;
  }

  setDisabled(disabled: boolean = true){
    this._disabled = disabled;
    return this;
  }

  setMaxValues(maxValues: number){
    this._maxValues = maxValues;
    return this;
  }

  setMinValues(minValues: number){
    this._minValues = minValues;
    return this;
  }

  setPlaceholder(placeholder: string){
    this._placeholder = placeholder;
    return this;
  }

  toOceanic(): UserSelectMenu | MentionableSelectMenu | RoleSelectMenu {
    if(!this._customId){
      throw new Error("No customId specifed");
    }
    return {
      customID: this._customId,
      disabled: this.disabled,
      maxValues: this._maxValues,
      minValues: this._minValues,
      placeholder: this._placeholder,
      type: this._type,
    };
  }
}

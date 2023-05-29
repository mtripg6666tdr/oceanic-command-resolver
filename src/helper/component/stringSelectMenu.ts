import type { SelectOption, StringSelectMenu } from "oceanic.js";

import { ComponentTypes } from "oceanic.js";

import { MessageActionRowComponentsBuilder } from "./actionRowComponent";

/**
 * a helper to build SelectMenu for oceanic.js
 */
export class MessageStringSelectMenuBuilder extends MessageActionRowComponentsBuilder<StringSelectMenu>{
  private _customId: string|undefined;
  private _disabled: boolean|undefined;
  private _maxValues: number|undefined;
  private _minValues: number|undefined;
  private _options: SelectOption[] = [];
  private _placeholder: string|undefined;
  private readonly _type: ComponentTypes.STRING_SELECT = ComponentTypes.STRING_SELECT;

  constructor(_data?: StringSelectMenu){
    super();
    if(_data){
      this._customId = _data.customID;
      this._disabled = _data.disabled;
      this._maxValues = _data.maxValues;
      this._minValues = _data.minValues;
      this._options = _data.options.map(obj => Object.assign({}, obj));
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

  get options(): Readonly<SelectOption[]>{
    return this._options;
  }

  get placeholder(){
    return this._placeholder;
  }

  get type(){
    return this._type;
  }

  addOptions(...options: SelectOption[]){
    (this._options = this._options || []).push(...options);
    return this;
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

  setOptions(...options: SelectOption[]){
    this._options = options;
    return this;
  }

  setPlaceholder(placeholder: string){
    this._placeholder = placeholder;
    return this;
  }

  spliceOptions(index: number, deleteCount: number, ...options: SelectOption[]){
    return this._options.splice(index, deleteCount, ...options);
  }

  toOceanic(): StringSelectMenu {
    if(!this._customId){
      throw new Error("No customId specifed");
    }
    return {
      customID: this._customId,
      disabled: this.disabled,
      maxValues: !this._maxValues && this._minValues ? this._options.length : this._maxValues,
      minValues: this._minValues,
      options: this._options,
      placeholder: this._placeholder,
      type: this._type,
    };
  }
}

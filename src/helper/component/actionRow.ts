import type { MessageActionRowComponentsBuilder } from "./actionRowComponent";
import type { MessageActionRow } from "oceanic.js";

import { ComponentTypes } from "oceanic.js";

import { MessageButtonBuilder } from "./button";
import { HelperBase } from "../base";

export type AnyMessageActionRowComponentsBuilder = MessageActionRowComponentsBuilder<any>;

/**
 * a helper to build ActionRow for oceanic.js
 */
export class MessageActionRowBuilder extends HelperBase<MessageActionRow>{
  private readonly _type: ComponentTypes.ACTION_ROW = ComponentTypes.ACTION_ROW;
  private _components: AnyMessageActionRowComponentsBuilder[] = [];

  get components(): Readonly<AnyMessageActionRowComponentsBuilder[]>{
    return this._components;
  }

  get type(){
    return this._type;
  }

  addComponents(...components: AnyMessageActionRowComponentsBuilder[]){
    this._components.push(...components);
    return this;
  }

  setComponents(...components: AnyMessageActionRowComponentsBuilder[]){
    this._components = components;
    return this;
  }

  spliceComponents(index: number, deleteCount: number, ...components: AnyMessageActionRowComponentsBuilder[]){
    return this._components.splice(index, deleteCount, ...components);
  }

  toOceanic(): MessageActionRow{
    if(this._components.length === 1 || (this._components.every(component => component instanceof MessageButtonBuilder) && this._components.length <= 5)){
      return {
        type: this._type,
        components: this._components.map(component => component.toOceanic()),
      };
    }else{
      throw new Error("Your components don't follow the Discord's component limitation. Each ActionRow can have one SelectMenu or up-to 5 Buttons.");
    }
  }
}

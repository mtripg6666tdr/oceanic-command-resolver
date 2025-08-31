import type { MessageActionRowComponent } from "oceanic.js";

import { HelperBase } from "../base";

export abstract class MessageActionRowComponentsBuilder<T extends MessageActionRowComponent> extends HelperBase<MessageActionRowComponent>{
  abstract override toOceanic(): T;
}

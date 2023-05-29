import type { MessageComponent } from "oceanic.js";

import { HelperBase } from "../base";

export abstract class MessageActionRowComponentsBuilder<T extends MessageComponent> extends HelperBase<MessageComponent>{
  abstract override toOceanic(): T;
}

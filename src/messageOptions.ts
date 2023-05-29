import type { CreateMessageOptions } from "oceanic.js";

export type MessageOptions = CreateMessageOptions & {
  ephemeral?: boolean,
  /**
   * Whether or not editing the message that components attached to
   */
  editOriginalMessage?: boolean,
};

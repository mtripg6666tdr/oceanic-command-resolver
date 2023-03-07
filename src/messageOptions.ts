import type { CreateMessageOptions } from "oceanic.js";

export type MessageOptions = CreateMessageOptions & {
  ephemeral?: boolean,
};

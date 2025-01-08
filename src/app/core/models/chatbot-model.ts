import { DateTime } from "luxon";

export interface ChatBots {
  _id: string;
  intents: number;
  dialog_nodes: number;
  contextVariable: number;
  entities: number;
  name: string;
  language: string;
  description: string;
  created: DateTime;
  companyId: number;
  deleted: boolean;
}

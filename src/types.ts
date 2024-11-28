import { LabelValueDefinitionStrings } from '@atproto/api/dist/client/types/com/atproto/label/defs.js';

export enum LabelType {
  CLASS = 'class',
  LEVEL = 'level',
  HEALTH = 'health',
  MANA = 'mana',
}

export interface Label {
  identifier: string;
  type: LabelType;
  locales: LabelValueDefinitionStrings[];
}

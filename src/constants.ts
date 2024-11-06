import { Label } from './types.js';

export const WARRIOR_CLASS_LABEL: Label =   {
  identifier: 'warrior',
  locales: [
    { lang: 'en', name: 'Warrior ⚔️', description: 'This user is a warrior.'},
  ]
}

export const MAGE_CLASS_LABEL: Label =   {
  identifier: 'mage',
  locales: [
    { lang: 'en', name: 'Mage 🧙', description: 'This user is a mage.'},
  ]
}

export const HEALER_CLASS_LABEL: Label =   {
  identifier: 'healer',
  locales: [
    { lang: 'en', name: 'Healer 💚', description: 'This user is a healer.'},
  ]
}

export const ROGUE_CLASS_LABEL: Label =   {
  identifier: 'rogue',
  locales: [
    { lang: 'en', name: 'Rogue 🥷🏻', description: 'This user is a rogue.'},
  ]
}

export const MAX_LEVEL_LABEL: Label =   {
  identifier: 'max-level',
  locales: [
    { lang: 'en', name: 'Max Level', description: 'This user is the maximum level.'},
  ]
}

export const LEVEL_80_LABEL: Label =   {
  identifier: 'level-80',
  locales: [
    { lang: 'en', name: 'Level 80+', description: 'This user is level 80 to 99.'},
  ]
}

export const LEVEL_50_LABEL: Label =   {
  identifier: 'level-50',
  locales: [
    { lang: 'en', name: 'Level 50+', description: 'This user is level 50 to 79.'},
  ]
}

export const LEVEL_30_LABEL: Label =   {
  identifier: 'level-30',
  locales: [
    { lang: 'en', name: 'Level 30+', description: 'This user is level 30 to 49.'},
  ]
}

export const LEVEL_10_LABEL: Label =   {
  identifier: 'level-10',
  locales: [
    { lang: 'en', name: 'Level 10+', description: 'This user is level 10 to 29.'},
  ]
}

export const LEVEL_0_LABEL: Label =   {
  identifier: 'level-0',
  locales: [
    { lang: 'en', name: '< Level 10', description: 'This user is level 10 or less.'},
  ]
}

export const MAX_HEALTH_LABEL: Label =   {
  identifier: 'max-hp',
  locales: [
    { lang: 'en', name: 'Max HP', description: 'This user has maximum health points.'},
  ]
}

export const HIGH_HEALTH_LABEL: Label =   {
  identifier: 'high-hp',
  locales: [
    { lang: 'en', name: 'High HP', description: 'This user has more than half of their health points.'},
  ]
}

export const LOW_HEALTH_LABEL: Label =   {
  identifier: 'low-hp',
  locales: [
    { lang: 'en', name: 'Low HP', description: 'This user has less than half of their health points.'},
  ]
}

export const MAX_MANA_LABEL: Label =   {
  identifier: 'max-mana',
  locales: [
    { lang: 'en', name: 'Max Mana', description: 'This user has maximum mana points.'},
  ]
}

export const HIGH_MANA_LABEL: Label =   {
  identifier: 'high-mana',
  locales: [
    { lang: 'en', name: 'High Mana', description: 'This user has more than half of their mana points.'},
  ]
}

export const LOW_MANA_LABEL: Label =   {
  identifier: 'low-mana',
  locales: [
    { lang: 'en', name: 'Low Mana', description: 'This user has less than half of their mana points.'},
  ]
}

export const LABELS: Label[] = [
  WARRIOR_CLASS_LABEL,
  MAGE_CLASS_LABEL,
  HEALER_CLASS_LABEL,
  ROGUE_CLASS_LABEL,
  MAX_LEVEL_LABEL,
  LEVEL_80_LABEL,
  LEVEL_50_LABEL,
  LEVEL_30_LABEL,
  LEVEL_10_LABEL,
  LEVEL_0_LABEL,
  MAX_HEALTH_LABEL,
  HIGH_HEALTH_LABEL,
  LOW_HEALTH_LABEL,
  MAX_MANA_LABEL,
  HIGH_MANA_LABEL,
  LOW_MANA_LABEL,
];

export const ITEM_TYPES = {
  DRINK: 'drink',
  FOOD: 'food',
  BOTTLE: 'bottle',
  SERVICE: 'service', // 指名料など
  OTHER: 'other',
} as const;

export type ItemType = typeof ITEM_TYPES[keyof typeof ITEM_TYPES];
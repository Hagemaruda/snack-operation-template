export const SALARY_ITEM_TYPE = {
  HOURLY: 'hourly',
  SALES_BACK: 'sales_back',
  DRINK_BACK: 'drink_back',
  ACCOMPANY_BACK: 'accompany_back',
  TRANS: 'transportation_fee',
  DEDUCTION: 'deduction',
} as const;

export type SalaryItemType = typeof SALARY_ITEM_TYPE[keyof typeof SALARY_ITEM_TYPE];

export const SALARY_ITEM_LABELS = {
  [SALARY_ITEM_TYPE.HOURLY]: '時給',
  [SALARY_ITEM_TYPE.SALES_BACK]: '売上バック',
  [SALARY_ITEM_TYPE.DRINK_BACK]: 'ドリンクバック',
  [SALARY_ITEM_TYPE.ACCOMPANY_BACK]: '同伴バック',
  [SALARY_ITEM_TYPE.TRANS]: '交通費',
  [SALARY_ITEM_TYPE.DEDUCTION]: '控除',
} as const;
import type { ItemType } from "../constants/itemTypes";

export interface SlipItem {
  id: string;
  type: ItemType;
  name: string;
  unitPrice: number;
  back: number; // 💡 デフォルト（標準）のバック額
}
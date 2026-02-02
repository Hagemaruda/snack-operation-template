import { format, addMinutes, startOfMinute } from 'date-fns';
import { SHOP_CONFIG } from '../constants/config';

//  次の１５分単位の時刻を取得
/**
 * @description
 *    getNext15MinSlot
 *      時刻（Date型）を受け取って、次の15分単位の時刻を返す（hh:mm：string）
 * @param {Date}  date - 時刻（getMinuteにより時刻情報のみ使用）
 * @returns 15分単位に調整されて hh:mm に成形された文字列
 */
export const getNext15MinSlot = (date: Date): string => {
  const m = date.getMinutes();
  const diff = (15 - (m % 15)) % 15;
  const adjustedDate = addMinutes(startOfMinute(date), diff === 0 ? 0 : diff);
  return format(adjustedDate, 'HH:mm');
};

//　時刻、分をもらって時刻をXX:XXの形に整形
export const formatTimeDisplay = (h: number, m: number): string => {
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
};

//  営業日を取得
export const getBusinessDate = (date: Date): Date => {

  const hhmm = date.toLocaleTimeString('ja-JP', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false // 24時間表示
  });

  const businessDate = new Date(date);

  if (hhmm < SHOP_CONFIG.BUISINESSDATE_CHANGE_TIME) {
    businessDate.setDate(businessDate.getDate() - 1);
  }
  return businessDate;
};

export const getBusinessDateStr = (date: Date): string => format(getBusinessDate(date), 'yyyyMMdd');
export const getBusinessDateDashStr = (date: Date): string => format(getBusinessDate(date), 'yyyy-MM-dd');

// --- 追加・整理した関数 ---

/**
 * 10:00起点での経過分数を取得
 */
export const getMinutesFromBusinessStart = (timeStr: string): number => {
  if (!timeStr) return 0;
  const [h, m] = timeStr.split(':').map(Number);
  const total = h * 60 + m;

  const [sh, sm] = SHOP_CONFIG.BUISINESSDATE_CHANGE_TIME.split(':').map(Number);

  const BASE = sh * 60 + sm;
  return total >= BASE ? total - BASE : (total + 1440) - BASE;
};

/**
 * 10:00起点の経過分数から "HH:mm" 文字列に変換
 * これがあると、スワイプ後のバリデーションが楽になります
 */
export const formatBusinessTimeFromMinutes = (totalMinutes: number): string => {
  let normalized = totalMinutes % 1440;
  if (normalized < 0) normalized += 1440;

  const [sh, sm] = SHOP_CONFIG.BUISINESSDATE_CHANGE_TIME.split(':').map(Number);
  
  const BASE = sh * 60 + sm;

  const actualMinutes = (normalized + BASE) % 1440;
  
  const h = Math.floor(actualMinutes / 60);
  const m = actualMinutes % 60;
  return formatTimeDisplay(h, m);
};

export const compareBusinessTime = (timeA: string, timeB: string): number => {
  return getMinutesFromBusinessStart(timeA) - getMinutesFromBusinessStart(timeB);
};

//  次の営業日切り替わり（午前10時）までのミリ秒を計算する関数
//  オプション引数を指定すると、その時刻までのミリ秒を返す（HH:MM）
export const getMsUntilNextBusinessWindow = (now: Date = new Date(), toTime?: string ): number => {
    const target = new Date(now);

    const [sh, sm] = SHOP_CONFIG.BUISINESSDATE_CHANGE_TIME.split(':').map(Number);

    if (now.getHours() > sh || (now.getHours() === sh && now.getMinutes() >= sm)) {
        target.setDate(now.getDate() + 1);
    }
    if(toTime){
      const [h, m] = toTime.split(':').map(Number);
      target.setHours( h, m, 0, 0);
    } else {
      target.setHours( sh, sm, 0, 0);
    }
    return target.getTime() - now.getTime();
};
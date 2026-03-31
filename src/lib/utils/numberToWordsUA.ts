const ones = ['', 'один', 'два', 'три', 'чотири', "п'ять", 'шість', 'сім', 'вісім', "дев'ять"];
const onesFem = ['', 'одна', 'дві', 'три', 'чотири', "п'ять", 'шість', 'сім', 'вісім', "дев'ять"];
const teens = ['десять', 'одинадцять', 'дванадцять', 'тринадцять', 'чотирнадцять', "п'ятнадцять", 'шістнадцять', 'сімнадцять', 'вісімнадцять', "дев'ятнадцять"];
const tens = ['', '', 'двадцять', 'тридцять', 'сорок', "п'ятдесят", 'шістдесят', 'сімдесят', 'вісімдесят', "дев'яносто"];
const hundreds = ['', 'сто', 'двісті', 'триста', 'чотириста', "п'ятсот", 'шістсот', 'сімсот', 'вісімсот', "дев'ятсот"];

function pluralize(n: number, one: string, few: string, many: string): string {
  const abs = Math.abs(n) % 100;
  const lastDigit = abs % 10;
  if (abs >= 11 && abs <= 19) return many;
  if (lastDigit === 1) return one;
  if (lastDigit >= 2 && lastDigit <= 4) return few;
  return many;
}

function convertGroup(n: number, feminine: boolean): string {
  const parts: string[] = [];
  const h = Math.floor(n / 100);
  const remainder = n % 100;
  const t = Math.floor(remainder / 10);
  const o = remainder % 10;

  if (h > 0) parts.push(hundreds[h]);

  if (remainder >= 10 && remainder <= 19) {
    parts.push(teens[remainder - 10]);
  } else {
    if (t > 0) parts.push(tens[t]);
    if (o > 0) parts.push(feminine ? onesFem[o] : ones[o]);
  }

  return parts.join(' ');
}

export function numberToWordsUA(amount: number): string {
  if (amount === 0) return 'Нуль';

  const hryvni = Math.floor(amount);
  const kopiyky = Math.round((amount - hryvni) * 100);

  if (hryvni === 0) {
    return `Нуль гривень ${String(kopiyky).padStart(2, '0')} копійок`;
  }

  const parts: string[] = [];

  const millions = Math.floor(hryvni / 1_000_000);
  const thousands = Math.floor((hryvni % 1_000_000) / 1_000);
  const rest = hryvni % 1_000;

  if (millions > 0) {
    parts.push(convertGroup(millions, false));
    parts.push(pluralize(millions, 'мільйон', 'мільйони', 'мільйонів'));
  }

  if (thousands > 0) {
    parts.push(convertGroup(thousands, true)); // тисяча — feminine
    parts.push(pluralize(thousands, 'тисяча', 'тисячі', 'тисяч'));
  }

  if (rest > 0) {
    parts.push(convertGroup(rest, false));
  }

  const hryvniWord = pluralize(hryvni, 'гривня', 'гривні', 'гривень');
  const result = parts.join(' ') + ' ' + hryvniWord + ' ' + String(kopiyky).padStart(2, '0') + ' копійок';

  return result.charAt(0).toUpperCase() + result.slice(1);
}

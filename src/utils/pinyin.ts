import { pinyin } from 'pinyin-pro';
import { PinyinPart } from '../types';

const initials = [
  'b', 'p', 'm', 'f', 'd', 't', 'n', 'l',
  'g', 'k', 'h', 'j', 'q', 'x',
  'zh', 'ch', 'sh', 'r',
  'z', 'c', 's',
  'y', 'w'
];

const specialFinals = ['er'];

const finals = [
  'a', 'o', 'e', 'i', 'u', 'ü',
  'ai', 'ei', 'ao', 'ou',
  'an', 'en', 'ang', 'eng', 'ong',
  'ia', 'ie', 'iao', 'iou', 'ian', 'in', 'iang', 'ing', 'iong',
  'ua', 'uo', 'uai', 'uei', 'uan', 'un', 'uang',
  'üe', 'üan', 'ün'
];

function removeTone(pinyinStr: string): string {
  const toneMap: { [key: string]: string } = {
    'ā': 'a', 'á': 'a', 'ǎ': 'a', 'à': 'a',
    'ē': 'e', 'é': 'e', 'ě': 'e', 'è': 'e',
    'ī': 'i', 'í': 'i', 'ǐ': 'i', 'ì': 'i',
    'ō': 'o', 'ó': 'o', 'ǒ': 'o', 'ò': 'o',
    'ū': 'u', 'ú': 'u', 'ǔ': 'u', 'ù': 'u',
    'ǖ': 'ü', 'ǘ': 'ü', 'ǚ': 'ü', 'ǜ': 'ü', 'ü': 'ü',
    'ń': 'n', 'ň': 'n', 'ǹ': 'n',
    'ḿ': 'm'
  };
  
  let result = '';
  for (const char of pinyinStr) {
    result += toneMap[char] || char;
  }
  return result;
}

function getTone(pinyinStr: string): number {
  const toneChars: { [key: string]: number } = {
    'ā': 1, 'ē': 1, 'ī': 1, 'ō': 1, 'ū': 1, 'ǖ': 1,
    'á': 2, 'é': 2, 'í': 2, 'ó': 2, 'ú': 2, 'ǘ': 2,
    'ǎ': 3, 'ě': 3, 'ǐ': 3, 'ǒ': 3, 'ǔ': 3, 'ǚ': 3,
    'à': 4, 'è': 4, 'ì': 4, 'ò': 4, 'ù': 4, 'ǜ': 4,
    'ń': 2, 'ň': 3, 'ǹ': 4, 'ḿ': 2
  };
  
  for (const char of pinyinStr) {
    if (toneChars[char]) {
      return toneChars[char];
    }
  }
  return 0;
}

export function parsePinyin(char: string): PinyinPart {
  const pinyinResult = pinyin(char, { toneType: 'symbol' });
  
  if (!pinyinResult || pinyinResult.length === 0) {
    return { initial: '', final: '', tone: 0, full: '' };
  }
  
  const fullPinyin = pinyinResult.toLowerCase();
  const tone = getTone(fullPinyin);
  const noTonePinyin = removeTone(fullPinyin);
  
  let initial = '';
  let finalPart = noTonePinyin;
  
  for (const init of initials) {
    if (noTonePinyin.startsWith(init)) {
      if (init === 'y' || init === 'w') {
        if (noTonePinyin === 'yi' || noTonePinyin === 'wu' || 
            noTonePinyin === 'yin' || noTonePinyin === 'wen' ||
            noTonePinyin === 'ying' || noTonePinyin === 'weng') {
          initial = '';
          finalPart = noTonePinyin.substring(1);
          if (finalPart === 'i') finalPart = 'i';
          else if (finalPart === 'u') finalPart = 'u';
          else if (finalPart === 'n') finalPart = 'in';
          else if (finalPart === 'ng') finalPart = 'ing';
          else if (finalPart === 'en') finalPart = 'en';
          else if (finalPart === 'eng') finalPart = 'eng';
        } else {
          initial = '';
          if (noTonePinyin.startsWith('yi')) {
            finalPart = 'i' + noTonePinyin.substring(2);
          } else if (noTonePinyin.startsWith('yu')) {
            finalPart = 'ü' + noTonePinyin.substring(2);
          } else if (noTonePinyin.startsWith('ya')) {
            finalPart = 'ia' + noTonePinyin.substring(2);
          } else if (noTonePinyin.startsWith('ye')) {
            finalPart = 'ie' + noTonePinyin.substring(2);
          } else if (noTonePinyin.startsWith('yao')) {
            finalPart = 'iao' + noTonePinyin.substring(3);
          } else if (noTonePinyin.startsWith('you')) {
            finalPart = 'iou' + noTonePinyin.substring(3);
          } else if (noTonePinyin.startsWith('yan')) {
            finalPart = 'ian' + noTonePinyin.substring(3);
          } else if (noTonePinyin.startsWith('yang')) {
            finalPart = 'iang' + noTonePinyin.substring(4);
          } else if (noTonePinyin.startsWith('yong')) {
            finalPart = 'iong' + noTonePinyin.substring(4);
          } else if (noTonePinyin.startsWith('wa')) {
            finalPart = 'ua' + noTonePinyin.substring(2);
          } else if (noTonePinyin.startsWith('wo')) {
            finalPart = 'uo' + noTonePinyin.substring(2);
          } else if (noTonePinyin.startsWith('wai')) {
            finalPart = 'uai' + noTonePinyin.substring(3);
          } else if (noTonePinyin.startsWith('wei')) {
            finalPart = 'uei' + noTonePinyin.substring(3);
          } else if (noTonePinyin.startsWith('wan')) {
            finalPart = 'uan' + noTonePinyin.substring(3);
          } else if (noTonePinyin.startsWith('wang')) {
            finalPart = 'uang' + noTonePinyin.substring(4);
          }
        }
      } else {
        initial = init;
        finalPart = noTonePinyin.substring(init.length);
      }
      break;
    }
  }
  
  if (specialFinals.includes(noTonePinyin)) {
    initial = '';
    finalPart = noTonePinyin;
  }
  
  if (finalPart === 'iu') finalPart = 'iou';
  if (finalPart === 'ui') finalPart = 'uei';
  if (finalPart === 'un') {
    if (initial === 'j' || initial === 'q' || initial === 'x') {
      finalPart = 'ün';
    } else {
      finalPart = 'uen';
    }
  }
  
  return {
    initial,
    final: finalPart,
    tone,
    full: fullPinyin
  };
}

export function getPinyinParts(text: string): PinyinPart[] {
  const parts: PinyinPart[] = [];
  for (const char of text) {
    parts.push(parsePinyin(char));
  }
  return parts;
}

export function getDisplayPinyin(pinyinPart: PinyinPart): string {
  return pinyinPart.full || '';
}

// Helpers for admin textareas where each line is "a | b | c"
export const toLines = (arr = [], keys) => arr.map((o) => keys.map((k) => o[k] ?? '').join(' | ')).join('\n');
export const fromLines = (text = '', keys) =>
  text.split('\n').map((l) => l.trim()).filter(Boolean).map((l) => {
    const parts = l.split('|').map((s) => s.trim());
    const obj = {};
    keys.forEach((k, i) => { obj[k] = i === keys.length - 1 ? parts.slice(i).join(' | ') : parts[i] || ''; });
    return obj;
  });

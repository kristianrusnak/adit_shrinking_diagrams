import { deflateRaw } from "pako";

function normalizeInput(puml: string): string {
  return puml.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
}

function encode6bit(b: number): string {
  if (b < 10) return String.fromCharCode(48 + b);
  b -= 10;
  if (b < 26) return String.fromCharCode(65 + b);
  b -= 26;
  if (b < 26) return String.fromCharCode(97 + b);
  b -= 26;
  if (b === 0) return "-";
  if (b === 1) return "_";
  return "?";
}

function append3bytes(b1: number, b2: number, b3: number): string {
  const c1 = b1 >> 2;
  const c2 = ((b1 & 0x3) << 4) | (b2 >> 4);
  const c3 = ((b2 & 0xf) << 2) | (b3 >> 6);
  const c4 = b3 & 0x3f;

  return (
    encode6bit(c1 & 0x3f) +
    encode6bit(c2 & 0x3f) +
    encode6bit(c3 & 0x3f) +
    encode6bit(c4 & 0x3f)
  );
}

function encode64(data: string): string {
  let result = "";

  for (let i = 0; i < data.length; i += 3) {
    if (i + 2 === data.length) {
      result += append3bytes(data.charCodeAt(i), data.charCodeAt(i + 1), 0);
    } else if (i + 1 === data.length) {
      result += append3bytes(data.charCodeAt(i), 0, 0);
    } else {
      result += append3bytes(
        data.charCodeAt(i),
        data.charCodeAt(i + 1),
        data.charCodeAt(i + 2),
      );
    }
  }

  return result;
}

export function encodePlantUml(puml: string): string {
  const compressed = deflateRaw(normalizeInput(puml), { level: 9 });
  let deflated = "";
  for (let i = 0; i < compressed.length; i++) {
    deflated += String.fromCharCode(compressed[i]);
  }
  return encode64(deflated);
}

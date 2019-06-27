// color -> number
/**
 * 17-24位表示红色的分量
 * 9-16位表示绿色的分量
 * 1-8位表示蓝色的分量
 * @param color {number 0x}
 */
export function createColor(color) {
  if (typeof color === "undefined") {
    const rr = (Math.random() * 0x80) | 0;
    const rg = (Math.random() * 0x80) | 0;
    const rb = (Math.random() * 0x80) | 0;
    return (rr << 16) + (rg << 8) + rb;
  }
  return (
    color +
    (random0x(0xefefef) << 16) +
    (random0x(0xefefef) << 8) +
    random0x(0xefefef)
  );
}

function random0x(num = 0, d = 10) {
  return Math.random() * d * (Math.random() > 0.5 ? 1 : -1) + num;
}

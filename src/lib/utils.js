export const shorten = (str, length = 50, suffix = "...") =>
  `${str.slice(0, length)}${str.length - 1 > length ? suffix : ""}`;

export const pol2car = (a, r) => {
  return {
    x: Math.cos((a - 90) * (Math.PI / 180)) * r,
    y: Math.sin((a - 90) * (Math.PI / 180)) * r,
  };
};

export const car2pol = (x, y) => {
  return {
    a: Math.atan2(y, x) * (180 / Math.PI),
    r: Math.sqrt(x * x + y * y),
  };
};

export const map = (value, start1, stop1, start2, stop2) => {
  return ((value - start1) / (stop1 - start1)) * (stop2 - start2) + start2;
};

export const translate = (x = 0, y = 0) => `translate(${x} ${y})`;

export const rotate = (a = 0, originX = 0, originY = 0) =>
  `rotate(${a} ${originX} ${originY})`;

export const scale = (scaleX = 1, scaleY = 1) =>
  `scale(${a} ${scaleX} ${scaleY})`;

export const shuffle = (arr) => arr.sort(() => Math.random() - 0.5);

export const any = (arr) => shuffle(arr)[0];

export const random = (from = 0, to = 1) => from + Math.random() * (to - from);

export const randomint = (from = 0, to = 1) => Math.floor(random(from, to));

export const rgba = (r, g, b, a = 1) => `rgba(${r},${g},${b},${a})`;

export const hsla = (h, s = 100, l = 50, a = 1) =>
  `hsla(${h},${s}%,${l}%,${a})`;

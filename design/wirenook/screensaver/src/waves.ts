// A traveling swell plus a softer ripple keeps the contours fluid, not rigid.
export function wavePath(index: number, seconds: number) {
  const baseline = 130 + index * 38;
  const points = [];
  for (let x = -80; x <= 1520; x += 16) {
    const y =
      baseline +
      Math.sin(x * 0.0055 - seconds * 0.65 + index * 0.13) * 54 +
      Math.sin(x * 0.0105 - seconds * 0.95 + index * 0.19) * 15;
    points.push(`${x},${y.toFixed(2)}`);
  }
  return `M${points.join(" L")}`;
}

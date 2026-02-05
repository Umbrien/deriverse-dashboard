export function buildLinePath(
  data: Array<{ value: number }>,
  width: number,
  height: number,
  min: number,
  max: number,
) {
  if (!data.length) return "";
  const range = max - min || 1;
  return data
    .map((point, index) => {
      const x = (index / Math.max(1, data.length - 1)) * width;
      const y = height - ((point.value - min) / range) * height;
      return `${index === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
}

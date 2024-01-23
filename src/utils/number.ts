/**
 * Clamps a value between a minimum and maximum value.
 *
 * @param {number} value - The value to be clamped.
 * @param {number} min - The minimum value.
 * @param {number} max - The maximum value.
 * @return {number} The clamped value.
 */
export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}
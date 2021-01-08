import { Rng, UniformIntRng } from "@aicacia/rand";

export function getIntRngForNDigits(
  ndigits: number,
  rng: Rng
): UniformIntRng<Rng> {
  const min = Math.pow(10, ndigits - 1),
    max = Math.pow(10, ndigits) - 1;

  return rng.uniformIntRng(min, max);
}

export function getIntegerPlaceValues(x: number) {
  const parts = x.toString().split(""),
    digits = parts.length,
    placeValuesPowers = [];

  for (let i = 0; i < digits; i++) {
    const power = digits - i - 1;
    const p = parseInt(parts[i], 10) * Math.pow(10, power);
    placeValuesPowers.push(p);
  }

  return placeValuesPowers;
}

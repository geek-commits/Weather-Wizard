/**
 * Custom cursor — 28×28 SVG arrow, black fill, white stroke ~2.05556,
 * embedded soft shadow, hotspot 5 4. Data URI via encodeURIComponent.
 */

// Supplied vector arrow treatment — preserved path
export const CURSOR_PATH =
  "M5.08838 4.5 L19.245 13.72 L12.68 13.72 L15.62 21.68 L10.18 24.02 L7.48 15.24 L3.02 15.24 Z";

const svg = `<svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg"><defs><filter id="ww-cursor-shadow" x="-20%" y="-20%" width="140%" height="140%" color-interpolation-filters="sRGB"><feOffset dy="1" in="SourceAlpha" result="off"/><feGaussianBlur in="off" stdDeviation="2" result="blur"/><feComposite in="blur" in2="SourceAlpha" operator="out" result="comp"/><feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" result="alpha"/><feBlend in="alpha" in2="SourceGraphic" mode="normal"/></filter></defs><path d="${CURSOR_PATH}" fill="black" stroke="white" stroke-width="2.05556" stroke-linejoin="round" filter="url(#ww-cursor-shadow)"/></svg>`;

export const CURSOR_SVG_DATA_URI = `url("data:image/svg+xml,${encodeURIComponent(svg)}") 5 4, auto`;

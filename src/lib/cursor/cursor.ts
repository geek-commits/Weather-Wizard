/**
 * Custom cursor — 32×32 display, 24 viewBox arrowhead, black fill,
 * hotspot 3 0. Data URI via encodeURIComponent.
 */

// Supplied arrowhead vector — verbatim as provided
export const CURSOR_PATH = "M4.5.79v22.42l6.56-6.57h9.29L4.5.79z";

const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 24 24'><path fill='#000' d='${CURSOR_PATH}'/></svg>`;

export const CURSOR_SVG_DATA_URI = `url("data:image/svg+xml,${encodeURIComponent(svg)}") 3 0, auto`;

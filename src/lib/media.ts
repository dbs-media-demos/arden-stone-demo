/**
 * Keep in sync with the `phone`, `still` and `pin` variants in globals.css.
 * `phone`: the stacked phone layout (below 768 px, or touch below 1024 px).
 * `still`: no pinning, scrubbing, parallax or smooth scrolling (below 768 px, or any touch screen).
 */
export const PHONE_MEDIA = "(max-width: 767.98px), (hover: none) and (max-width: 1023.98px), (pointer: coarse) and (max-width: 1023.98px)";
export const STILL_MEDIA = "(max-width: 767.98px), (hover: none), (pointer: coarse)";
/** Everything that is not `phone`: for hero assets only the desktop layout uses. */
export const NOT_PHONE_MEDIA = "(min-width: 1024px), (min-width: 768px) and (hover: hover) and (pointer: fine)";

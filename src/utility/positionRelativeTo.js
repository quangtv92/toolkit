/**
 * @copyright   2010-2017, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 * @flow
 */

/* eslint max-params: 0, array-bracket-spacing: 0 */

type AxisPositions =
  'top' | 'top-left' | 'top-right' | 'left' |
  'right' | 'bottom' | 'bottom-left' | 'bottom-right';

type OffsetStruct = {
  left: number,
  top: number,
};

/**
 * Calculate `top` and `left` values to position an element relative to another element using
 * absolute positioning.
 */
export default function positionRelativeTo(
  position: AxisPositions,
  sourceElement: HTMLElement,
  relativeTo: HTMLElement | MouseEvent,
  baseOffset: OffsetStruct = { left: 0, top: 0 },
): OffsetStruct {
  const srcSize = sourceElement.getBoundingClientRect();
  const srcWidth = srcSize.width;
  const srcHeight = srcSize.height;
  let { top, left } = baseOffset;
  let [edgeY, edgeX] = position.split('-');
  let relSize = {};
  let relTop = 0;
  let relHeight = 0;
  let relWidth = 0;

  // Fix the x axis
  if (edgeY === 'left' || edgeY === 'right') {
    edgeX = edgeY;
    edgeY = null;
  }

  // If an event is used, position it near the mouse
  if (relativeTo instanceof MouseEvent) {
    top += relativeTo.pageY;
    left += relativeTo.pageX;

  // Else position it relative to the element
  } else {
    relSize = relativeTo.getBoundingClientRect();
    relHeight = relSize.height;
    relWidth = relSize.width;
    relTop = relSize.top + window.scrollY;

    top += relTop;
    left += relSize.left;
  }

  // Shift around based on edge positioning
  if (edgeY === 'top') {
    top -= srcHeight;
  } else if (edgeY === 'bottom') {
    top += relHeight;
  } else {
    top -= Math.round((srcHeight / 2) - (relHeight / 2));
  }

  if (edgeX === 'left') {
    left -= srcWidth;
  } else if (edgeX === 'right') {
    left += relWidth;
  } else {
    left -= Math.round((srcWidth / 2) - (relWidth / 2));
  }

  // Shift again to keep it within the viewport
  if (left < 0) {
    left = 0;
  } else if ((left + srcWidth) > window.outerWidth) {
    left = window.outerWidth - srcWidth;
  }

  if (top < 0) {
    top = 0;
  } else if ((top + srcHeight) > (window.outerHeight + window.scrollY)) {
    top = relTop - srcHeight;
  }

  return {
    left,
    top,
  };
}
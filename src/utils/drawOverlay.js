/**
 * Draw an overlay.
 * @param {Object} viewer
 *   The viewer.
 * @param {String} id
 *   An ID for the overlay.
 * @param {Object} rect
 *   Overlay coordinates.
 * @param {String} cls
 *   Additional overlay class.
 */
export default function (viewer, id, rect, type = '') {
  if (!viewer.addOverlay) {
    return
  }
  console.log('overlayRect', rect)
  const el = document.createElement('div')
  el.dataset.id = id
  el.classList.add('overlay')
  el.style.zIndex = '1'
  if (type === 'selection') {
    el.style.border = '2px solid #3498DB'
    el.style.backgroundColor = 'rgba(#3498DB, 0.2)'
    el.style.opacity = '.6'
  }
  viewer.addOverlay({ element: el, location: rect })
}

/**
 * https://github.com/mirari/vue-fullscreen/blob/master/src/utils.js
 */

export function isSupportFullscreen() {
  const element = document.documentElement

  return (
    'requestFullscreen' in element ||
    ('mozRequestFullScreen' in element && document.mozFullScreenEnabled) ||
    ('msRequestFullscreen' in element && document.msFullscreenEnabled) ||
    'webkitRequestFullScreen' in element
  )
}

export function requestFullscreen(element) {
  if (element.requestFullscreen) {
    element.requestFullscreen()
  } else if (element.webkitRequestFullscreen) {
    element.webkitRequestFullscreen()
  } else if (element.mozRequestFullScreen) {
    element.mozRequestFullScreen()
  } else if (element.msRequestFullscreen) {
    element.msRequestFullscreen()
  } else {
    // console.log('Fullscreen API is not supported.')
  }
}

export function isFullscreen() {
  if (
    document.fullscreen ||
    document.mozFullScreen ||
    document.fullscreenElement ||
    document.msFullscreenElement ||
    document.webkitIsFullScreen
  ) {
    return true
  } else {
    return false
  }
}

export function exitFullscreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen()
  } else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen()
  } else if (document.mozCancelFullScreen) {
    document.mozCancelFullScreen()
  } else if (document.msExitFullscreen) {
    document.msExitFullscreen()
  } else {
    // console.log('Fullscreen API is not supported.')
  }
}

export function toggleFullscreen(element) {
  if (!isFullscreen()) {
    requestFullscreen(element || document.documentElement)
  } else {
    exitFullscreen()
  }
}

export function onFullscreen(callback) {
  document.addEventListener('fullscreenchange', callback)
  document.addEventListener('mozfullscreenchange', callback)
  document.addEventListener('MSFullscreenChange', callback)
  document.addEventListener('webkitfullscreenchange', callback)
}

export function offFullscreen(callback) {
  document.removeEventListener('fullscreenchange', callback)
  document.removeEventListener('mozfullscreenchange', callback)
  document.removeEventListener('MSFullscreenChange', callback)
  document.removeEventListener('webkitfullscreenchange', callback)
}

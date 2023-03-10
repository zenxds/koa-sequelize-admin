import { getPublicPath } from './getPublicPath'

export function isMobileDevice() {
  return /iPhone|iPad|iPod|Android|mobile/i.test(navigator.userAgent) || screen.width < 640
}

export function getHashPath(href = window.location.href) {
  // We can't use window.location.hash here because it's not
  // consistent across browsers - Firefox will pre-decode it!
  const hashIndex = href.indexOf('#')
  return hashIndex === -1 ? '' : href.substring(hashIndex + 1).split('?')[0]
}

export function getQueryString(name) {
  const reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i')
  const r = window.location.search.substr(1).match(reg)
  if (r != null) {
    return unescape(r[2])
  }
  return null
}

// https://stackoverflow.com/questions/15900485/correct-way-to-convert-size-in-bytes-to-kb-mb-gb-in-javascript/23625419
export function formatBytes(bytes, decimals) {
  if (bytes == 0) {
    return '0 Bytes'
  }

  let k = 1024
  let dm = decimals || 2
  let sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  let i = Math.floor(Math.log(bytes) / Math.log(k))

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}

export * from './lang'
export * from './getPopupContainer'

export {
  getPublicPath,
}

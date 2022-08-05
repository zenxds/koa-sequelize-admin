export const API_SERVER = window.API_SERVER || location.pathname.endsWith('/') ? location.pathname.slice(0, -1) : location.pathname

export const API_CONFIG = '/api/config'

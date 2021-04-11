interface PPT {
  localUrl: string
  requestUrl: string
  wsUrl: string
}
const PPT: PPT = {
  localUrl: location.href,
  requestUrl: '',
  wsUrl: ''
}
const env = (PPT.localUrl.indexOf('dev') > -1 || PPT.localUrl.indexOf('localhost') > -1) && PPT.localUrl.indexOf('pro') === -1 ? 'dev' : ''
PPT.requestUrl = env === 'dev' ? 'https://dev.api.newzealand.actself.me/' : 'https://api.newzealand.actself.me/'
PPT.wsUrl = env === 'dev' ? 'wss://dev.ws.newzealand.actself.me' : 'wss://ws.newzealand.actself.me'

export default PPT

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
PPT.requestUrl = env === 'dev' ? 'https://api.app.classcipe.com/' : 'https://api.app.classcipe.com/'
PPT.wsUrl = env === 'dev' ? 'wss://ws.app.classcipe.com' : 'wss://ws.app.classcipe.com'

export default PPT

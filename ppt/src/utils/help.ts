/* 生成组件随机id */
export const generateUuid = (prefix: string, length?: number) => {
  const uuidStr = 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'
  const len = !length ? uuidStr.length : length
  let date = Date.now()
  const uuid = uuidStr.replace(/[xy]/g, (c) => {
    const r = (date + Math.random() * 16) % 16 | 0 // eslint-disable-line no-bitwise
    date = Math.floor(date / 16)
    return (c === 'x' ? r : (r & 0x7 | 0x8)).toString(16) // eslint-disable-line no-bitwise
  })
  const id = `${!prefix ? '' : prefix}${uuid.slice(0, len)}`
  // // console.log(id)
  return id
}

export const getUrlParam = (queryKey: string): string => {
  const temp1 = location.href.split('?');
  const pram = temp1[1];
  if (!pram) return ''
  const keyValue = pram.split('&');
  const obj: any = {};
  for (let i = 0; i < keyValue.length; i++) {
    const item = keyValue[i].split('=');
    const key = item[0];
    const value = item[1];
    obj[key] = value;
  }
  return obj[queryKey]
}

export const getTimeValue = (value: number) => {
  const date = new Date(value)
  return {
    year: date.getFullYear(),
    month: `0${date.getMonth() + 1}`.substr(-2),
    date: `0${date.getDate()}`.substr(-2),
    hours: `0${date.getHours()}`.substr(-2),
    minutes: `0${date.getMinutes()}`.substr(-2),
    seconds: `0${date.getSeconds()}`.substr(-2),
  }
}

export const getAnswerTimeStr = (time: number) => {
  if(!time) return ''
  const {
    year,
    month,
    date,
    hours,
    minutes
  } = getTimeValue(time)
  return `${year}-${month}-${date} ${hours}:${minutes}`
}

export const getJSONValue = (res: any) => {
  if(!res) return {}
  if(Object.prototype.toString.call(res) === "[object Object]") return res
  let data = {}
  try {
    data = JSON.parse(res)
  } catch(e) {}
  return data
}

export const getHashCode = (hashString: any) => {
  if(typeof hashString === 'object') {
    hashString = JSON.stringify(hashString)
  }
  let result = hashString.split("").reduce((a, b) => { a = ((a << 5) - a) + b.charCodeAt(0); return a&a }, 0);
  console.log('hashKey', result)
  return result.toString()
}

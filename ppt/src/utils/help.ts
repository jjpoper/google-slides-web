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
  return `${!prefix ? '' : prefix}${uuid.slice(0, len)}`
}

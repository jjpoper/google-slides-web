export const saveStore = (key: string, value: any) => {
  localStorage.setItem(key, JSON.stringify(value))
}
export const getStore = (key: string) => {
  const value = localStorage.getItem(key)
  return value && value !== 'undefined' && value !== 'null' ? JSON.parse(value) : null
}

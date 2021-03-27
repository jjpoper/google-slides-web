const UID_KEY_NAME = 'UID_KEY_NAME'
export const getTeacherUid = () => {
  return localStorage.getItem(`${UID_KEY_NAME}_teacher`)
}
export const setTeacherUid = (uid: string) => {
  return localStorage.setItem(`${UID_KEY_NAME}_teacher`, uid)
}
export const getStudentUid = () => {
  return localStorage.getItem(`${UID_KEY_NAME}_student`)
}
export const setStudentUid = (uid: string) => {
  return localStorage.setItem(`${UID_KEY_NAME}_student`, uid)
}

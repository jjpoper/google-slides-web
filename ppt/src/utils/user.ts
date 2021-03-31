import {getUrlParam} from './help'

const UID_KEY_NAME = 'UID_KEY_NAME'
export const getTeacherUid = () => {
  return localStorage.getItem(`${getUrlParam("slide_id")}_${UID_KEY_NAME}_teacher`)
}
export const setTeacherUid = (uid: string) => {
  return localStorage.setItem(`${getUrlParam("slide_id")}_${UID_KEY_NAME}_teacher`, uid)
}
export const getStudentUid = () => {
  return localStorage.getItem(`${getUrlParam("slide_id")}_${UID_KEY_NAME}_student`)
}
export const setStudentUid = (uid: string) => {
  return localStorage.setItem(`${getUrlParam("slide_id")}_${UID_KEY_NAME}_student`, uid)
}
export const getUserName = (uid: string) => {
  return localStorage.getItem(`${getUrlParam("slide_id")}_student_${uid}`)
}
export const setUserName = (uid: string, name: string) => {
  return localStorage.setItem(`${getUrlParam("slide_id")}_student_${uid}`, name)
}

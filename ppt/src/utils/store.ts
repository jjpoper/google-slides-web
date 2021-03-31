import {getUrlParam} from './help'
// 学生答案缓存
const STUDENTS_ANSWER = 'STUDENTS_ANSWER'
let storeUid = ''
export const setStoreUid = (uid: string) => {
  storeUid = uid
}

export const saveStudentsAnswer = (itemid: string, answer: string) => {
  localStorage.setItem(`${getUrlParam("slide_id")}_${storeUid}_${STUDENTS_ANSWER}_${itemid}`, answer)
}

export const getStudentsAnswer = (itemid: string) => {
  const data = localStorage.getItem(`${getUrlParam("slide_id")}_${storeUid}_${STUDENTS_ANSWER}_${itemid}`) || ''
  let value = parseInt(data)
  return isNaN(value) ? null : value
}

const TEACHER_ANSWER = 'TEACHER_ANSWER'
export const saveTeacherAlist = (itemid: string, answerList: any[]) => {
  localStorage.setItem(`${getUrlParam("slide_id")}_${storeUid}_${TEACHER_ANSWER}_${itemid}`, JSON.stringify(answerList))
}
export const getTeacherAlist = (itemid: string) => {
  let listString = localStorage.getItem(`${getUrlParam("slide_id")}_${storeUid}_${TEACHER_ANSWER}_${itemid}`) || ''
  let arr = []
  try {
    arr = JSON.parse(listString)
  } catch(e) {
    // console.log(e)
  }
  return arr
}

import { getUrlParam } from './help'
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

export const saveStudentsDataList = (id: string, arr: any[], type: string) => {
  console.log(JSON.stringify(arr))
  localStorage.setItem(`${getUrlParam("slide_id")}_${storeUid}_${id}_${type}`, JSON.stringify(arr))
}

export const getStudentsDataList = (id: string, type: string) => {
  let data = localStorage.getItem(`${getUrlParam("slide_id")}_${storeUid}_${id}_${type}`) || ''
  let arr = []
  try {
    arr = JSON.parse(data)
  } catch (e) {
    // console.log(e)
  }
  return arr
}
export const getNumberList = function (pageId: string, type: string) {
  let arr = getStudentsDataList(pageId, type);
  if (arr && arr.length > 0) {
    return arr;
  }
  arr.push({ value: 0, id: "0" });
  return arr;
}
const TEACHER_ANSWER = 'TEACHER_ANSWER'
export const saveTeacherAlist = (itemid: string, answerList: any[]) => {
  localStorage.setItem(`${getUrlParam("slide_id")}_${storeUid}_${TEACHER_ANSWER}_${itemid}`, JSON.stringify(answerList))
}

export const saveTeacherDatalist = (itemid: string, answerList: any[], type: string) => {
  console.log("save number==" + JSON.stringify(answerList) + "  type ==" + type)
  localStorage.setItem(`${getUrlParam("slide_id")}_${storeUid}_${type}_${itemid}`, JSON.stringify(answerList))
}
export const getTeacherDatalist = (itemid: string, type: string) => {
  let listString = localStorage.getItem(`${getUrlParam("slide_id")}_${storeUid}_${type}_${itemid}`) || ''
  console.log(JSON.stringify(listString) + "  type ==" + type)
  let arr = []
  try {
    arr = JSON.parse(listString)
  } catch (e) {
    // console.log(e)
  }
  return arr
}
export const getTeacherAlist = (itemid: string) => {
  let listString = localStorage.getItem(`${getUrlParam("slide_id")}_${storeUid}_${TEACHER_ANSWER}_${itemid}`) || ''
  let arr = []
  try {
    arr = JSON.parse(listString)
  } catch (e) {
    // console.log(e)
  }
  return arr
}

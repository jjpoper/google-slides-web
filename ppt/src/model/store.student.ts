// 学生端缓存信息
import { getStore, saveStore } from '@/utils/localStore'
import { generateUuid, getUrlParam } from '../utils/help'
import {getCurrentPageStudentAnswerList, addStudentData} from './data.student'
import {getStudentCurrentItemCommentList, addStudentCommentData} from './comment.student'

const slideId = getUrlParam("slide_id")
const UID_KEY = `${slideId}_sid`
let studentId = ''

// 学生端数据结构
// key: slideId_studentid
// {
//   userName: '',
//   userId: '',
//   answerList: [
//     {
//       type: '',
//       id: '',
//       text: '',
//       number: ''
//     }
//   ]
// }

export const getStudentStoreToken = (): string => {
  return getStore('student_token')
}

export const saveStudentStoreToken = (token: string) => {
  saveStore('student_token', token)
}
// 拼接url 参数
const saveStudentStore = (key: string, value: any) => {
  const uniqueKey = `${slideId}_s_${studentId}_${key}`
  saveStore(uniqueKey, value)
}

const getStudentStore = (key: string): any => {
  const uniqueKey = `${slideId}_s_${studentId}_${key}`
  return getStore(uniqueKey)
}

export const getStudentUid = (): string => {
  let sid = getStore(UID_KEY)
  if(!sid) {
    // 自动生成并存储
    sid = generateUuid("s_", 16);
    saveStore(UID_KEY, sid)
  }
  studentId = sid
  return sid
}

export const getStudentUserName = (): string => {
  return getStudentStore(`uname`)
}

export const saveStudentUserName = (uname: string) => {
  saveStudentStore(`uname`, uname)
}

// 获取学生端当前page的回答列表信息
export const getStudentCurrentPageAnswerList = (pageId: string, type: string) => {
  // const list = getStudentStore(`c_p_a_${pageId}_${type}`)
  // @ts-ignore
  const newl = getCurrentPageStudentAnswerList(pageId, type)
  // console.log(newl, '=========')
  return newl && newl.length > 0 ? newl : []
}

interface SavaParams {
  key: string
  [key: string]: any
}

// 存储学生回答的信息
export const saveStudentsCurrentPageAnswerList = (pageId: string, type: string, data: SavaParams) => {
  // const {key} = data
  // const storeList = getStudentCurrentPageAnswerList(pageId, type)
  // // 筛选已有答案
  // const filterData = storeList.filter((item: any) => item.key !== key);
  // filterData.push(data);
  // console.log(filterData);
  // saveStudentStore(`c_p_a_${pageId}_${type}`, filterData);
  addStudentData(pageId, type, {...data, user_id: studentId})
}

interface StudentCommentItem {
  studentId: string,
  pageId: string,
  itemId: string,
  title: string,
  time: string,
  value: string,
  teacherName: string,
  slideIndex: string
}

// 学生端评论列表
export const getStudentCommentList = (): StudentCommentItem[] => {
  const list = getStudentCurrentItemCommentList()
  return list && list.length > 0 ? list : []
}
// 存储学生端评论列表
export const addStudentComment = (data: StudentCommentItem) => {
  // const list = getStudentCommentList()
  // // const {itemId} = data
  // // const idItem = list.filter(item => item.itemId === itemId)[0]
  // // if(idItem) {
  // //   // 已存在。push到 items
  // //   idItem.items.push(data.items)
  // // }
  // list.unshift(data)
  // saveStudentStore('commentList', list)
  addStudentCommentData(data)
}

// 已读状态 true 表示有未读 false 没有未读
export const getStudentCommentUnReadStatus = (): boolean => {
  return getStudentStore(`comment_status`) === '1'
}
export const unreadStudentComment = () => {
  saveStudentStore('comment_status', '1')
}
export const readStudentComment = () => {
  saveStudentStore('comment_status', '0')
}

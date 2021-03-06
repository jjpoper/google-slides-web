/* eslint-disable eqeqeq */
/* eslint-disable @typescript-eslint/camelcase */
// 学生端缓存信息
import { getStore, saveStore } from '@/utils/localStore'
import { generateUuid } from '../utils/help'
import { getTeacherCurrentPageAnswerList, getStudentsName, addTeacherData } from './data.teacher'

let slideId = ''
let UID_KEY = ''
let teacherId = ''

export const initTeacherStoreSlideId = (id: string) => {
  slideId = id
  UID_KEY = `${slideId}_tid`
}

export const getTeacherClientStoreToken = (): string => {
  return getStore('teacher_token_Client')
}

export const saveTeacherClientStoreToken = (token: string) => {
  saveStore('teacher_token_Client', token)
}

export const getTeacherStoreToken = (): string => {
  return getStore('teacher_token')
}

export const saveTeacherStoreToken = (token: any) => {
  saveStore('teacher_token', Array.isArray(token) ? token[0] : token)
}

// 拼接url 参数
const saveTeacherStore = (key: string, value: any) => {
  const uniqueKey = `${slideId}_t_${teacherId}_${key}`
  saveStore(uniqueKey, value)
}

const getTeacherStore = (key: string): any => {
  const uniqueKey = `${slideId}_t_${teacherId}_${key}`
  const result = getStore(uniqueKey)
  // console.log(uniqueKey, result)
  return result
}

export const getTeacherUid = (): string => {
  let sid = getStore(UID_KEY)
  if (!sid) {
    // 自动生成并存储
    sid = generateUuid("t_", 16);
    saveStore(UID_KEY, sid)
  }
  teacherId = sid
  return sid
}

export const getTeacherUserName = (): string => {
  // @ts-ignore
  return window.currentTeacherName
}

// 存储所有学生用户id和用户名关系表
export const getStundentUidAndName = (uid: string) => {
  return getStudentsName(uid)
}

interface TeacherCommentItem {
  teacher: string
  time: string
  value: string
  studentId: string
  pageId: string
  itemId: string
  title: string
}

// 获取学生端当前page的回答列表信息
export const getCurrentPageAnswerList = (pageId: string, type: string) => {
  // @ts-ignore
  return getTeacherCurrentPageAnswerList(pageId, type).reverse()
}

interface SavaParams {
  key: string
  [key: string]: any
}

// 存储老师端学生回答的信息
export const saveStudentsPageAnswerList = (pageId: string, type: string, data: SavaParams) => {
  // const { key } = data
  // const storeList = getCurrentPageAnswerList(pageId, type)
  // // 筛选已有答案
  // const filterData = storeList.filter((item: any) => item.key !== key);
  // filterData.push(data);
  // saveTeacherStore(`c_p_a_${pageId}_${type}`, filterData);
  addTeacherData(pageId, type, data)
}

export const saveAnswerList = (pageId: string, type: string, data: any) => {
  saveTeacherStore(`c_p_a_${pageId}_${type}`, data);
}

export const saveStepOneStatus = (user_id: string, isHide: string) => {
  localStorage.setItem(`stepone_${user_id}`, isHide)
}

export const getStepOneStatus = (user_id: string) => {
  const result = localStorage.getItem(`stepone_${user_id}`) || ''
  return result && result == "true";
}

/* eslint-disable @typescript-eslint/camelcase */
// 学生端缓存信息
import { getStore, saveStore } from '@/utils/localStore'
import { generateUuid, getUrlParam } from '../utils/help'
import { getTeacherCurrentPageAnswerList, getStudentsName, addTeacherData } from './data.teacher'
import { getTeacherCurrentItemCommentList, addTeacherCommentData } from './comment.teacher'

const slideId = getUrlParam("slide_id")
const UID_KEY = `${slideId}_tid`
let teacherId = ''

export const getTeacherStoreToken = (): string => {
  return getStore('teacher_token')
}

export const saveTeacherStoreToken = (token: string) => {
  saveStore('teacher_token', token)
}

// 拼接url 参数
const saveTeacherStore = (key: string, value: any) => {
  const uniqueKey = `${slideId}_t_${teacherId}_${key}`
  saveStore(uniqueKey, value)
}

const getTeacherStore = (key: string): any => {
  const uniqueKey = `${slideId}_t_${teacherId}_${key}`
  const result = getStore(uniqueKey)
  console.log(uniqueKey, result)
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

// 老师端评价列表 pageid_studentid_answerid 为key
// @ts-ignore
export const getTeacherCommentList = ({ pageId, itemId, studentId }): TeacherCommentItem[] => {
  const list = getTeacherCurrentItemCommentList(pageId, itemId, studentId)
  return list && list.length > 0 ? list : []
}

// @ts-ignore
export const addTeacherComment = (data: ANY) => {
  // const key = `comment_${pageId}_${itemId}_${studentId}`
  // const list = addTeacherCommentData(data)
  // list.unshift(data)
  // saveTeacherStore(key, list)
  addTeacherCommentData(data)
}

// 获取学生端当前page的回答列表信息
export const getCurrentPageAnswerList = (pageId: string, type: string) => {
  // @ts-ignore
  return getTeacherCurrentPageAnswerList(pageId, type)
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


export const saveStepOneStatus = (class_id: string, slide_id: string, isHide: string) => {
  localStorage.setItem(`stepone_${class_id}_${slide_id}`, isHide)
}

export const getStepOneStatus = (class_id: string, slide_id: string) => {
  const result = localStorage.getItem(`stepone_${class_id}_${slide_id}`) || ''
  return result && result == "true";
}

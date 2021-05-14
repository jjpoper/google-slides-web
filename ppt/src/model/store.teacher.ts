/* eslint-disable @typescript-eslint/camelcase */
// 学生端缓存信息
import { getStore, saveStore } from '@/utils/localStore'
import { generateUuid, getUrlParam } from '../utils/help'
import {getTeacherCurrentPageAnswerList, getStudentsName, addTeacherData} from './data.teacher'

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
  return getTeacherStore(`uname`) || 'Mr Wang'
}

export const saveTeacherUserName = (uname: string) => {
  saveTeacherStore(`uname`, uname)
}

// 存储所有学生用户id和用户名关系表
export const saveStundentUidAndName = (uid: string, name: string) => {
  saveTeacherStore(`t_and_s_${uid}`, name)
}

// 存储所有学生用户id和用户名关系表
export const getStundentUidAndName = (uid: string) => {
  return getStudentsName(uid)
}

interface TeacherCommentItem {
  teacher: string
  time: string
  value: string
}

// 老师端评价列表 pageid_studentid_answerid 为key
// @ts-ignore
export const getTeacherCommentList = ({ pageId, itemId, studentId }): TeacherCommentItem[] => {
  const list = getTeacherStore(`comment_${pageId}_${itemId}_${studentId}`)
  return list && list.length > 0 ? list : []
}

// @ts-ignore
export const addTeacherComment = ({ pageId, itemId, studentId }, data: TeacherCommentItem) => {
  const key = `comment_${pageId}_${itemId}_${studentId}`
  const list = getTeacherCommentList({ pageId, itemId, studentId })
  list.unshift(data)
  saveTeacherStore(key, list)
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

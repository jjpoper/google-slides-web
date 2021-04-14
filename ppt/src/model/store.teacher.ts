/* eslint-disable @typescript-eslint/camelcase */
// 学生端缓存信息
import { getStore, saveStore } from '@/utils/localStore'
import { generateUuid, getUrlParam } from '../utils/help'

const slideId = getUrlParam("slide_id")
const UID_KEY = `${slideId}_tid`
let teacherId = ''

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
  if(!sid) {
    // 自动生成并存储
    sid = generateUuid("t_", 16);
    saveStore(UID_KEY, sid)
  }
  teacherId = sid
  return sid
}

export const getTeacherUserName = (): string => {
  return getTeacherStore(`uname`)
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
  return getTeacherStore(`t_and_s_${uid}`)
}

interface TeacherCommentItem {
  index: number
  content: string
  items: {
    teacher: string
    time: string
    content: string
  }[]
}

// 老师端评价列表 pageid_studentid_answerid 为key
export const getTeacherCommentList = (key: string): TeacherCommentItem[] => {
  const list = getTeacherStore(`comment_${key}`)
  return list && list.length > 0 ? list : []
}

export const addTeacherComment = (data: TeacherCommentItem) => {
  const list = getTeacherCommentList()
  list.push(data)
  saveTeacherStore('comment', data)
}

// 获取学生端当前page的回答列表信息
export const getCurrentPageAnswerList = (pageId: string) => {
  const list = getTeacherStore(`c_p_a_${pageId}`)
  return list && list.length > 0 ? list : []
}

// 存储老师端学生回答的信息
export const saveStudentsPageAnswerList = (pageId: string, data: any) => {
  const {user_id} = data
  const storeList = getCurrentPageAnswerList(pageId)
  // 筛选已有答案
  const filterData = storeList.filter((item: any) => item.user_id !== user_id);
  filterData.push(data);
  console.log(filterData);
  saveTeacherStore(`c_p_a_${pageId}`, filterData);
}

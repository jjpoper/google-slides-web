// 学生端缓存信息
import { getStore, saveStore } from '@/utils/localStore'
import { generateUuid, getUrlParam } from '../utils/help'

const slideId = getUrlParam("slide_id")
let teacherId = ''

// 拼接url 参数
const saveTeacherStore = (key: string, value: any) => {
  const uniqueKey = `${slideId}_t_${teacherId}_${key}`
  saveStore(uniqueKey, value)
}

const getTeacherStore = (key: string): any => {
  const uniqueKey = `${slideId}_t_${teacherId}_${key}`
  getStore(uniqueKey)
}

export const setTeacherUid = (uid: string) => {
  saveTeacherStore('uid', uid)
}

export const getTeacherUid = (): string => {
  let sid = getTeacherStore('uid')
  if(!sid) {
    // 自动生成并存储
    sid = generateUuid("t_", 16);
    setTeacherUid(sid)
  }
  return sid
}

export const getTeacherUserName = (): string => {
  return getTeacherStore(`uname`)
}

export const saveTeacherUserName = (uname: string) => {
  saveTeacherStore(`uname`, uname)
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

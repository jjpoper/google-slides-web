// 学生端缓存信息
import { getStore, saveStore } from '@/utils/localStore'
import { generateUuid, getUrlParam } from '../utils/help'

const slideId = getUrlParam("slide_id")
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
// 拼接url 参数
const saveStudentStore = (key: string, value: any) => {
  const uniqueKey = `${slideId}_s_${studentId}_${key}`
  saveStore(uniqueKey, value)
}

const getStudentStore = (key: string): any => {
  const uniqueKey = `${slideId}_s_${studentId}_${key}`
  getStore(uniqueKey)
}

export const setStudentUid = (uid: string) => {
  saveStudentStore('uid', uid)
}

export const getStudentUid = (): string => {
  let sid = getStudentStore('uid')
  if(!sid) {
    // 自动生成并存储
    sid = generateUuid("s_", 16);
    setStudentUid(sid)
  }
  return sid
}

export const getStudentUserName = (): string => {
  return getStudentStore(`uname`)
}

export const saveStudentUserName = (uname: string) => {
  saveStudentStore(`uname`, uname)
}

interface StudentCommentItem {
  index: number
  id: string // pageid_answerid
  content: string
  items: {
    teacher: string
    time: string
    content: string
  }[]
}

// 学生端评价列表
export const getStudentCommentList = (): StudentCommentItem[] => {
  const list = getStudentStore(`comment`)
  return list && list.length > 0 ? list : []
}
// 需要区分是 新的 StudentCommentItem 还是 StudentCommentItem.items
export const addStudentComment = (data: StudentCommentItem) => {
  const list = getStudentCommentList()
  const {id} = data
  const idItem = list.filter(item => item.id === id)[0]
  if(idItem) {
    // 已存在。push到 items
    idItem.items.push(data.items)
  }
  list.push(data)
  saveStudentStore('comment', data)
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

import {getStudentAllComments} from './index'

interface StudentCommentItem {
  class_id?: string
  data: string
  id?: number
  student_user_id?: string
  teacher_user_id?: string
}

interface OriginStudentCommnet {
  room: string
  time: string
  type: string
  title: string
  value: string
  itemId: string
  pageId: string
  studentId: string
  slideIndex: string
  teacherName: string
}

let studentAllCommentList: StudentCommentItem[] = []

export const initStudentCommentData = async (classId: string, token: string) => {
  const list = await getStudentAllComments(classId, token)
  studentAllCommentList = list
  const mapData = studentAllCommentList.map((item) => {
    return {
      ...JSON.parse(item.data),
      ...item,
    }
  })
  return mapData
}

// 老师端新增数据
export const addStudentCommentData = (oldData: any) => {
  const data = {
    data: JSON.stringify(oldData)
  }
  studentAllCommentList.unshift(data)
  // // console.log(data, 'StudentAllCommentList')
}

// 获取老师端评论数据
export const getStudentCurrentItemCommentList = () => {
  const mapData = studentAllCommentList.map((item) => {
    return {
      ...JSON.parse(item.data)
    }
  })
  // // console.log(mapData, '=====')
  return mapData
}

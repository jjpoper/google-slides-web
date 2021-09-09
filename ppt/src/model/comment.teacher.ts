import {getTeacherAllComments} from './index'

interface TeacherCommentItem {
  class_id?: string
  data: string
  id?: number
  student_user_id?: string
  teacher_user_id?: string
}

interface OriginTeacherCommnet {
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

let teacherAllCommentList: TeacherCommentItem[] = []

export const initTeacherCommentData = async (classId: string, token: string) => {
  const list = await getTeacherAllComments(classId, token)
  teacherAllCommentList = list
  return list
}

// 老师端新增数据
export const addTeacherCommentData = (oldData: any) => {
  const data = {
    data: JSON.stringify(oldData)
  }
  teacherAllCommentList.unshift(data)
  // // console.log(data, 'teacherAllCommentList')
}

// 获取老师端评论数据
export const getTeacherCurrentItemCommentList = (pageId: string, itemId: string, studentId: string) => {
  const filterData = teacherAllCommentList.filter(item => {
    const data: OriginTeacherCommnet = JSON.parse(item.data)
    if(pageId === data.pageId && studentId === data.studentId && (!itemId || itemId === data.itemId)) {
      return true
    }
    return false
  })
  const mapData = filterData.map((item) => {
    // console.log(item, '=====')
    return {
      ...JSON.parse(item.data),
      // @ts-ignore
      teacherName: window.currentTeacherName
    }
  })
  return mapData
}

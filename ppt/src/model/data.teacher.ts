import {getTeacherClassAnswers} from './index'

type ItemType = "text" | "draw" | "choice" | 'number'

interface TeacherDataItem {
  class_id: string
  data: string
  id: number
  item_id: string
  page_id: string
  student_user_id: string
  type: ItemType
}

let teacherData: TeacherDataItem[] = []

export const initTeacherData = async (classId: string, token: string) => {
  const list = await getTeacherClassAnswers(classId, token)
  teacherData = list
  return list
}

// 老师端新增数据
export const addTeacherData = (pageId: string, type: string, oldData: any) => {
  const data = {
    ...oldData,
    // @ts-ignore
    class_id: window.classId,
    data: JSON.stringify(oldData),
    page_id: pageId,
    student_user_id: oldData.user_id,
    type
  }
  const {item_id: itemId} = data
  let oldDataIndex = -1
  if(type === 'choice' || type === 'number' || type === 'draw') {
    // 一条答案数据，去重
    oldDataIndex = teacherData.findIndex(item => item.page_id === pageId)
  } else {
    oldDataIndex = teacherData.findIndex(item => item.page_id === pageId && item.item_id === itemId)
  }

  if(oldDataIndex > -1) {
    teacherData[oldDataIndex] = data
  } else {
    teacherData.push(data)
  }
}

// 获取老师端数据量
export const getTeacherCurrentPageAnswerList = (pageId: string, type: ItemType) => {
  const filterData = teacherData.filter(item => item.page_id === pageId && item.type === type)
  const mapData = filterData.map((item) => {
    return {
      ...JSON.parse(item.data),
      star: false,
      show: true
    }
  })
  // console.log(mapData, '=====')
  return mapData
}

// 获取学生姓名
export const getStudentsName = (uid: string) => {
  const data = teacherData.filter(item => item.student_user_id === uid)[0]
  return data ? JSON.parse(data.data).user_name : ''
}
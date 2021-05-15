import {getStudentClassAnswers} from './index'

type ItemType = "text" | "draw" | "choice" | 'number'

interface StudentDataItem {
  class_id: string
  data: string
  id: number
  item_id: string
  page_id: string
  student_user_id: string
  type: ItemType
}

let studentData: StudentDataItem[] = []

export const initStudentData = async (classId: string, token: string) => {
  const list = await getStudentClassAnswers(classId, token)
  studentData = list
  return list
}

// 老师端新增数据
export const addStudentData = (pageId: string, type: string, oldData: any) => {
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
    oldDataIndex = studentData.findIndex(item => item.page_id === pageId)
  } else {
    oldDataIndex = studentData.findIndex(item => item.page_id === pageId && item.item_id === itemId)
  }

  if(oldDataIndex > -1) {
    studentData[oldDataIndex] = data
  } else {
    studentData.push(data)
  }
}

// 获取老师端数据量
export const getCurrentPageStudentAnswerList = (pageId: string, type: ItemType) => {
  const filterData = studentData.filter(item => item.page_id === pageId && item.type === type)
  const mapData = filterData.map((item) => {
    return {
      ...JSON.parse(item.data),
      star: false,
      show: true
    }
  })
  // console.log(mapData, '=====')
  return mapData || []
}

// 获取学生姓名
export const getStudentsName = (uid: string) => {
  const data = studentData.filter(item => item.student_user_id === uid)[0]
  return data ? JSON.parse(data.data).user_name : ''
}

import axios from 'axios';
import PPT from '../utils/pptConfig'

export const getItem = ({
  slideid,
  pageid,
  itemid
}: any) => {
  return axios.post(`${PPT.requestUrl}slide/items/view`, {
    slide_id: slideid,
    page_id: pageid,
    item_id: itemid
  })
}

// 获取所有的ppt内容
export const getAllPPTS = async (slideid: string) => {
  const data = await axios.post(`${PPT.requestUrl}slide/get_all`, {
    slide_id: slideid,
  })
  let list = data.data.data.pages
  // console.log(data.data.data)
  try {
    // list = data.data.data.pages.filter((item: any) => {
    //   return item.items.type === 'choice'
    // })
  } catch (e) {
    // console.log(e)
  }
  return list
}


//请求后台进行ppt刷新
export const requestRefreshPPT = async (slideid: string, _token: string) => {
  const data = await axios.post(`${PPT.requestUrl}slide/download`, {
    slide_id: slideid,
    token: _token,
  })
  let res = data.data;
  return res;

}

//查询当前课程状态

export const queryClassStatus = async (classId: string, _token: string) => {
  console.log(classId)
  const data = await axios.post(`${PPT.requestUrl}slide/get_class`, {
    class_id: classId,
    token: _token,
  })
  let res = data.data.data;
  return res;
}

//slide/get_task_result


//查询后台ppt更新状态
export const queryRefreshResult = async (taskId: string, _token: string) => {
  const data = await axios.post(`${PPT.requestUrl}slide/get_task_result`, {
    task_id: taskId,
    token: _token,
  })
  let res = data.data;
  return res;

}

//结束课程
export const endClassRoomReq = async (_token: string, name: string, class_id: string) => {
  const data = await axios.post(`${PPT.requestUrl}slide/close_class`, {
    class_name: name,
    class_id: class_id,
    token: _token,
  })
  let res = data.data;
  return res;
}

export const startClassRoomReq = async (author: string, slide_id: string, file_name: string, status: string) => {
  const data = await axios.post(`${PPT.requestUrl}slide/start_lesson`, {
    author: author,
    slide_id: slide_id,
    file_name: file_name,
    status: status,
  })
  let res = data.data.data;
  return res;
}

//评价课堂

export const reopenClass = async (token: string, class_id: string) => {
  const data = await axios.post(`${PPT.requestUrl}slide/reopen_class`, {
    token: token,
    class_id: class_id,
  })
  let res = data.data;
  return res;
}

export const feedbackClass = async (token: string, class_id: string, feed: string) => {
  const data = await axios.post(`${PPT.requestUrl}slide/student_feel`, {
    token: token,
    class_id: class_id,
    feel: feed,
  })
  let res = data.data.data;
  return res;
}



// 获取授权登录
export const getTeacherLoginUrl = async (): Promise<string> => {
  const data = await axios.post(`${PPT.requestUrl}account/get_auth_url_for_teacher`, {
    return_url: location.href,
  })
  let authUrl = ''
  // let list = data.data.data.pages
  // // console.log(data.data.data)
  try {
    authUrl = data.data.data.auth_url
  } catch (e) {
    // console.log(e)
  }
  return authUrl
}

interface Profile {
  profile: {
    email: string
    user_name: string
  }
  logout: boolean
}

// 获取个人信息 account/profile
export const getUserProfile = async (token: string): Promise<Profile> => {
  const data = await axios.post(`${PPT.requestUrl}account/profile`, {
    token,
  })
  let result = {
    profile: {
      email: '',
      user_name: ''
    },
    logout: false
  }
  // let list = data.data.data.pages
  // // console.log(data.data.data)
  try {
    result = data.data.data
  } catch (e) {
    // console.log(e)
  }
  return result
}

// 获取学生授权登录
export const getStudentLoginUrl = async (): Promise<string> => {
  const data = await axios.post(`${PPT.requestUrl}account/get_auth_url_for_student`, {
    return_url: location.href,
  })
  let authUrl = ''
  // let list = data.data.data.pages
  // // console.log(data.data.data)
  try {
    authUrl = data.data.data.auth_url
  } catch (e) {
    // console.log(e)
  }
  return authUrl
}

// 获取学生的答案
export const getTeacherClassAnswers = async (classId: string, token: string) => {
  const data = await axios.post(`${PPT.requestUrl}slide/get_student_response`, {
    class_id: classId,
    role: "teacher",
    token
  })
  let result = []
  // // let list = data.data.data.pages
  // // // console.log(data.data.data)
  try {
    result = data.data.data
  } catch(e) {
    // console.log(e)
  }
  return result
}

// 获取学生的答案
export const getStudentClassAnswers = async (classId: string, token: string) => {

  console.log('=======', 'initStudentData')
  const data = await axios.post(`${PPT.requestUrl}slide/get_student_response`, {
    class_id: classId,
    role: "student",
    token
  })
  let result = []
  // // let list = data.data.data.pages
  // // // console.log(data.data.data)
  try {
    result = data.data.data
  } catch(e) {
    // console.log(e)
  }
  return result
}

// 获取学生的答案
export const getTeacherAllComments = async (classId: string, token: string) => {
  const data = await axios.post(`${PPT.requestUrl}slide/get_comments`, {
    class_id: classId,
    role: "teacher",
    token
  })
  // let authUrl = ''
  // // let list = data.data.data.pages
  // // // console.log(data.data.data)
  // try {
  //   authUrl = data.data.data.auth_url
  // } catch (e) {
  //   // console.log(e)
  // }
  // return authUrl
}
// 获取学生的答案
export const getStudentAllComments = async (classId: string, token: string) => {
  const data = await axios.post(`${PPT.requestUrl}slide/get_comments`, {
    class_id: classId,
    role: "student",
    token
  })
  // let authUrl = ''
  // // let list = data.data.data.pages
  // // // console.log(data.data.data)
  // try {
  //   authUrl = data.data.data.auth_url
  // } catch (e) {
  //   // console.log(e)
  // }
  // return authUrl
}

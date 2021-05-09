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
  } catch(e) {
    // console.log(e)
  }
  return list
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
  } catch(e) {
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
  } catch(e) {
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
  } catch(e) {
    // console.log(e)
  }
  return authUrl
}

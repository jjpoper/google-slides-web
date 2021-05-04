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
// export const getTeacherToken = async (): Promise<string> => {
//   const data = await axios.post(`${PPT.requestUrl}account/get_auth_url_for_teacher`, {
//     return_url: location.href,
//   })
//   let authUrl = ''
//   // let list = data.data.data.pages
//   // // console.log(data.data.data)
//   try {
//     authUrl = data.data.data.auth_url
//   } catch(e) {
//     // console.log(e)
//   }
//   return authUrl
// }

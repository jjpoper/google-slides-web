import axios from 'axios';

export const getItem = ({
  slideid,
  pageid,
  itemid
}: any) => {
  return axios.post('https://api.newzealand.actself.me/slide/items/view', {
    slide_id: slideid,
    page_id: pageid,
    item_id: itemid
  })
}

// 获取所有的ppt内容
export const getAllPPTS = async (slideid: string) => {
  const data = await axios.post('https://api.newzealand.actself.me/slide/get_all', {
    slide_id: slideid,
  })
  let list = data.data.data.pages
  console.log(data.data.data)
  try {
    // list = data.data.data.pages.filter((item: any) => {
    //   return item.items.type === 'choice'
    // })
  } catch(e) {
    // console.log(e)
  }
  return list
}

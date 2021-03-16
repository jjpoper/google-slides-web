import axios from 'axios';

export const getItem = ({
  slideid,
  pageid,
  itemid
}: any) => {
  axios.post('http://api.newzealand.actself.me/slide/items/view', {
    slide_id: slideid,
    page_id: pageid,
    item_id: itemid
  })
}

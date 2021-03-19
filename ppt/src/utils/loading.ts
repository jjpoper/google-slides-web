import { Loading, Notification } from 'element-ui'

let loading: any = null

export const showLoading = () => {
    loading = Loading.service({
        lock: true,
        text: '加载中……',
        background: 'rgba(0, 0, 0, 0.7)'
    })
}
export const hideLoading = () => {
    loading.close()
}

export const showToast = (text: string) => {
  Notification({
    title: '成功',
    message: text,
    type: 'success'
  });
}

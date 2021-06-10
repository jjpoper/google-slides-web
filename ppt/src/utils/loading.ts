import { Loading, Notification } from 'element-ui'

let loading: any = null

export const showLoading = (text = '加载中……') => {
    loading = Loading.service({
        lock: true,
        text,
        background: 'rgba(0, 0, 0, 0.7)'
    })
}
export const hideLoading = () => {
    loading.close()
}

export const showToast = (text: string) => {
  Notification({
    title: 'success',
    message: text,
    type: 'success'
  });
}

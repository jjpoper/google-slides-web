import { Loading, Notification } from 'element-ui'
import { MessageType } from 'element-ui/types/message'

let loading: any = null

export const showLoading = (text = 'loading……') => {
    loading = Loading.service({
        lock: true,
        text,
        background: 'rgba(0, 0, 0, 0.7)'
    })
}
export const hideLoading = () => {
    loading.close()
}

export const showToast = (text: string, type: MessageType = 'success') => {
  Notification({
    title: '',
    message: text,
    type
  });
}

/* eslint-disable func-names */
/* eslint-disable quote-props */
/* eslint-disable no-empty */
/* eslint-disable prefer-template */
/* eslint-disable no-// console */
import { getHashCode } from '@/utils/help';
import { showToast } from '@/utils/loading';
import PPT from '../utils/pptConfig'
import { SocketEventsEnum } from "./socketEvents";

type callback = (d?: any) => void

// 老师端需要补发的消息类型
const RsendSocketTypeMaps: any = {
  'join-room': 'join-room',
  'update-tip': 'update-tip',
  'update-correct-answer': 'update-correct-answer',
  'control': 'control',
  'star': 'star',
  'control-response': 'control-response'
}

interface BaseParams {
  classId: string
  token: string
  uid: string
  uname: string
}

let BaseTeacherParams: BaseParams = {
  classId: '',
  token: '',
  uid: '',
  uname: ''
}

export const setTeacherWxBaseParams = ({
  classId,
  token,
  uid,
  uname,
}: BaseParams) => {
  BaseTeacherParams = {
    classId,
    token,
    uid,
    uname,
  }
}

interface MessageItem {
  action: string
  params: object
  callback: callback
  clientMsgId?: any
}

let windowStudentWs: any = null
let isJoined = false
let heartOK = true
let messageIdPool: any = {}
let lastSocketId = ''
let messageDelayPool: MessageItem[] = []

// 无需补发的消息
const filterSocketTypes = ['heart-beat', 'msg-receipt']

const getMessageId = (action: string, params: object) => {
  let clientMsgId: string | null = null
  if(filterSocketTypes.indexOf(action) === -1) {
    const keyMaps: any = {...params}
    if(action === RsendSocketTypeMaps['join-room']) {
      // 加入房间 只需要补发最后一次消息
      clientMsgId = 'join-room'
    } if(action === RsendSocketTypeMaps.control) {
      // control
      if(keyMaps.params) {
        delete keyMaps.params.result
      }
      clientMsgId = getHashCode(keyMaps)
    } else if(action === RsendSocketTypeMaps['update-tip']) {
      // 添加metarial
      delete keyMaps.tip
      clientMsgId = getHashCode(keyMaps)
    } else if(action === RsendSocketTypeMaps['update-correct-answer']) {
      delete keyMaps.correct_answer
      clientMsgId = getHashCode(keyMaps)
    } else if(action === RsendSocketTypeMaps.star) {
      delete keyMaps.star_type
      clientMsgId = getHashCode(keyMaps)
    } else if(action === RsendSocketTypeMaps['control-response']) {
      delete keyMaps.show_type
      clientMsgId = getHashCode(keyMaps)
    }
    if(clientMsgId) {
      clientMsgId = `${action}${clientMsgId}`
    }
  }
  return clientMsgId
}
// 补发消息需要去重
const pushMessageToDelayPool = (action: string, params: any, callback: callback = () => null) => {
  if(filterSocketTypes.indexOf(action) === -1) {
    const {clientMsgId} = params
    // 如果有id，就去重，没有就不用去重
    if(clientMsgId) {
      const index = messageDelayPool.findIndex(item => item.clientMsgId && item.clientMsgId === clientMsgId)
      const withIdData = {
        action,
        params,
        callback,
        clientMsgId
      }
      if(index > -1) {
        messageDelayPool[index] = withIdData
      } else {
        messageDelayPool.push(withIdData)
      }
    } else {
      messageDelayPool.push({
        action,
        params,
        callback
      })
    }
  }
}

const BaseWsRequest = (action: string, message: object, callback: callback = () => null) => {
  const {
    classId,
    token
  } = BaseTeacherParams
  const params = {
    ...message,
    room: classId,
    token: token,
    class_id: classId,
    clientMsgId: ''
  }
  const clientMsgId = getMessageId(action, JSON.parse(JSON.stringify(params)))
  if(clientMsgId) {
    params.clientMsgId = clientMsgId
  }
  // console.log('socket', action, params)
  if(windowStudentWs && window.isNetWorkOnLine) {
    // 1500ms没收到发送成功回调，需要补发一次
    const checkSuccessTimer = (function () {
      let timer: any = setTimeout(() => {
        pushMessageToDelayPool(action, params)
      }, 1500)
      return () => {
        if(timer) {
          clearTimeout(timer)
          timer = null
        }
      }
    }());
    windowStudentWs.emit(action, JSON.stringify(params), () => {
      callback()
      checkSuccessTimer()
    });
  } else {
    pushMessageToDelayPool(action, params, callback)
  }
}

// 发送未成功发出的消息
const sendDelayMessage = () => {
  let startIndex = 0
  // 防止死循环，最多补发50条
  while(messageDelayPool.length > 0 && window.isNetWorkOnLine && windowStudentWs && startIndex < 50) {
    startIndex++
    const {
      action,
      params,
      callback
    } = messageDelayPool[0]
    BaseWsRequest(action, params, callback)
    messageDelayPool.shift()
  }
  // messageDelayPool = []
}

const rJoinRoom = () => {
  // setInterval(() => {
    const {
      classId,
      token
    } = BaseTeacherParams
    BaseWsRequest(
      'join-room',
      {room: classId, token: token, role: "teacher", class_id: classId, last_sid: lastSocketId}
    );
    sendDelayMessage()
  // }, 10000)
}

const sendHeartBreak = () => {
  setInterval(() => {
    if(!heartOK) {
      rJoinRoom()
    }
    const {
      classId,
      token
    } = BaseTeacherParams
    heartOK = false
    BaseWsRequest('heart-beat', {room: classId, token: token, role: "teacher", class_id: classId, last_sid: lastSocketId});
  }, 3000)
}

const sendAck = (msgId: string) => {
  BaseWsRequest('msg-receipt', {msg_id: msgId});
}

const preCheckAck = (data: string, callback: callback, params: object): any => {
  const response = JSON.parse(data)
  const {msg_id: msgId} = response
  if(msgId && !messageIdPool[msgId]) {
    messageIdPool[msgId] = true
    sendAck(msgId)
    callback({
      ...params,
      ...response,
    })
  } else if(!msgId) {
    callback({
      ...params,
      ...response,
    })
  }
}

export const createSo = (token: string, classId: string, callback: callback, onLineStatusChanged: callback, onReJoinRoom: callback) => {
  // // console.log(classId, "create ws socket")
  const socket = window.io(PPT.wsUrl, { transports: ["websocket"] });
  socket.on('connect', () => {
    // console.log('connect 状态 新链接')
    onLineStatusChanged(true)
    window.isNetWorkOnLine = true
    if(!isJoined) {
      isJoined = true
      // 加入房间，room是slide_id，token 是老师的身份信息，role必须是teacher
      BaseWsRequest('join-room', {room: classId, token: token, role: "teacher", class_id: classId, last_sid: ""}, () => {
        // // console.log("老师加入房间")
        sendHeartBreak()
      });
    } else {
      rJoinRoom()
      onReJoinRoom()
    }
    // // console.log('connect 状态 上线')
    lastSocketId = socket.id
    // 发送 control ，type和 params 随便定义，学生那边收到的就是这些。
    // socket.emit('control', `{"room":"${room}", "type":"lock_page", "params": {"page": 3}}`, () => {
    //   // // console.log("发送control")
    // });
  });

  socket.on('disconnect', () => {
    onLineStatusChanged(false)
    window.isNetWorkOnLine = false
  });
  // 老师端接收到学生发来的答案
  socket.on('response', (data: any) => {
    // // // console.log("收到学生发来的答案：" + data);
    preCheckAck(data, callback, {mtype: SocketEventsEnum.ANSWER_QUESTION})
  });

  // 老师端接到系统信息（目前只有一个在线学生人数）
  socket.on('status', (data: any) => {
    preCheckAck(data, callback, {mtype: SocketEventsEnum.STUDENTS_COUNTS})
  });

  socket.on('control', (data: any) => {
    // // console.log("收到系统信息：" + data);
    preCheckAck(data, callback, {mtype: SocketEventsEnum.CONTROL})
  });

  socket.on('rename', (data: any) => {
    preCheckAck(data, callback, {mtype: SocketEventsEnum.RENAME})
  });

  socket.on('go-to-page', (data: any) => {
    // // console.log("收到系统信息：STUDETN_GO_PAGE" + data);
    preCheckAck(data, callback, {mtype: SocketEventsEnum.STUDETN_GO_PAGE})
  });

  socket.on('comment-ppt', (data: any) => {
    // // console.log("收到学生评论ppt信息", JSON.parse(data));
    preCheckAck(data, callback, {mtype: SocketEventsEnum.STUNDENT_COMMENT_PPT})
  });

  socket.on('delete-ppt-comment', (data: any) => {
    // // console.log("收到学生删除ppt信息", JSON.parse(data));
    preCheckAck(data, callback, {mtype: SocketEventsEnum.STUDENT_DELETE_PPT})
  });

  socket.on('update-ppt-comment', (data: any) => {
    // // console.log("收到学生删除ppt信息", JSON.parse(data));
    preCheckAck(data, callback, {mtype: SocketEventsEnum.STUDENT_UPDATE_COMMENT})
  });

  socket.on('add-element', (data: any) => {
    // // console.log("收到老师添加的 media", JSON.parse(data));
    preCheckAck(data, callback, {mtype: SocketEventsEnum.STUDENT_ADD_MEDIA})
  });
  socket.on('update-element', (data: any) => {
    // // console.log("update-element media", JSON.parse(data));
    preCheckAck(data, callback, {mtype: SocketEventsEnum.TEACHER_UPDATE_MEDIA})
  });
  socket.on('delete-element', (data: any) => {
    // // console.log("update-element media", JSON.parse(data));
    preCheckAck(data, callback, {mtype: SocketEventsEnum.TEACHER_DELETE_MEDIA})
  });
  socket.on('delete-response', (data: any) => {
    // // console.log("删除答案" + data);
    preCheckAck(data, callback, {mtype: SocketEventsEnum.DELETE_QUESTION})
  });
  socket.on('star', (data: any) => {
    // // console.log("删除答案" + data);
    preCheckAck(data, callback, {mtype: 'star'})
  });
  socket.on('control-response', (data: any) => {
    // // console.log("删除答案" + data);
    preCheckAck(data, callback, {mtype: 'control-response'})
  });
  socket.on('msg', (data: string) => {
    try {
      const isSuccess = JSON.parse(data).message === 'success'
      if(isSuccess) {
        heartOK = true
      }
    } catch(e) {}
    // callback({ mtype: SocketEventsEnum.GO_PAGE, ...JSON.parse(data) })
  });
  socket.on('invalid_request', (data: string) => {
    try {
      showToast(JSON.parse(data).message, 'error')
    } catch(e) {}
    // callback({ mtype: SocketEventsEnum.GO_PAGE, ...JSON.parse(data) })
  });
  socket.on('invalid_token', () => {
    try {
      showToast('invalid_token, please press f5 to reload')
    } catch(e) {}
    // callback({ mtype: SocketEventsEnum.GO_PAGE, ...JSON.parse(data) })
  });

  windowStudentWs = socket
  return socket

}

export const changeTips = (pageId: string, tip: string, id: number) => {
  BaseWsRequest(
    "update-tip",
    {page_id: pageId, id: id, tip: tip}
    );
}

export const changeAnswer = (pageId: string, correctanswer: number[]) => {
  BaseWsRequest(
    "update-correct-answer",
    {page_id: pageId, correct_answer: JSON.stringify(correctanswer)}
  );
}

interface ControlP {
  controlType: number
}

// dash 和 project 互相控制
export const controlProject = (params: ControlP & any = {}) => {
  const {
    classId,
    token
  } = BaseTeacherParams
  BaseWsRequest(
    "control",
    {room: classId, type: SocketEventsEnum.ASYNC_DASH_PROJECT, token: token, class_id: classId, params: params}
  );
}

// 老师端发送切页消息
export const sendPageChangeControl = (currentPageIndex: number) => {
  const {
    classId,
    token
  } = BaseTeacherParams
  BaseWsRequest(
    "control",
    {room: classId, token: token, class_id: classId, type: SocketEventsEnum.GO_PAGE, params: {page: currentPageIndex}}
  );
}

// 处理发送socket 数据
export const sendTeacherSocketRequest = (socketType: string, data = {}) => {
  BaseWsRequest(
    socketType,
    data
  )
}

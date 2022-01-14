/* eslint-disable no-empty */
/* eslint-disable prefer-template */
/* eslint-disable no-// console */
import { showToast } from '@/utils/loading';
import PPT from '../utils/pptConfig'
import { SocketEventsEnum } from "./socketEvents";

type callback = (d?: any) => void

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
}

let windowStudentWs: any = null
let isJoined = false
let heartOK = true
let messageIdPool: any = {}
let lastSocketId = ''
let messageDelayPool: MessageItem[] = []

const BaseWsRequest = (action: string, message: object, callback: callback = () => null) => {
  const {
    classId,
    token
  } = BaseTeacherParams
  const params = {
    ...message,
    room: classId,
    token: token,
    class_id: classId
  }
  if(windowStudentWs && window.isNetWorkOnLine) {
    windowStudentWs.emit(action, JSON.stringify(params), callback);
  } else {
    messageDelayPool.push({
      action,
      params,
      callback
    })
  }
}

// 发送未成功发出的消息
const sendDelayMessage = () => {
  while(messageDelayPool.length > 0 && window.isNetWorkOnLine && windowStudentWs) {
    const {
      action,
      params,
      callback
    } = messageDelayPool[0]
    BaseWsRequest(action, params, callback)
    messageDelayPool.shift()
  }
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
    heartOK = false
    BaseWsRequest('heart-beat', {role: "teacher"});
  }, 5000)
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
  // console.log(classId, "create ws socket")
  const socket = window.io(PPT.wsUrl, { transports: ["websocket"] });
  socket.on('connect', () => {
    // console.log('connect 状态 新链接')
    if(!isJoined) {
      isJoined = true
      // 加入房间，room是slide_id，token 是老师的身份信息，role必须是teacher
      BaseWsRequest('join-room', {room: classId, token: token, role: "teacher", class_id: classId, last_sid: ""}, () => {
        // console.log("老师加入房间")
        sendHeartBreak()
      });
    } else {
      rJoinRoom()
      onReJoinRoom()
    }

    // console.log('connect 状态 上线')
    onLineStatusChanged(true)
    window.isNetWorkOnLine = true
    lastSocketId = socket.id
    rJoinRoom()
    // 发送 control ，type和 params 随便定义，学生那边收到的就是这些。
    // socket.emit('control', `{"room":"${room}", "type":"lock_page", "params": {"page": 3}}`, () => {
    //   // console.log("发送control")
    // });
  });

  socket.on('disconnect', () => {
    onLineStatusChanged(false)
    window.isNetWorkOnLine = false
  });
  // 老师端接收到学生发来的答案
  socket.on('response', (data: any) => {
    // // console.log("收到学生发来的答案：" + data);
    preCheckAck(data, callback, {mtype: SocketEventsEnum.ANSWER_QUESTION})
  });

  // 老师端接到系统信息（目前只有一个在线学生人数）
  socket.on('status', (data: any) => {
    preCheckAck(data, callback, {mtype: SocketEventsEnum.STUDENTS_COUNTS})
  });

  socket.on('control', (data: any) => {
    // console.log("收到系统信息：" + data);
    preCheckAck(data, callback, {mtype: SocketEventsEnum.CONTROL})
  });

  socket.on('rename', (data: any) => {
    preCheckAck(data, callback, {mtype: SocketEventsEnum.RENAME})
  });

  socket.on('go-to-page', (data: any) => {
    // console.log("收到系统信息：STUDETN_GO_PAGE" + data);
    preCheckAck(data, callback, {mtype: SocketEventsEnum.STUDETN_GO_PAGE})
  });

  socket.on('comment-ppt', (data: any) => {
    // console.log("收到学生评论ppt信息", JSON.parse(data));
    preCheckAck(data, callback, {mtype: SocketEventsEnum.STUNDENT_COMMENT_PPT})
  });

  socket.on('delete-ppt-comment', (data: any) => {
    // console.log("收到学生删除ppt信息", JSON.parse(data));
    preCheckAck(data, callback, {mtype: SocketEventsEnum.STUDENT_DELETE_PPT})
  });

  socket.on('update-ppt-comment', (data: any) => {
    // console.log("收到学生删除ppt信息", JSON.parse(data));
    preCheckAck(data, callback, {mtype: SocketEventsEnum.STUDENT_UPDATE_COMMENT})
  });

  socket.on('add-element', (data: any) => {
    // console.log("收到老师添加的 media", JSON.parse(data));
    preCheckAck(data, callback, {mtype: SocketEventsEnum.STUDENT_ADD_MEDIA})
  });
  socket.on('update-element', (data: any) => {
    // console.log("update-element media", JSON.parse(data));
    preCheckAck(data, callback, {mtype: SocketEventsEnum.TEACHER_UPDATE_MEDIA})
  });
  socket.on('delete-element', (data: any) => {
    // console.log("update-element media", JSON.parse(data));
    preCheckAck(data, callback, {mtype: SocketEventsEnum.TEACHER_DELETE_MEDIA})
  });
  socket.on('delete-response', (data: any) => {
    // console.log("删除答案" + data);
    preCheckAck(data, callback, {mtype: SocketEventsEnum.DELETE_QUESTION})
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

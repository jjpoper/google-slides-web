/* eslint-disable no-console */
/* eslint-disable func-names */
/* eslint-disable dot-notation */
/* eslint-disable quote-props */
/* eslint-disable no-empty */
/* eslint-disable max-len */
/* eslint-disable no-// console */
/* eslint-disable prefer-template */
import { getHashCode } from '@/utils/help';
import { showToast } from '@/utils/loading';
import PPT from '../utils/pptConfig'
import { SocketEventsEnum } from './socketEvents';

type callback = (d?: any) => void

const RsendSocketTypeMaps: any = {
  'rename': 'rename',
  'response': 'response',
  'go-to-page': 'go-to-page',
  'comment-ppt': 'comment-ppt',
  'delete-ppt-comment': 'delete-ppt-comment',
  'update-ppt-comment': 'update-ppt-comment',
  'add-element': 'update-ppt-comment',
  'update-element': 'update-element',
  'delete-element': 'delete-element',
  'delete-response': 'delete-response',
  'join-room': 'join-room'
}

interface BaseParams {
  classId: string
  token: string
  uid: string
  uname: string
}

let BaseStudentParams: BaseParams = {
  classId: '',
  token: '',
  uid: '',
  uname: ''
}

export const setStudentWxBaseParams = ({
  classId,
  token,
  uid,
  uname,
}: BaseParams) => {
  BaseStudentParams = {
    classId,
    token,
    uid,
    uname,
  }
}

interface MessageItem {
  action: string
  params: object
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

// 补发消息需要去重
const getMessageId = (action: string, params: object): string | null => {
  let clientMsgId: string | null = null
  if(filterSocketTypes.indexOf(action) === -1) {
    const keyMaps: any = {...params}
    if(action === RsendSocketTypeMaps['join-room']) {
      // 加入房间 只需要补发最后一次消息
      clientMsgId = 'join-room'
    } else if(action === RsendSocketTypeMaps['rename']) {
      delete keyMaps.user_name_new
      clientMsgId = getHashCode(keyMaps)
    } else if(action === RsendSocketTypeMaps['go-to-page']) {
      delete keyMaps.params
      clientMsgId = getHashCode(keyMaps)
    } else if(action === RsendSocketTypeMaps['response']) {
      const responseType = keyMaps.type
      if(responseType === 'choice') {
        // 选择题
        delete keyMaps.answer
        delete keyMaps.locked
      } else if(responseType === 'text') {
        delete keyMaps.content
      } else if(responseType === 'draw') {
        delete keyMaps.content
        delete keyMaps.content1
        delete keyMaps.result
      }
      clientMsgId = getHashCode(keyMaps)
    } else if(action === RsendSocketTypeMaps['update-ppt-comment']) {
      // 更新remark数据
      const pptCommentId = keyMaps.ppt_comment.id
      // 更新数据，只要id一致就去重
      keyMaps.ppt_comment = {
        id: pptCommentId
      }
      clientMsgId = getHashCode(keyMaps)
    }
    // 如果有id，就去重，没有就不用去重
    if(clientMsgId) {
      clientMsgId = `${action}${clientMsgId}`
    }
  }
  return clientMsgId
}
const pushMessageToDelayPool = (action: string, params: any) => {
  if(filterSocketTypes.indexOf(action) === -1) {
    const {clientMsgId} = params
    if(clientMsgId) {
      const index = messageDelayPool.findIndex(item => item.clientMsgId && item.clientMsgId === clientMsgId)
      const withIdData = {
        action,
        params,
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
      })
    }
  }
}

const BaseWsRequest = (action: string, message: object) => {
  const {
    classId,
    token
  } = BaseStudentParams
  const params: any = {
    ...message,
    room: classId,
    token: token,
    class_id: classId,
    clientMsgId: ''
  }
  const clientMsgId = getMessageId(action, params)
  if(clientMsgId) {
    params.clientMsgId = clientMsgId
  }
  if(windowStudentWs && window.isNetWorkOnLine) {
    // 1500ms没收到发送成功回调，需要补发一次
    const checkSuccessTimer = (function () {
      let timer: any = setTimeout(() => {
        console.log('没收到发送回调，导致补发')
        pushMessageToDelayPool(action, params)
      }, 1500)
      return () => {
        if(timer) {
          clearTimeout(timer)
          timer = null
        }
      }
    }());
    windowStudentWs.emit(action, JSON.stringify(params), checkSuccessTimer);
  } else {
    pushMessageToDelayPool(action, params)
  }
}

// 发送未成功发出的消息
const sendDelayMessage = () => {
  let startIndex = 0
  // 防止死循环，最多补发50条
  console.log('messageDelayPool', messageDelayPool)
  while(messageDelayPool.length > 0 && window.isNetWorkOnLine && windowStudentWs && startIndex < 50) {
    startIndex++
    const {
      action,
      params,
    } = messageDelayPool[0]
    BaseWsRequest(action, params)
    messageDelayPool.shift()
  }
  // messageDelayPool = []
}

// 定时join，避免消息收不到
const rJoinRoom = () => {
  // setInterval(() => {
    const {
      classId,
      token
    } = BaseStudentParams
    BaseWsRequest(
      'join-room',
      {room: classId, token: token, role: "student", class_id: classId, last_sid: lastSocketId}
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
    BaseWsRequest('heart-beat', {role: "student"});
  }, 5000)
}

const sendAck = (msgId: string) => {
  BaseWsRequest('msg-receipt', {msg_id: msgId});
}

const preCheckAck = (data: string, callback: callback, params: object): void => {
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

export const createSo = (room: string, token: string, classId: string, callback: callback, joinCallback: callback, onLineStatusChanged: callback, onReJoinRoom: callback) => {
  const socket = window.io(PPT.wsUrl, {transports: ["websocket"]});

  BaseStudentParams.classId = classId
  BaseStudentParams.token = token

  socket.on('connect', () => {
    // // console.log('connect 状态 新链接')
    onLineStatusChanged(true)
    window.isNetWorkOnLine = true
    if(!isJoined) {
      isJoined = true
      // 加入房间，房间名是slide_id，user_id是学生输入的名称，role是student
      socket.emit('join-room', `{"room":"${classId}", "token": "${token}", "role":"student","class_id":"${classId}","last_sid":""}`, () => {
        // // console.log("学生加入房间");
        if(joinCallback) {
          // @ts-ignore
          joinCallback()
        }
        sendHeartBreak()
      });
    } else {
      rJoinRoom()
      onReJoinRoom()
    }
    lastSocketId = socket.id
    // 提交答案，page_id是哪一页，item_id是哪个自定义元素，answer是学生的答案是什么
    // socket.emit('response', `{"room": "${room}", "user_id": "student_1", "page_id": "page_1", "item_id": "item_1", "answer": "Lily"}`, () => {
    //   // // console.log("学生提交答案。");
    // });
  });

  socket.on('disconnect', () => {
    // // console.log('connect 状态 断线')
    onLineStatusChanged(false)
    window.isNetWorkOnLine = false
  });

  // 学端要响应老师发来的 control
  socket.on('control', (data: string) => {
    // // console.log("老师发来了control. 详细数据: " + data);
    preCheckAck(data, callback, { mtype: SocketEventsEnum.CONTROL})
  });

  // 学生端收到老师发来的消息反馈
  socket.on('comment', (data: string) => {
    // // console.log("老师发来了消息反馈。详细数据：" + data);
    preCheckAck(data, callback, { mtype: SocketEventsEnum.TEACHER_COMMENT})
  });

  socket.on('comment-ppt', (data: string) => {
    // // console.log("学生评论id" + data);
    preCheckAck(data, callback, { mtype: SocketEventsEnum.GET_COMMENT_ID})
  });

  socket.on('add-element', (data: any) => {
    // // console.log("收到老师添加的 media", JSON.parse(data));
    preCheckAck(data, callback, { mtype: SocketEventsEnum.STUDENT_ADD_MEDIA})
  });
  socket.on('update-element', (data: any) => {
    // // console.log("update-element media", JSON.parse(data));
    preCheckAck(data, callback, { mtype: SocketEventsEnum.TEACHER_UPDATE_MEDIA})
  });
  socket.on('delete-element', (data: any) => {
    // // console.log("update-element media", JSON.parse(data));
    callback({ mtype: SocketEventsEnum.TEACHER_DELETE_MEDIA, ...JSON.parse(data) })
  });
  socket.on('response', (data: any) => {
    // // console.log("收到自己发来的答案：" + data);
    preCheckAck(data, callback, { mtype: SocketEventsEnum.ANSWER_QUESTION})
  });
  socket.on('delete-response', (data: any) => {
    // // console.log("删除答案" + data);
    preCheckAck(data, callback, { mtype: SocketEventsEnum.DELETE_QUESTION})
  });
  socket.on('update-tip', (data: any) => {
    preCheckAck(data, callback, { mtype: SocketEventsEnum.UPDATE_TIP})
  });
  socket.on('update-correct-answer', (data: any) => {
    preCheckAck(data, callback, { mtype: SocketEventsEnum.UPDATE_RIGHT_ANSWERS})
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
  // socket.onAny((event: string, ...args: any[]) => {
  //   // console.log(`got ${event}`);
  // });
  windowStudentWs = socket
  return socket
}

// 新增 remark 反馈数据
export const askToAddNewRemarkItem = (data: any) => {
  const {
    left,
    top,
    link,
    content_width,
    content_height,
    type,
    background,
    page_id,
    width = 0,
    height = 0,
    pointType
  } = data;
  BaseWsRequest(
    "comment-ppt",
    {
      token: BaseStudentParams.token,
      class_id: BaseStudentParams.classId,
      data: {
        left: left,
        top,
        link: link,
        type: type,
        background: background,
        content_width: content_width,
        content_height: content_height,
        width: width,
        height: height,
        pointType: pointType,
        page_id: page_id
      }
    }
  );
}

export const deleteOneRemark = (id: string) => {
  BaseWsRequest(
    "delete-ppt-comment",
    {id: id}
  );
}

export const updateRemarkItemData = (data: any) => {
  const {
    id
  } = data;
  BaseWsRequest(
    "update-ppt-comment",
      {
        ppt_comment_id: id,
        ppt_comment: data
      }
    );
}

// 发送 media 答案
export const sendAudioOrVideoAnswer = ({
  link,
  mediaType = 'audio',
  page_id,
  fileName = ''
}: any) => {
  const {
    uid,
    uname
  } = BaseStudentParams
  const content = {link, mediaType, fileName}
  BaseWsRequest(
    "response", {type: "media", user_id: uid, user_name: uname, page_id: page_id, item_id: "0", content: content}
  );
}

// 删除media
export const deleteMedia = (id: number) => {
  BaseWsRequest(
    "delete-response", {response_id: id}
  );
}

// 处理发送socket 数据
export const sendStudentSocketRequest = (socketType: string, data = {}) => {
  BaseWsRequest(
    socketType,
    data
  )
}

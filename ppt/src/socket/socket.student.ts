/* eslint-disable max-len */
/* eslint-disable no-// console */
/* eslint-disable prefer-template */
import PPT from '../utils/pptConfig'
import { SocketEventsEnum } from './socketEvents';

type callback = (d: any) => void

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

let windowStudentWs: any = null

export const createSo = (room: string, token: string, classId: string, callback: callback, joinCallback: callback, onLineStatusChanged: callback) => {
  const socket = window.io(PPT.wsUrl, {transports: ["websocket"]});

  BaseStudentParams.classId = classId
  BaseStudentParams.token = token

  socket.on('connect', () => {
    onLineStatusChanged(true)
    // 加入房间，房间名是slide_id，user_id是学生输入的名称，role是student
    socket.emit('join-room', `{"room":"${classId}", "token": "${token}", "role":"student","class_id":"${classId}"}`, () => {
      // console.log("学生加入房间");
      if(joinCallback) {
        // @ts-ignore
        joinCallback()
      }
    });
    // 提交答案，page_id是哪一页，item_id是哪个自定义元素，answer是学生的答案是什么
    // socket.emit('response', `{"room": "${room}", "user_id": "student_1", "page_id": "page_1", "item_id": "item_1", "answer": "Lily"}`, () => {
    //   // console.log("学生提交答案。");
    // });
  });

  socket.on('disconnect', () => {
    // console.log('connect 状态 断线')
    onLineStatusChanged(false)
  });

  // 学端要响应老师发来的 control
  socket.on('control', (data: string) => {
    // console.log("老师发来了control. 详细数据: " + data);
    callback({ mtype: SocketEventsEnum.GO_PAGE, ...JSON.parse(data) })
  });

  // 学生端收到老师发来的消息反馈
  socket.on('comment', (data: string) => {
    // console.log("老师发来了消息反馈。详细数据：" + data);
    callback({ mtype: SocketEventsEnum.TEACHER_COMMENT, ...JSON.parse(data) })
  });

  socket.on('comment-ppt', (data: string) => {
    // console.log("学生评论id" + data);
    callback({ mtype: SocketEventsEnum.GET_COMMENT_ID, ...JSON.parse(data) })
  });

  socket.on('add-element', (data: any) => {
    // console.log("收到老师添加的 media", JSON.parse(data));
    callback({ mtype: SocketEventsEnum.STUDENT_ADD_MEDIA, ...JSON.parse(data) })
  });
  socket.on('update-element', (data: any) => {
    // console.log("update-element media", JSON.parse(data));
    callback({ mtype: SocketEventsEnum.TEACHER_UPDATE_MEDIA, ...JSON.parse(data) })
  });
  socket.on('delete-element', (data: any) => {
    // console.log("update-element media", JSON.parse(data));
    callback({ mtype: SocketEventsEnum.TEACHER_DELETE_MEDIA, ...JSON.parse(data) })
  });
  socket.on('response', (data: any) => {
    // console.log("收到自己发来的答案：" + data);
    callback({ mtype: SocketEventsEnum.ANSWER_QUESTION, ...JSON.parse(data) })
  });
  socket.on('delete-response', (data: any) => {
    // console.log("删除答案" + data);
    callback({ mtype: SocketEventsEnum.DELETE_QUESTION, ...JSON.parse(data) })
  });
  windowStudentWs = socket
  return socket
}

const BaseWsRequest = (action: string, message: string) => {
  if(windowStudentWs) {
    windowStudentWs.emit(action, message);
  }
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
    `{"token": "${BaseStudentParams.token}", "class_id": "${BaseStudentParams.classId}",
    "data":
      {"left": ${left}, "top": ${top}, "link": "${link}", "type": "${type}",
      "background": "${background}", "content_width": ${content_width},
      "content_height": ${content_height},
      "width": ${width},
      "height": ${height},
      "pointType": "${pointType}",
      "page_id": "${page_id}"}}`
    );
}

export const deleteOneRemark = (id: string) => {
  BaseWsRequest(
    "delete-ppt-comment",
    `{"token":"${BaseStudentParams.token}","class_id":"${BaseStudentParams.classId}","id":${id}}`
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
    classId,
    token,
    uid,
    uname
  } = BaseStudentParams
  const content = `{"link":"${link}","mediaType":"${mediaType}", "fileName": "${fileName}"}`
  BaseWsRequest(
    "response", `{"room": "${classId}","type":"media","user_id": "${uid}","user_name":"${uname}","token": "${token}","class_id":"${classId}","page_id": "${page_id}","item_id": "0","content": ${content}}`
  );
}

// 删除media
export const deleteMedia = (id: number) => {
  const {
    classId,
    token
  } = BaseStudentParams
  BaseWsRequest(
    "delete-response", `{"token": "${token}","class_id":"${classId}", "response_id": ${id}}`
  );
}

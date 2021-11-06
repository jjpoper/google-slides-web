/* eslint-disable prefer-template */
/* eslint-disable no-// console */
import PPT from '../utils/pptConfig'
import { SocketEventsEnum } from "./socketEvents";

type callback = (d: any) => void

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

let windowStudentWs: any = null
let isJoined = false

const BaseWsRequest = (action: string, message: string) => {
  if(windowStudentWs) {
    windowStudentWs.emit(action, message);
  }
}

const TimerJoinRoom = () => {
  setInterval(() => {
    const {
      classId,
      token
    } = BaseTeacherParams
    BaseWsRequest('join-room', `{"room":"${classId}", "token": "${token}", "role":"teacher","class_id":"${classId}"}`);
  }, 5000)
}

export const createSo = (room: string, token: string, classId: string, callback: callback, onLineStatusChanged: callback, onConnected: callback) => {
  // console.log(classId, "create ws socket")
  const socket = window.io(PPT.wsUrl, { transports: ["websocket"] });
  socket.on('connect', () => {
    if(!isJoined) {
      isJoined = true
      // 加入房间，room是slide_id，token 是老师的身份信息，role必须是teacher
      socket.emit('join-room', `{"room":"${classId}", "token": "${token}", "role":"teacher","class_id":"${classId}"}`, () => {
        // console.log("老师加入房间")
        TimerJoinRoom()
      });
    }

    // console.log('connect 状态 上线')
    onLineStatusChanged(true)

    // 发送 control ，type和 params 随便定义，学生那边收到的就是这些。
    // socket.emit('control', `{"room":"${room}", "type":"lock_page", "params": {"page": 3}}`, () => {
    //   // console.log("发送control")
    // });
  });

  socket.on('disconnect', () => {
    // console.log('connect 状态 断线')
    onLineStatusChanged(false)
  });
  // 老师端接收到学生发来的答案
  socket.on('response', (data: any) => {
    // // console.log("收到学生发来的答案：" + data);
    callback({ mtype: SocketEventsEnum.ANSWER_QUESTION, ...JSON.parse(data) })
  });

  // 老师端接到系统信息（目前只有一个在线学生人数）
  socket.on('status', (data: any) => {
    callback({ mtype: SocketEventsEnum.STUDENTS_COUNTS, ...JSON.parse(data) })
  });

  socket.on('control', (data: any) => {
    // console.log("收到系统信息：" + data);
    callback({ mtype: SocketEventsEnum.CONTROL, ...JSON.parse(data) })
  });

  socket.on('rename', (data: any) => {
    callback({ mtype: SocketEventsEnum.RENAME, ...JSON.parse(data) })
  });

  socket.on('go-to-page', (data: any) => {
    // console.log("收到系统信息：STUDETN_GO_PAGE" + data);
    callback({ mtype: SocketEventsEnum.STUDETN_GO_PAGE, ...JSON.parse(data) })
  });

  socket.on('comment-ppt', (data: any) => {
    // console.log("收到学生评论ppt信息", JSON.parse(data));
    callback({ mtype: SocketEventsEnum.STUNDENT_COMMENT_PPT, ...JSON.parse(data) })
  });

  socket.on('delete-ppt-comment', (data: any) => {
    // console.log("收到学生删除ppt信息", JSON.parse(data));
    callback({ mtype: SocketEventsEnum.STUDENT_DELETE_PPT, ...JSON.parse(data) })
  });

  socket.on('update-ppt-comment', (data: any) => {
    // console.log("收到学生删除ppt信息", JSON.parse(data));
    callback({ mtype: SocketEventsEnum.STUDENT_UPDATE_COMMENT, ...JSON.parse(data) })
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
  socket.on('delete-response', (data: any) => {
    // console.log("删除答案" + data);
    callback({ mtype: SocketEventsEnum.DELETE_QUESTION, ...JSON.parse(data) })
  });

  windowStudentWs = socket
  return socket

}

export const changeTips = (pageId: string, tip: string, id: number) => {
  BaseWsRequest(
    "update-tip",
    `{"class_id": "${BaseTeacherParams.classId}", "page_id":"${pageId}", "id": ${id}, "tip": "${tip}"}`
    );
}

export const changeAnswer = (pageId: string, correctanswer: number[]) => {
  BaseWsRequest(
    "update-correct-answer",
    `{"class_id": "${BaseTeacherParams.classId}", "page_id":"${pageId}", "correct_answer": ${JSON.stringify(correctanswer)}}`
    );
}

// dash 和 project 互相控制
export const controlProject = (params = {}) => {
  const {
    classId,
    token
  } = BaseTeacherParams
  BaseWsRequest(
    "control",
    `{"room":"${classId}", "type": "${SocketEventsEnum.SHOW_RESPONSE}", "token": "${token}","class_id":"${classId}","params": ${JSON.stringify(params)}}`
  );
}

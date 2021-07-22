/* eslint-disable prefer-template */
/* eslint-disable no-console */
import PPT from '../utils/pptConfig'
import { SocketEventsEnum } from "./socketEvents";

type callback = (d: any) => void

export const createSo = (room: string, token: string, classId: string, callback: callback, onLineStatusChanged: callback) => {
  console.log(classId, "create ws socket")
  const socket = window.io(PPT.wsUrl, { transports: ["websocket"] });
  socket.on('connect', () => {
    // 加入房间，room是slide_id，token 是老师的身份信息，role必须是teacher
    socket.emit('join-room', `{"room":"${classId}", "token": "${token}", "role":"teacher","class_id":"${classId}"}`, () => {
      console.log("老师加入房间")
    });

    console.log('connect 状态 上线')
    onLineStatusChanged(true)

    // 发送 control ，type和 params 随便定义，学生那边收到的就是这些。
    // socket.emit('control', `{"room":"${room}", "type":"lock_page", "params": {"page": 3}}`, () => {
    //   console.log("发送control")
    // });
  });

  socket.on('disconnect', () => {
    console.log('connect 状态 断线')
    onLineStatusChanged(false)
  });
  // 老师端接收到学生发来的答案
  socket.on('response', (data: any) => {
    console.log("收到学生发来的答案：" + data);
    callback({ type: SocketEventsEnum.ANSWER_QUESTION, ...JSON.parse(data) })
  });

  // 老师端接到系统信息（目前只有一个在线学生人数）
  socket.on('status', (data: any) => {
    callback({ type: SocketEventsEnum.STUDENTS_COUNTS, ...JSON.parse(data) })
  });

  socket.on('control', (data: any) => {
    console.log("收到系统信息：" + data);
    callback({ mtype: SocketEventsEnum.CONTROL, ...JSON.parse(data) })
  });

  socket.on('rename', (data: any) => {
    callback({ type: SocketEventsEnum.RENAME, ...JSON.parse(data) })
  });

  socket.on('go-to-page', (data: any) => {
    console.log("收到系统信息：STUDETN_GO_PAGE" + data);
    callback({ type: SocketEventsEnum.STUDETN_GO_PAGE, ...JSON.parse(data) })
  });

  // 0: "comment-ppt"
  // {
  //   "user_id": "", // 学生 user id
  //   "user_name": "", // 学生姓名
  //   "class_id": "", // 课程 标识
  //   "data": {
  //     "position_x": 123,
  //     "postion_y": 123,
  //     "link": "",
  //     "type": "",
  //     "content_width": 123,
  //     "content_height": 123,
  //     "time": 123, //timestamp，根据学生浏览器 locale 转成 human readable 时间显示
  //     }
  // }

  socket.on('comment-ppt', (data: any) => {
    console.log("收到学生评论ppt信息", JSON.parse(data));
    callback({ type: SocketEventsEnum.STUNDENT_COMMENT_PPT, ...JSON.parse(data) })
  });

  socket.on('delete-ppt-comment', (data: any) => {
    console.log("收到学生删除ppt信息", JSON.parse(data));
    callback({ type: SocketEventsEnum.STUDENT_DELETE_PPT, ...JSON.parse(data) })
  });

  socket.on('add-element', (data: any) => {
    console.log("收到老师添加的 media", JSON.parse(data));
    callback({ type: SocketEventsEnum.STUDENT_ADD_MEDIA, ...JSON.parse(data) })
  });
  return socket

}

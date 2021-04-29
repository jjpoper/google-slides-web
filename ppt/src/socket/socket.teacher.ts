/* eslint-disable prefer-template */
/* eslint-disable no-console */
import PPT from '../utils/pptConfig'
import { SocketEventsEnum } from "./socketEvents";

type callback = (d: any) => void

export const createSo = (room: string, userId: string, callback: callback) => {
  const socket = window.io(PPT.wsUrl, {transports: ["websocket"]});
  socket.on('connect', () => {
    // 加入房间，room是slide_id，user_id 是老师的名称，role必须是teacher
    socket.emit('join-room', `{"room":"${room}", "user_id": "${userId}", "role":"teacher"}`, () => {
      console.log("老师加入房间")
    });

    // 发送 control ，type和 params 随便定义，学生那边收到的就是这些。
    // socket.emit('control', `{"room":"${room}", "type":"lock_page", "params": {"page": 3}}`, () => {
    //   console.log("发送control")
    // });
  });

  // 老师端接收到学生发来的答案
  socket.on('response', (data: any) => {
    // console.log("收到学生发来的答案：" + data);
    callback({type: SocketEventsEnum.ANSWER_QUESTION, ...JSON.parse(data)})
  });

  // 老师端接到系统信息（目前只有一个在线学生人数）
  socket.on('status', (data: any) => {
    // console.log("收到系统信息：" + data);
    callback({type: SocketEventsEnum.STUDENTS_COUNTS, ...JSON.parse(data)})
  });

  socket.on('control',(data:any)=>{
    callback({type: SocketEventsEnum.CONTROL, ...JSON.parse(data)})
  })

  socket.on('rename', (data: any) => {
    callback({type: SocketEventsEnum.RENAME, ...JSON.parse(data)})
  });

  return socket

}

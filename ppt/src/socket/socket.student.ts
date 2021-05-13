/* eslint-disable no-console */
/* eslint-disable prefer-template */
import PPT from '../utils/pptConfig'
import { SocketEventsEnum } from './socketEvents';

type callback = (d: any) => void

export const createSo = (room: string, token: string, callback: callback, joinCallback: callback, class_id: string) => {
  const socket = window.io(PPT.wsUrl, {transports: ["websocket"]});
  socket.on('connect', () => {
    // 加入房间，房间名是slide_id，user_id是学生输入的名称，role是student
    socket.emit('join-room', `{"room":"${room}", "token": "${token}", "class_id":"${class_id}", "role":"student"}`, () => {
      console.log("学生加入房间");
      if (joinCallback) {
        // @ts-ignore
        joinCallback()
      }
    });
    // 提交答案，page_id是哪一页，item_id是哪个自定义元素，answer是学生的答案是什么
    // socket.emit('response', `{"room": "${room}", "user_id": "student_1", "page_id": "page_1", "item_id": "item_1", "answer": "Lily"}`, () => {
    //   console.log("学生提交答案。");
    // });
  });

  // 学端要响应老师发来的 control
  socket.on('control', (data: string) => {
    console.log("老师发来了control. 详细数据: " + data);
    callback({ mtype: SocketEventsEnum.GO_PAGE, ...JSON.parse(data) })
  });

  // 学生端收到老师发来的消息反馈
  socket.on('comment', (data: string) => {
    console.log("老师发来了消息反馈。详细数据：" + data);
    callback({ mtype: SocketEventsEnum.TEACHER_COMMENT, ...JSON.parse(data) })
  });
  return socket
}

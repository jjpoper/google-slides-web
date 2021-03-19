import { io } from "socket.io-client"

export const createSo = (room: string, callback = () => null) => {
  const socket = io('ws://ws.newzealand.actself.me:9520', {transports: ["websocket"]});
  socket.on('connect', (data) => {
    // @ts-ignore
    console.log(data, '=====')
    // 老师端连接上后，加入房间， 房间名就是当前 ppt 的标识 slide_id
    // 还要传一个 user_id ，表明是哪个老师， 这个先写死，后面我们再弄个登录接口，让老师学生都登录一下，
    // @ts-ignore
    socket.emit('join-room', `{"room": ${room}, "user_id": ${parseInt(Math.random() * 1000)}}`);

    // 老师在上课时，可以发送控制命令，比如让所有同学都锁定在某一个page，只能看这一个page
    // 或者跳转到某个 page
    // control 的参数，你可以自己决定，这里只是参考
    // socket.emit('control', '{"type":"lock_page", "params": {"page": 3}}', console.log);
  });

  // 学生在 response 时，会传给服务器，服务器会通知老师端，监听 response 事件即可。
  // response 事件的参数，参见学生端，也是根据不同类型的 item 来自行设计的。
  // 服务器拿到学生的response时，会保存到数据库里，方便以后生成报表，同时老师这里，
  // 也可以作相应处理，比如显示出来给老师看，哪个学生的答案是什么
  socket.on('response', (d: any) => {
    // @ts-ignore
    callback(d)
  });

  // 服务端会推给老师一些系统信息，比如当前在线学生人数是多少。
  socket.on('status', (d) => {
    // console.log(d)
  })

  return socket
}

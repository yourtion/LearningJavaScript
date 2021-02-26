process.on('message', (m, server) => {
  if (m === 'server') {
    server.on('connection', (socket) => {
      socket.end('由子进程处理');
    });
  }
  if (m === 'socket') {
    if (server) {
      // 检查客户端 socket 是否存在。
      // socket 在被发送与被子进程接收这段时间内可被关闭。
      server.end(`请求使用 ${process.argv[2]} 优先级处理`);
    }
  }
});

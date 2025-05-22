import { Manager, Socket } from 'socket.io-client'

enum ConnectStatus {
  connect = 'connect',
  disconnect = 'disconnect',
}


export function connectToServer() {
  const manager = new Manager('http://localhost:3000/socket.io/socket.io.js')

  const socket = manager.socket('/')

  console.log({ socket })

  addListeners(socket);
}


export function addListeners(socket: Socket) {

  const serverStatusLabel = document.getElementById('server-status')!;

  socket.on(ConnectStatus.connect, () => {
    serverStatusLabel.innerHTML = 'connected'
  })

  socket.on(ConnectStatus.disconnect, () => {
    serverStatusLabel.innerHTML = 'disconnected'
  })
}

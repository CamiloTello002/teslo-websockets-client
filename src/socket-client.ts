import { Manager, Socket } from 'socket.io-client'

enum ConnectStatus {
  connect = 'connect',
  disconnect = 'disconnect',
}

enum Events {
  ClientsUpdated = 'clients-updated',
  MessageFromClient = 'message-from-client',
  MessageFromServer = 'message-from-server'
}


export function connectToServer() {
  const manager = new Manager('http://localhost:3000/socket.io/socket.io.js')

  const socket = manager.socket('/')

  console.log({ socket })

  addListeners(socket);
}


export function addListeners(socket: Socket) {

  /* HTML elements to modify **/

  const serverStatusLabel = document.getElementById('server-status')!;
  const clientsList = document.querySelector('.clients-list')!;

  const messageForm = document.querySelector<HTMLFormElement>('.message-form')!;
  const messageInput = document.querySelector<HTMLInputElement>('.message-input')!;

  const messageList = document.querySelector('.message-list')!;

  socket.on(ConnectStatus.connect, () => {
    serverStatusLabel.innerHTML = 'connected'
    messageInput.disabled = false;
  });

  socket.on(ConnectStatus.disconnect, () => {
    serverStatusLabel.innerHTML = 'disconnected'
    messageInput.disabled = true;
  });

  socket.on(Events.ClientsUpdated, (clients: string[]) => {
    const clientsMarkup = clients.map((client) => {
      return `<li>${client}</li>\n`
    });
    clientsList.innerHTML = clientsMarkup.join('\n');
  });

  messageForm.addEventListener('submit', (event) => {
    event.preventDefault();

    if (messageInput.value.trim().length <= 0) return;

    socket.emit(Events.MessageFromClient, { id: 'itz me', message: messageInput.value })

    messageInput.value = '';
  });

  socket.on(Events.MessageFromServer, (payload: { userId: string, message: string }) => {
    const newMessage = `
      <li style="display: flex; gap: .5rem; align-items: center; line-height: .5;">
        <strong>${payload.userId}</strong>
        <p>${payload.message}</p>
      </li>
    `
    messageList.innerHTML += newMessage;
  })
}

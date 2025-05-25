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

// of course they're initially null. It doesn't even exist
let currentSocket: Socket | null = null;
let currentManager: Manager | null = null;


// whenever you call this function...
export function connectToServer(token: string) {
  // Clean up previous connection if it exists
  if (currentSocket) {
    console.log('Cleaning up previous socket connection');
    currentSocket.removeAllListeners(); // Remove all event listeners
    currentSocket.disconnect(); // Disconnect the socket
    currentSocket = null;
  }

  if (currentManager) {
    currentManager.off(); // Close the manager and all its sockets
    currentManager = null;
  }

  const manager = new Manager(`${import.meta.env.VITE_API_HOST}/socket.io/socket.io.js`, {
    extraHeaders: {
      authentication: token
    }
  })

  // I need to STORE THE REFERENCES of both the socket and the manager
  const socket = manager.socket('/')

  currentSocket = socket;
  currentManager = manager;

  // only called once when the page loads
  addListeners();
}


export function addListeners() {

  /* HTML elements to modify **/

  const serverStatusLabel = document.getElementById('server-status')!;
  const clientsList = document.querySelector('.clients-list')!;

  const messageForm = document.querySelector<HTMLFormElement>('.message-form')!;
  const messageInput = document.querySelector<HTMLInputElement>('.message-input')!;

  const messageList = document.querySelector('.message-list')!;

  currentSocket?.on(ConnectStatus.connect, () => {
    serverStatusLabel.innerHTML = 'connected'
    messageInput.disabled = false;
  });

  currentSocket?.on(ConnectStatus.disconnect, () => {
    serverStatusLabel.innerHTML = 'disconnected'
    messageInput.disabled = true;
  });

  currentSocket?.on(Events.ClientsUpdated, (clients: string[]) => {
    const clientsMarkup = clients.map((client) => {
      return `<li>${client}</li>\n`
    });
    clientsList.innerHTML = clientsMarkup.join('\n');
  });

  // this listener always points to the latest socket
  messageForm.addEventListener('submit', (event) => {
    event.preventDefault();

    if (messageInput.value.trim().length <= 0) return;

    currentSocket?.emit(Events.MessageFromClient, { id: 'itz me', message: messageInput.value })

    messageInput.value = '';
  });

  currentSocket?.on(Events.MessageFromServer, (payload: { userId: string, message: string }) => {
    const newMessage = `
      <li style="display: flex; gap: .5rem; align-items: center; line-height: .5;">
        <strong>${payload.userId}</strong>
        <p>${payload.message}</p>
      </li>
    `
    messageList.innerHTML += newMessage;
  })
}

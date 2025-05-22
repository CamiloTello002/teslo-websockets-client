import './style.css'
import { connectToServer } from './socket-client'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <h1>Websocket - Client</h1>

    <span id="server-status">Offline</span>

    <ul class="clients-list">
    </ul>

    <form class="message-form">
      <input placeholder="Send message here" class="message-input"/>
    </form>

    <h3>Messages</h3>
    <ul class="message-list"></ul>
  </div>
`

connectToServer();

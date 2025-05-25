import './style.css'
import { connectToServer } from './socket-client'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <h1 style="font-size: 2rem;">Websocket - Client</h1>

    <input class="jwt-input" placeholder="Json Web Token" />
    <button class="btn-connect">Conectarse</button>

    <br />
    <br />

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

const jwtTokenInput = document.querySelector<HTMLInputElement>('.jwt-input')!;
const buttonConnect = document.querySelector<HTMLButtonElement>('.btn-connect')!;

buttonConnect.addEventListener('click', () => {

  const token = jwtTokenInput.value.trim();

  if (token.length <= 0) return alert('Please enter a valid JWT');

  connectToServer(token);
})

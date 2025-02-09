const nameInput = document.querySelector(`#my-name-input`);
const messageInput = document.querySelector(`#my-message-input`);
const sendButton = document.querySelector(`#send-button`);
const chatBox = document.querySelector(`#chat`);

function formatMessage(message)
{
  let divClass = ``;
  if(message.sender === nameInput.value)
  {
    divClass = `mine`;
  }
  else
  {
    divClass = `yours`;
  }

  let messageTimestamp = (new Date(message.timestamp));
  let messageTime = `${messageTimestamp.getHours()}:` + String(messageTimestamp.getMinutes()).padStart(2, `0`);

  let HTMLMmessage = document.createElement(`div`);
  HTMLMmessage.classList.add(divClass);
  HTMLMmessage.classList.add(`messages`);

  let messageContent = document.createElement(`div`);
  messageContent.classList.add(`message`);
  messageContent.innerHTML = message.text;

  let messageInfo = document.createElement(`div`);
  messageInfo.classList.add(`sender-info`);
  messageInfo.innerHTML = `${message.sender} ${messageTime}`;

  HTMLMmessage.appendChild(messageContent);
  HTMLMmessage.appendChild(messageInfo);
  return HTMLMmessage;
}

async function fetchMessages()
{
  let messageArray = await fetch(`https://it3049c-chat.fly.dev/messages`);
  return messageArray;
}

function updateMessagesInChatBox()
{
  let messageArray = fetchMessages();

  chatBox.innerHTML = ``;

  for(let i = 0; i < (messageArray.length); i++)
  {
    let message = formatMessage(messageArray[i]);
    chatBox.appendChild(message);
  }
}

function sendMessage(username, messageText)
{
  let message = {
    sender: username,
    text: messageText,
    timestamp: (new Date().getTime())
  };
  const messageRequest = new Request(`https://it3049c-chat.fly.dev/messages`, {
    method: `POST`,
    body: JSON.stringify(message)
  });

  chatBox.appendChild(formatMessage(message));
  fetch(`https://it3049c-chat.fly.dev/messages`, messageRequest);
}

sendButton.addEventListener(`click`, function (e){
  e.preventDefault();
  sendMessage(nameInput.value, messageInput.value);
  messageInput.value = ``;
});

const MILLISECONDS_IN_TEN_SECONDS = 10000;

updateMessagesInChatBox();
setInterval(updateMessagesInChatBox(), 10000);
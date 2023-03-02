let url = 'ws://localhost:8080/ws';

let socket = new WebSocket(url);

// send message from the form
document.forms.publish.onsubmit = function() {
  let outgoingMessage = this.message.value;

  socket.send(outgoingMessage);
  return false;
};

// handle incoming messages
socket.onmessage = async function(event) {
  if (event.data instanceof Blob) {
    let reader = new FileReader();

    reader.onload = () => {
      showMessage(reader.result);
    };

    reader.readAsText(event.data);
    
  } else {
    showMessage(event.data);
  }
};

socket.onclose = event => console.log(`Closed ${event.code}`);

// show message in div#messages
function showMessage(message) {
  let messageElem = document.createElement('div');
  messageElem.textContent = message;
  document.getElementById('messages').prepend(messageElem);
}

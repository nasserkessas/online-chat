import axios from 'axios'

let wsUrl = 'ws://localhost:8080/ws';

let socket = new WebSocket(wsUrl);


const getCode = () => {
  document.getElementById("code_form").style.display = "none";
  document.getElementById("chat_form").style.display = "block";

  axios.get("http://localhost:8000/code")
    .then((res) => { console.log(res.data); })
    .catch((err) => { console.log(err); })
}

// send message from the form
document.forms.publish.onsubmit = function () {
  let outgoingMessage = this.message.value;

  socket.send(outgoingMessage);
  return false;
};

document.forms.code_form.onsubmit = function () {

  axios.post("http://localhost:8000/code", {code: this.code.value}, {
    headers: {
      'content-type': 'text/plain'
    }
  })
  .then((res) => { console.log(res.data); })
  .catch((err) => { console.log(err); })

  document.getElementById("code_form").style.display = "none";
  document.getElementById("chat_form").style.display = "block";

  return false;
};

// handle incoming messages
socket.onmessage = async function (event) {
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


document.getElementById("gen_code").addEventListener("click", getCode);

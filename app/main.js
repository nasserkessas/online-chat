import axios from 'axios'

let wsUrl = 'ws://localhost:8080';

let socket;

const setMessage = (msg, error = true) => {
  let messageElem = document.getElementById("message");
  messageElem.style.display = "block";
  messageElem.style.color = error ? "red" : "white";
  messageElem.innerHTML = msg;
}

const getCode = () => {

  axios.get("http://localhost:8000/code")
    .then((res) => { setMessage(`Code is ${res.data.code}`); })
    .catch((err) => { setMessage("An error occurred generating a code, please try again", true); console.log(err); })
}

// send message from the form
document.forms.publish.onsubmit = function () {
  let outgoingMessage = this.message.value;

  socket.send(outgoingMessage);
  return false;
};

document.forms.code_form.onsubmit = function () {

  axios.post("http://localhost:8000/code", { code: this.code.value }, {
    headers: {
      'content-type': 'text/plain'
    }
  })
    .then((res) => {
      document.getElementById("code_form").style.display = "none";
      document.getElementById("chat_form").style.display = "block";
      socket = new WebSocket(`${wsUrl}/${this.code.value}`);
      initSocket(socket);
    })
    .catch((err) => {
      setMessage("Invalid code, Please enter a correct code or generate a new one.", true);
    })

  return false;
};

const initSocket = (socket) => {
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
}

// show message in div#messages
function showMessage(message) {
  let messageElem = document.createElement('div');
  messageElem.textContent = message;
  document.getElementById('messages').prepend(messageElem);
}


document.getElementById("gen_code").addEventListener("click", getCode);

const socket = io();

// Get DOM elements
const messageInput = document.getElementById("message-input");
const sendButton = document.getElementById("send-btn");
const chatMessages = document.getElementById("chat-messages");
const onlineUsers = document.getElementById("online-users");
while (password !== "shubham") {
  var password = prompt("Enter password ");
}

while (!nickname) {
  var nickname = prompt("Enter your name: ");
}
// Emit new user event
socket.emit("new user", nickname);
messageInput.focus();
// Listen for new messages
socket.on("chat message", ({ user, message }) => {
  if (nickname !== user) appendMessage(`${user}: ${message}`, false);
});

// Listen for user connections
socket.on("user connected", (users) => {
  onlineUsers.innerHTML = "";
  users.forEach((user) => {
    onlineUsers.innerHTML += `<li>${user}</li>`;
  });
});

// Listen for user disconnections
socket.on("user disconnected", (users) => {
  onlineUsers.innerHTML = "";
  users.forEach((user) => {
    onlineUsers.innerHTML += `<div>${user}</div>`;
  });
});

// Listen for "is typing" event
messageInput.addEventListener("input", () => {
  socket.emit("typing");
});

// Append message to chat window
function appendMessage(message, isSender) {
  const messageElement = document.createElement("div");
  if (isSender) {
    messageElement.innerText = `You: ${message}`;
  } else {
    messageElement.innerText = message;
  }
  chatMessages.appendChild(messageElement);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

messageInput.addEventListener("keypress", (event) => {
  if (event.code === "Enter") {
    const message = messageInput.value.trim();
    if (message !== "") {
      socket.emit("chat message", message);
      appendMessage(message, true); // Display the sender's message only once
      messageInput.value = "";
      messageInput.focus();
    }
  }
});

// Handle user's "is typing" status
socket.on("user typing", (user) => {
  console.log(":hhhs");
});

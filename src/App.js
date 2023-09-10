import React, { useState } from "react";
import "./App.css";
import Messages from "./Messages";
import Input from "./Input";
import io from "socket.io-client";

function randomColor() {
  return "#" + Math.floor(Math.random() * 0xffffff).toString(16);
}

function App() {
  const [mainDrone, setDrone] = useState(null);
  const [messages, setMessages] = useState([]);
  const [member, setMember] = useState({
    clientData: {
      username: "",
      color: randomColor(),
      id: "",
    },
  });
  const server = "/";
  const droneCall = () => {
    const userName = member.clientData.username;
    const color = member.clientData.color;
    const drone = io(server, {
      query: { username: userName, color: color },
    });

    drone.on("connect", (data) => {
      const newMember = { ...member };
      newMember.clientData.id = drone.id;
      setMember(newMember);
    });

    drone.on("message", (data) => {
      setMessages((messages) => [
        ...messages,
        { member: data.user, text: data.m },
      ]);
    });
    setDrone(drone);
  };

  const handleNameSubmit = (e) => {
    e.preventDefault();
    const name = e.target.name.value.trim();
    e.target.name.value = "";
    const newMember = { ...member };
    newMember.clientData.username = name;
    setMember(newMember);
    if (name) {
      droneCall();
    }
  };

  const onSendMessage = (message) => {
    const trimmedMessage = message.trim();
    if (!trimmedMessage) return;
    const newMember = { ...member };
    const value = { user: newMember, m: trimmedMessage };
    mainDrone.send(value);
  };
  if (!member.clientData.username) {
    return (
      <div className="name-input">
        <h1>What's your name?</h1>
        <form onSubmit={handleNameSubmit}>
          <input type="text" name="name" placeholder="Enter your name" />
          <button type="submit">Submit</button>
        </form>
      </div>
    );
  }

  return (
    <div className="App">
      <div className="App-header">
        <h1>Chat</h1>
      </div>
      <Messages messages={messages} currentMember={member} />
      <Input onSendMessage={onSendMessage} />
    </div>
  );
}

export default App;

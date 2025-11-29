import React, { useEffect, useRef, useState } from "react";
import { CometChat } from "@cometchat-pro/chat";

function ChatWindow({ currentUser, otherUser }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
 const listenerId = useRef(`listener_${crypto.randomUUID()}`);

  const scrollRef = useRef();

  useEffect(() => {
    // fetch previous messages with otherUser
    const UID = otherUser.uid;
    const limit = 50;

    const messagesRequest = new CometChat.MessagesRequestBuilder()
      .setUID(UID)
      .setLimit(limit)
      .build();

    messagesRequest.fetchPrevious().then(
      (fetched) => {
        setMessages(fetched);
        setTimeout(() => scrollRef.current?.scrollIntoView({ behavior: "smooth" }), 200);
      },
      (err) => console.error("Messages fetch error", err)
    );

    // add listener for incoming messages
    CometChat.addMessageListener(
      listenerId.current,
      new CometChat.MessageListener({
        onTextMessageReceived: (msg) => {
          // only add if from or to this conversation
          if ((msg.sender && msg.sender.uid === UID) || msg.receiver === UID) {
            setMessages((m) => [...m, msg]);
          }
        },
      })
    );

    return () => {
      CometChat.removeMessageListener(listenerId.current);
    };
  }, [otherUser.uid]);

  async function sendMessage() {
    if (!text.trim()) return;
    const receiverId = otherUser.uid;
    const messageText = text.trim();
    const textMessage = new CometChat.TextMessage(
      receiverId,
      messageText,
      CometChat.RECEIVER_TYPE.USER
    );

    try {
      const sent = await CometChat.sendMessage(textMessage);
      setMessages((m) => [...m, sent]);
      setText("");
      setTimeout(() => scrollRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    } catch (err) {
      console.error("Send message error", err);
    }
  }

  return (
    <div className="chat-window">
      <div className="chat-header">{otherUser.name || otherUser.uid}</div>
      <div className="messages">
        {messages.map((m) => (
          <div
            key={m.id || m._id}
            className={`msg ${m.sender && m.sender.uid === currentUser.uid ? "me" : "them"}`}
          >
            <div className="msg-author">{m.sender?.name || m.sender?.uid}</div>
            <div className="msg-text">{m.text || m.data?.text}</div>
          </div>
        ))}
        <div ref={scrollRef} />
      </div>

      <div className="composer">
        <input
          placeholder="Type a message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") sendMessage(); }}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default ChatWindow;

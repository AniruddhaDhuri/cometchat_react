import React, { useEffect, useState } from "react";
import ChatList from "../components/ChatList";
import ChatWindow from "../components/ChatWindow";
import { CometChat } from "@cometchat-pro/chat";

function Chat({ user, onLogout }) {
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    // optional: fetch friends/users for list
  }, []);

  return (
    <div className="chat-layout">
      <aside className="sidebar">
        <div className="sidebar-header">
          <div>Logged in: {user.name || user.uid}</div>
          <button onClick={() => { CometChat.logout().then(onLogout); }}>Logout</button>
        </div>
        <ChatList onSelect={(u) => setSelectedUser(u)} />
      </aside>
      <main className="main-chat">
        {selectedUser ? (
          <ChatWindow currentUser={user} otherUser={selectedUser} />
        ) : (
          <div className="empty">Select a user to start chat</div>
        )}
      </main>
    </div>
  );
}

export default Chat;

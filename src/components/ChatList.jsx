import React, { useEffect, useState } from "react";
import { CometChat } from "@cometchat-pro/chat";

/**
 * Simple user list: fetches users via CometChat.UsersRequest
 * Click a user to select for one-on-one chat
 */

function ChatList({ onSelect }) {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const limit = 30;
    const usersRequest = new CometChat.UsersRequestBuilder()
      .setLimit(limit)
      .build();

    usersRequest.fetchNext().then(
      (userList) => setUsers(userList),
      (err) => {
        console.error("Users fetch error", err);
      }
    );
  }, []);

  return (
    <div className="chat-list">
      <h3>Users</h3>
      <ul>
        {users.map((u) => (
          <li key={u.uid} onClick={() => onSelect(u)}>
            <div className="user-name">{u.name || u.uid}</div>
            <div className="user-uid">{u.uid}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ChatList;

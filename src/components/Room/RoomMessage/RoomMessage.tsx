import React, {useCallback, useMemo, useState} from 'react';
import styles from "./room-message.module.scss";
import RoomFiles from "../RoomFiles/RoomFiles";
import SocketApi from "../../../api/socket-api";
import {IMessage} from "../../../interfaces/IMessage";
import {useContextMenu} from "../../../hooks/useContextMenu";

interface PropsType {
  message: IMessage
  id: string
  isUserExist: boolean
  editMessage: (id: string, text: string) => void
}

const RoomMessage = ({message, id, isUserExist, editMessage}: PropsType) => {
  const [show, setShow] = useState(false);
  const { setContextMenu } = useContextMenu()

  const urlRegex = /(?:https?|ftp):\/\/[\n\S]+/g;

  function formatTime(dateTime: Date): string {
    const date = new Date(dateTime);
    const now = new Date();

    const diffDays = Math.round(Math.abs(now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays === 0) {
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      return `${hours}:${minutes}`;
    } else if (diffDays === 1) {
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      return `Yesterday ${hours}:${minutes}`;
    } else {
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear().toString();
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      return `${day}.${month}.${year}  ${hours}:${minutes}`;
    }
  }

  const deleteMessageFunc = (messageId: string, roomId: string) => {
    if (message.userId === id && isUserExist) {
      SocketApi.socket?.emit('chatToServerDelete', { id: messageId, roomId: roomId});
    }
  }

  const userContextMenu = useMemo(() => [
    {
      name: 'edit message',
      onClick: () => editMessage(message.id, message.text),
    },
    {
      name: 'delete message',
      onClick: () => deleteMessageFunc(message.id, message.roomId),
    }
  ], [])

  const otherUserContextMenu = useMemo(() => [
    {
      name: 'reply message',
      onClick: () => {},
    }
  ], [])

  const handleContextMenu = useCallback((event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      event.preventDefault();

      const { clientX, clientY } = event;
      if (message.userId === id) {
        setContextMenu(userContextMenu, [clientX, clientY]);
      } else {
        setContextMenu(otherUserContextMenu, [clientX, clientY]);
      }
  }, [setContextMenu, userContextMenu, otherUserContextMenu])

  return (
    <div key={message.id}
         onClick={() => setShow(!show)}
         className={message.userId === id ? styles.room_body_right : styles.room_body_left}
         onContextMenu={(event) => handleContextMenu(event)}
    >
      <div>
        <div className={styles.avatarBlock}>
          <img src={message.User?.avatar_url} alt="avatar"/>
        </div>
        <div>
          <div className={styles.msg_header}>
            <span className={styles.name}>{message.username}</span>
            <span className={styles.time}>{message.updatedAt === message.createdAt ? formatTime(message.createdAt) : `${formatTime(message.createdAt)} (edit at ${formatTime(message.updatedAt)})`}</span>
          </div>
          <div className={styles.msq_body}>
            <div>
              <div dangerouslySetInnerHTML={{
                __html: message.text?.replace(urlRegex, (url) => (
                  `<a href="${url}">${url}</a>`
                ))
              }}/>
            </div>
            {
              (message.files[0]?.path !== '' && message.files.length !== 0) && <RoomFiles message={message} />
            }
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomMessage;
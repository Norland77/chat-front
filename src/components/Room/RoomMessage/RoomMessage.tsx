import React, {useState} from 'react';
import styles from "./room-message.module.scss";
import RoomFiles from "../RoomFiles/RoomFiles";
import SocketApi from "../../../api/socket-api";
import {IMessage} from "../../../interfaces/IMessage";

interface PropsType {
  message: IMessage
  id: string
  isUserExist: boolean
  editMessage: (id: string, text: string) => void
}

const RoomMessage = ({message, id, isUserExist, editMessage}: PropsType) => {
  const [show, setShow] = useState(false);

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

  const deleteMessageFunc = (id: string, roomId: string) => {
    SocketApi.socket?.emit('chatToServerDelete', { id: id, roomId: roomId});
  }

  return (
    <div key={message.id}
         onClick={() => setShow(!show)}
         className={message.userId === id ? styles.room_body_right : styles.room_body_left}>
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

            <RoomFiles message={message} />
            <div className={styles.room_body_msgDown}>

              {
                message.userId === id && isUserExist && <>
                      <span onClick={() => deleteMessageFunc(message.id, message.roomId)} className={styles.btn}>delete</span>
                      <span onClick={() => editMessage(message.id, message.text)} className={styles.btn}>edit</span>
                  </>
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomMessage;
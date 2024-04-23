import React, {useState} from 'react';
import styles from "../../../pages/Room/room.module.scss";
import RoomFiles from "../RoomFiles/RoomFiles";
import {IMessage} from "../../../interfaces/IChat";
import SocketApi from "../../../api/socket-api";

interface PropsType {
  message: IMessage
  id: string
  isUserExist: boolean
  editMessage: (id: string, text: string) => void
}

const RoomMessage = ({message, id, isUserExist, editMessage}: PropsType) => {
  const [show, setShow] = useState(false);

  const urlRegex = /(?:https?|ftp):\/\/[\n\S]+/g;

  function formatTime(dateTime: Date) {
    const date = new Date(dateTime);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  const deleteMessageFunc = (id: string, roomId: string) => {
    SocketApi.socket?.emit('chatToServerDelete', { id: id, roomId: roomId});
  }

  return (
    <div key={message.id}
         onClick={() => setShow(!show)}
         className={message.userId === id ? styles.room_body_right : styles.room_body_left}>
      <div className={styles.msg_header}>
        <span className={styles.name}>{message.username}</span>
        <span className={styles.time}>{message.updatedAt === message.createdAt ? formatTime(message.createdAt) : `${formatTime(message.createdAt)} (edit at ${formatTime(message.updatedAt)})`}</span>
      </div>
      <div className={styles.msq_body}>
        <div dangerouslySetInnerHTML={{
          __html: message.text?.replace(urlRegex, (url) => (
            `<a href="${url}">${url}</a>`
          ))
        }}/>
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
  );
};

export default RoomMessage;
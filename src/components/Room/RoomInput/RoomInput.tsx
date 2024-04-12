import React, {Dispatch, SetStateAction, useState} from 'react';
import styles from "../../../pages/Room/room.module.scss";
import SocketApi from "../../../api/socket-api";
import {useParams} from "react-router-dom";
import {chatAPI} from "../../../services/ChatServices";

interface PropsType {
  isUserExist: boolean
  id: string
  username: string
  accessToken: string
  setIsEdit: Dispatch<SetStateAction<boolean>>
  setEditId: Dispatch<SetStateAction<string>>
  setEditMsg: Dispatch<SetStateAction<string>>
  isEdit: boolean
  editMsg: string
  editId: string
}

const RoomInput = ({isUserExist, id, username, accessToken, setEditMsg, editId, setEditId, setIsEdit, editMsg, isEdit}: PropsType) => {
  const [accept, {}] = chatAPI.useAcceptInviteMutation()
  const [refetchRoom, {}] = chatAPI.useRefetchRoomMutation();
  const [files, setFiles] = useState<File[]>([]);
  const [text, setText] = useState('');
  const [inputKey, setInputKey] = useState(0);
  const params = useParams();

  const updateMessageFunc = () => {
    SocketApi.socket?.emit('chatToServerUpdate', { id: editId, message: {text: editMsg, roomId: params.Id}});
    setIsEdit(false)
    setEditId('');
    setEditMsg('')
  }

  const sendMessage = () => {
    if (files.length > 0) {
      // Создать массив для хранения информации о файлах
      const filesInfo: { name: string; type: string; }[] = [];

      files.forEach(file => {
        const chunkSize = 1024;
        const fileSize = file.size;
        let offset = 0;
        // Добавить информацию о файле в массив
        filesInfo.push({name: file.name, type: file.type});
        while (offset < fileSize) {
          const chunk = file.slice(offset, offset + chunkSize);
          SocketApi.socket?.emit('uploadChunk', chunk);
          offset += chunkSize;
        }
      });

      // Отправить информацию о файлах и текстовое сообщение на сервер
      SocketApi.socket?.emit('chatToServer', { text: text, roomId: params.Id, userId: id, username: username, createdAt: new Date(), files: filesInfo });
    } else {
      // Если нет файлов, отправить только текстовое сообщение
      SocketApi.socket?.emit('chatToServer', { text: text, roomId: params.Id, userId: id, username: username, createdAt: new Date(), files: [] });
    }

    setText('');
    setInputKey(inputKey + 1);
  };

  const joinRoom = () => {
    accept({roomId: params.Id ? params.Id : '', token: accessToken, userId: id});
    refetchRoom({id: params.Id ? params.Id : '', token: accessToken});
  }

  const closeEdit = () => {
    setIsEdit(false)
    setEditId('');
    setEditMsg('')
  }

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      if (isEdit) {
        updateMessageFunc();
      } else {
        sendMessage();
      }
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = event.target.files;
    if (fileList) {
      const filesArray = Array.from(fileList);
      setFiles(filesArray);
    }
  };

  return (
    <div className={styles.room_body_input}>
      {
        isUserExist ? <>
          <input type="text" value={isEdit ? editMsg : text} onChange={isEdit ? (e) => {
            setEditMsg(e.target.value);
          } : (e) => {
            setText(e.target.value);
          }} onKeyPress={handleKeyPress}/>
          <button onClick={isEdit ? () => updateMessageFunc() : () => sendMessage()}>{isEdit ? "Edit" : "Send"}</button>
          <input type="file" multiple onChange={handleFileChange} key={inputKey} />
        </> : <button onClick={() => joinRoom()} className={styles.join_button}>Join to Chat</button>
      }
      {
        isEdit && <button onClick={() => closeEdit()}>X</button>
      }
    </div>
  );
};

export default RoomInput;
import React, { Dispatch, SetStateAction, useState } from 'react';
import styles from "../../../pages/Room/room.module.scss";
import SocketApi from "../../../api/socket-api";
import { useParams } from "react-router-dom";
import { chatAPI } from "../../../services/ChatServices";
import paperclip from '../../../img/paperclip.svg'
import sendIcon from '../../../img/send.svg'
import emojiIcon from '../../../img/emoji.svg'
import EmojiPicker from "emoji-picker-react";

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

const RoomInput = ({ isUserExist, id, username, accessToken, setEditMsg, editId, setEditId, setIsEdit, editMsg, isEdit }: PropsType) => {
  const [accept, {}] = chatAPI.useAcceptInviteMutation();
  const [refetchRoom, {}] = chatAPI.useRefetchRoomMutation();
  const [files, setFiles] = useState<File[]>([]);
  const [text, setText] = useState('');
  const [isEmojiOpen, setIsEmojiOpen] = useState(false);
  const [inputKey, setInputKey] = useState(0);
  const params = useParams();

  const updateMessageFunc = () => {
    SocketApi.socket?.emit('chatToServerUpdate', { id: editId, message: {text: editMsg, roomId: params.Id}});
    setIsEdit(false);
    setEditId('');
    setEditMsg('');
  }

  const sendMessage = () => {
    if (files.length > 0) {
      const filesInfo: { name: string; mimetype: string; }[] = [];

      files.forEach(file => {
        const chunkSize = 1024 * 10;
        const fileSize = file.size;
        let offset = 0;
        filesInfo.push({name: file.name, mimetype: file.type});
        while (offset < fileSize) {
          const chunk = file.slice(offset, offset + chunkSize);
          SocketApi.socket?.emit('uploadChunk', chunk);
          offset += chunkSize;
        }
      });
      SocketApi.socket?.emit('chatToServer', { text: text, roomId: params.Id, userId: id, username: username, createdAt: new Date(), files: filesInfo });
    } else {
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
    setIsEdit(false);
    setEditId('');
    setEditMsg('');
  }

  const handleKeyPress = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
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
    <div className={styles.room_body_input_body}>
      <div className={styles.room_body_input}>
        {
          isUserExist ? <>
            <textarea className={styles.msg_input}
                   placeholder={'Type message...'}
                   /*type="text"*/
                   value={isEdit ? editMsg : text}
                   onChange={isEdit ? (e) => {
              setEditMsg(e.target.value);
            } : (e) => {
              setText(e.target.value);
            }} onKeyPress={handleKeyPress}
                   onClick={() => {setIsEmojiOpen(false)}}
            />
            <label htmlFor="file-upload">
              <img src={paperclip} alt="paperclip"/>
            </label>
            <input type="file" id="file-upload" multiple onChange={handleFileChange} key={inputKey} style={{ display: 'none' }} />
            <div style={{position: 'relative', display: 'flex'}}>
              <button style={{border: 'none', background: 'none', cursor: 'pointer'}} onClick={() => {setIsEmojiOpen(!isEmojiOpen)}}>
                <img style={{width: '25px'}} src={emojiIcon} alt="emoji"/>
              </button>
              <EmojiPicker
                className={ isEmojiOpen ? styles.emojiOpen : styles.emojiClose}
                style={{position: 'absolute', bottom: '100%', right: '0'}}
                reactionsDefaultOpen={false}
                onEmojiClick={ (s) => {
                setText(prevState => prevState + s.emoji)
              }} />
            </div>
            <button onClick={isEdit ? () => updateMessageFunc() : () => sendMessage()}>
              {isEdit ? "Edit" : "Send"}
              <img src={sendIcon} alt="send"/>
            </button>
          </> : <button onClick={() => joinRoom()} className={styles.join_button}>Join to Chat</button>
        }
        {
          isEdit && <button onClick={() => closeEdit()}>X</button>
        }
      </div>
    </div>
  );
};

export default RoomInput;
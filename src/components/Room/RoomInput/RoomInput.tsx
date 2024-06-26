import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import styles from "./room-input.module.scss";
import SocketApi from "../../../api/socket-api";
import { useParams } from "react-router-dom";
import { chatAPI } from "../../../services/ChatServices";
import paperclip from '../../../img/paperclip.svg';
import sendIcon from '../../../img/send.svg';
import emojiIcon from '../../../img/emoji.svg';
import fileIcon from '../../../img/file.svg';
import videoIcon from '../../../img/videoPreview.svg';
import audioIcon from '../../../img/audio.svg';
import EmojiPicker from "emoji-picker-react";
import Button from "../../../UI/Button/Button";

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
  const [text, setText] = useState('');
  const [isEmojiOpen, setIsEmojiOpen] = useState(false);
  const [inputKey, setInputKey] = useState(0);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [nonImageFiles, setNonImageFiles] = useState<File[]>([]);
  const params = useParams();

  const updateMessageFunc = () => {
    SocketApi.socket?.emit('chatToServerUpdate', { id: editId, message: {text: editMsg, roomId: params.Id}});
    setIsEdit(false);
    setEditId('');
    setEditMsg('');
  }

  const sendMessage = () => {
    if (selectedFiles.length === 0 && (text === '' || /^\s*$/.test(text))) {
      return;
    }

    const filesToSend: { name: string; mimetype: string; }[] = [];

    selectedFiles.forEach(file => {
      if (file) {
        const chunkSize = 1024 * 10;
        const fileSize = file.size;
        let offset = 0;
        filesToSend.push({name: file.name, mimetype: file.type});
        while (offset < fileSize) {
          const isFinal = offset + chunkSize >= fileSize;
          const chunk = file.slice(offset, Math.min(offset + chunkSize, fileSize));
          SocketApi.socket?.emit('uploadChunk', chunk, isFinal);
          offset += chunkSize;
        }
      } else {
        setNonImageFiles(prevFiles => [...prevFiles, file]);
      }
    });

    SocketApi.socket?.emit('chatToServer', {
      text: text,
      roomId: params.Id,
      userId: id,
      username: username,
      createdAt: new Date(),
      files: filesToSend,
    });

    setText('');
    setInputKey(inputKey + 1);
    setSelectedFiles([]);
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
      event.preventDefault();
      if (isEdit) {
        updateMessageFunc();
      } else {
        sendMessage();
      }
    }
  };

  useEffect(() => {
    const newPreviewImages: string[] = [];
    const newNonImageFiles: File[] = [];
    for (const image of selectedFiles) {
      const objectUrl = URL.createObjectURL(image);
      const isImage = image.type.startsWith('image/');
      if (isImage) {
        newPreviewImages.push(objectUrl);
      } else {
        newNonImageFiles.push(image);
      }
    }

    setPreviewImages(newPreviewImages);
    setNonImageFiles(newNonImageFiles);

    return () => {
      newPreviewImages.forEach(URL.revokeObjectURL);
    };
  }, [selectedFiles]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const files = Array.from(event.target.files);
      setSelectedFiles(files);
    }
  };

  const maxHeight = 80;
  function expandTextarea(textarea: any) {
    textarea.style.height = 'auto';

    if (textarea.scrollHeight > maxHeight) {
      textarea.style.height = maxHeight + 'px';
      textarea.style.overflowY = 'auto';
    } else {
      textarea.style.height = Math.min(textarea.scrollHeight, maxHeight) + 'px';
    }
  }

  return (
    <>
      <div className={styles.previewFile}>
        {nonImageFiles.length > 0 && (
          <div className={styles.nonImageFiles}>
            {nonImageFiles.map((file, index) => (
              <div key={index}>
                <span>{file.name}</span>
                {
                  file.type.split('/')[0] === 'application' ?
                    <img src={fileIcon} alt="file"/> :
                    file.type.split('/')[0] === 'video' ?
                      <img src={videoIcon} alt="video"/> :
                      file.type.split('/')[0] === 'audio' ?
                        <img src={audioIcon} alt="audio"/> : <></>
                }
              </div>
            ))}
          </div>
        )}
        {
          selectedFiles.length > 0 && <button onClick={() => {setSelectedFiles([])}}>X</button>
        }
      </div>
      <div className={styles.room_body_input_body}>
        <div className={styles.room_body_input}>
          {
            isUserExist ? <>
            <textarea className={styles.msg_input}
                      placeholder={'Type message...'}
                      value={isEdit ? editMsg : text}
                      onChange={isEdit ? (e) => {
                        setEditMsg(e.target.value);
                      } : (e) => {
                        setText(e.target.value);
                      }} onKeyPress={handleKeyPress}
                      onClick={() => {setIsEmojiOpen(false)}}
                      onInput= {(event) => expandTextarea(event.target)}
                      rows={1}
            />
              {previewImages.map((previewUrl, index) => (
                <img key={index} src={previewUrl} alt={`Selected File Preview ${index + 1}`} />
              ))}
              <label htmlFor="file-upload">
                <img src={paperclip} alt="paperclip"/>
              </label>
              <input type="file" id="file-upload" multiple onChange={handleImageChange} key={inputKey} style={{ display: 'none' }} />
              <div style={{position: 'relative', display: 'flex'}}>
                <button style={{border: 'none', background: 'none', cursor: 'pointer'}} onClick={() => {setIsEmojiOpen(!isEmojiOpen)}}>
                  <img style={{width: '25px'}} src={emojiIcon} alt="emoji"/>
                </button>
                <EmojiPicker
                  className={ isEmojiOpen ? styles.emojiOpen : styles.emojiClose}
                  style={{position: 'absolute', bottom: '100%', right: '0'}}
                  reactionsDefaultOpen={false}
                  onEmojiClick={ isEdit ? (s) => {
                    setEditMsg(prevState => prevState + s.emoji)
                  } : (s) => {
                    setText(prevState => prevState + s.emoji)
                  }} />
              </div>
              <Button text={isEdit ? "Edit" : "Send"}
                      img={sendIcon}
                      onClick={isEdit ? updateMessageFunc : sendMessage}
                      font_size={'20px'}
                      height={'45px'}
              />
            </> : <Button text={'Join to Chat'}
                          onClick={joinRoom}
                          width={'100%'}
                          font_size={'20px'}
                  />
          }
          {
            isEdit && <Button text={'X'} onClick={closeEdit}
                              font_size={'20px'}/>
          }
        </div>
      </div>
    </>
  );
};

export default RoomInput;
import styles from './room-create-modal.module.scss'
import {chatAPI} from "../../services/ChatServices";
import {useAppSelector} from "../../hooks/redux";
import React, {Dispatch, SetStateAction, useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import SocketApi from "../../api/socket-api";
import cameraIcon from '../../img/camera.svg';
import privateIcon from '../../img/private.svg';
import unlockIcon from '../../img/unlock.svg';

interface PropsType {
  isOpen: boolean
  setIsOpen: Dispatch<SetStateAction<boolean>>
}

const RoomCreateModal = ({isOpen, setIsOpen}: PropsType) => {
    const [text, setText] = useState('')
    const [isPrivate, setIsPrivate] = useState(false)
    const {accessToken, id} = useAppSelector(state => state.userReducer)
    const navigate = useNavigate();
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [inputKey2, setInputKey] = useState(0);

  const createRoomFunc = () => {
    if (selectedImage) {
      const chunkSize = 1024 * 10;
      const fileSize = selectedImage.size;
      let offset = 0;
      console.log(selectedImage);
      while (offset < fileSize) {
        const chunk = selectedImage.slice(offset, offset + chunkSize);
        SocketApi.socket?.emit('uploadChunk', chunk);
        offset += chunkSize;
      }
      SocketApi.socket?.emit('chatToServerCreateChat', {file: {name: selectedImage.name, mimetype: selectedImage.type}, userId: id, name: text, isPrivate: isPrivate});
    }
    SocketApi.socket?.emit('chatToServerCreateChat', {userId: id, name: text, isPrivate: isPrivate});
    clearInputs();
    setInputKey(inputKey2 + 1);
    setIsOpen(false);
    }

  useEffect(() => {
    if (!selectedImage) {
      setPreviewImage(null);
      return;
    }

    const objectUrl = URL.createObjectURL(selectedImage);
    setPreviewImage(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedImage]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const file = event.target.files[0];
      if (!file || !file.type.startsWith('image/')) {
        setSelectedImage(null);
        setPreviewImage(null);
        return;
      }
      setSelectedImage(file);
    }
  };

  const clearInputs = () => {
    setText('');
    setIsPrivate(false);
    setSelectedImage(null);
  }

  const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target !== event.currentTarget) {
      event.stopPropagation();
    } else {
      clearInputs();
      setIsOpen(false);
    }
  };

    return (
      <div onClick={(e) => handleOverlayClick(e)} className={styles.overlay} style={ isOpen ? {display: "flex"} : {display: 'none'}}>
        <div className={styles.body}>
          <div>
            <div>
              <label className={styles.ava_label} htmlFor="file_ava">{previewImage ? <img src={previewImage} alt="Chat avatar preview" /> :
                <img style={{width: '80%'}} src={cameraIcon} alt="avatar"/>}</label>
              <input key={inputKey2} onChange={(e) => handleImageChange(e)} style={{display: 'none'}} id={'file_ava'} type="file" accept="image/*"/>
            </div>
            <div>
              <label className={styles.name_label} htmlFor='name'>Chat name</label>
              <input name={'name'} id={'name'} type="text" value={text} onChange={(e) => {
                setText(e.target.value)
              }}/>
            </div>
            <div className={styles.body_privat}>
              <input onChange={(e) => {setIsPrivate(e.target.checked)}} type="checkbox" id={'private'} name={'private'} value={'private'} checked={isPrivate} style={{display: 'none'}}/>
              <label className={styles.privateLabel} htmlFor='private'><img src={isPrivate ? privateIcon : unlockIcon} alt="private"/></label>
            </div>
          </div>
          <div className={styles.buttonsBlock}>
            <button onClick={() => {setIsOpen(false); clearInputs();}}>Cansel</button>
            <button onClick={() => createRoomFunc()}>Create room</button>
          </div>
        </div>
      </div>
    );
};

export default RoomCreateModal;
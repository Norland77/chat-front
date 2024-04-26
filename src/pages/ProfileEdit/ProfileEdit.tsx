import React, {Dispatch, SetStateAction, useEffect, useState} from 'react';
import {useAppSelector} from "../../hooks/redux";
import SocketApi from "../../api/socket-api";
import styles from './profile-edit.module.scss'
import {chatAPI} from "../../services/ChatServices";
import cameraIcon from "../../img/camera.svg";
import {IUser} from "../../interfaces/IChat";
import {MutationTrigger} from "@reduxjs/toolkit/dist/query/react/buildHooks";
import {MutationDefinition} from "@reduxjs/toolkit/query";

interface PropsType {
  isModalOpen: boolean;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>
  user: IUser | undefined
  fetchUser: any
}

const ProfileEdit = ({isModalOpen, setIsModalOpen, user, fetchUser}: PropsType) => {
  const { accessToken, id } = useAppSelector(state => state.userReducer);
  const [email, setEmail] = useState('');
  const [number, setNumber] = useState('');
  const [description, setDescription] = useState('');
  const [inputKey2, setInputKey] = useState(0);
  const [selectedImageEdit, setSelectedImageEdit] = useState<File | null>(null);
  const [previewImageEdit, setPreviewImageEdit] = useState<string | null>(null);
  const [editUser, {}] = chatAPI.useEditUserByIdMutation()

  useEffect(() => {
    if (!selectedImageEdit) {
      setPreviewImageEdit(null);
      return;
    }

    const objectUrl = URL.createObjectURL(selectedImageEdit);
    setPreviewImageEdit(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedImageEdit]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log(event.target);
    if (event.target.files) {
      const file = event.target.files[0];
      if (!file || !file.type.startsWith('image/')) {
        setSelectedImageEdit(null);
        setPreviewImageEdit(null);
        return;
      }
      setSelectedImageEdit(file);
    }
  };

  useEffect(() => {
    if (user?.description) {
      setDescription(user.description);
    }
    if (user?.email) {
      setEmail(user.email);
    }
    if (user?.phone_number) {
      setNumber(user.phone_number);
    }
  }, [user]);

  const setAvatar = () => {
    if (selectedImageEdit) {
      const chunkSize = 1024 * 10;
      const fileSize = selectedImageEdit.size;
      let offset = 0;
      console.log(selectedImageEdit);
      while (offset < fileSize) {
        const chunk = selectedImageEdit.slice(offset, offset + chunkSize);
        SocketApi.socket?.emit('uploadChunk', chunk);
        offset += chunkSize;
      }
      SocketApi.socket?.emit('chatToServerSetAvatar', {file: {name: selectedImageEdit.name, mimetype: selectedImageEdit.type}, userId: id});
    }
    setIsModalOpen(false);
    fetchUser({accessToken: accessToken, id: id});
  };

  const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target !== event.currentTarget) {
      event.stopPropagation();
    } else {
      setIsModalOpen(false);
    }
  };


  return (
    <div onClick={(e) => handleOverlayClick(e)} className={styles.overlay} style={ isModalOpen ? {display: "flex"} : {display: 'none'}}>
      <div className={styles.body}>
        <div className={styles.inputsBlock}>
          <input type="text" value={email} name={'email'} placeholder={'email'} onChange={(e) => {setEmail(e.target.value)}}/>
          <input type="text" value={number} name={'number'} placeholder={'number'} onChange={(e) => {setNumber(e.target.value)}}/>
          <input type="text" value={description} name={'description'} placeholder={'description'} onChange={(e) => {setDescription(e.target.value)}}/>
          <button onClick={() => {
            editUser({accessToken, dto: {id, phone_number: number, email, description}});
            setIsModalOpen(false);
            fetchUser({accessToken: accessToken, id: id});
          }
          }>Edit Info</button>
        </div>
        <div>
          <div>
            <label className={styles.ava_label} htmlFor="file_ava_edit">{previewImageEdit ? <img src={previewImageEdit} alt="Chat avatar preview" /> :
              user?.avatar_url ? <img src={user.avatar_url} alt="avatar"/> :
                <img style={{width: '30%'}} src={cameraIcon} alt="avatar"/>}</label>
            <input key={inputKey2} onChange={(e) => handleImageChange(e)} style={{display: 'none'}} id={'file_ava_edit'} type="file" accept="image/*"/>
          </div>
          <button onClick={() => setAvatar()}>Set Avatar</button>
        </div>
      </div>
    </div>
  );
};

export default ProfileEdit;
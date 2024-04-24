import React, {useState} from 'react';
import {useAppSelector} from "../../hooks/redux";
import SocketApi from "../../api/socket-api";
import styles from './profile-edit.module.scss'
import {chatAPI} from "../../services/ChatServices";

const ProfileEdit = () => {
  const { accessToken, id } = useAppSelector(state => state.userReducer);
  const [email, setEmail] = useState('');
  const [number, setNumber] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File>();
  const [inputKey2, setInputKey] = useState(0);
  const [editUser, {}] = chatAPI.useEditUserByIdMutation()
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFile(file);
    }
  };

  const setAvatar = () => {
    if (file) {
      const chunkSize = 1024 * 10;
      const fileSize = file.size;
      let offset = 0;
      console.log(file);
      while (offset < fileSize) {
        const chunk = file.slice(offset, offset + chunkSize);
        SocketApi.socket?.emit('uploadChunk', chunk);
        offset += chunkSize;
      }
      SocketApi.socket?.emit('chatToServerSetAvatar', {file: {name: file.name, mimetype: file.type}, userId: id});
    }
    console.log(inputKey2)
    setFile(undefined);
    setInputKey(inputKey2 + 1);
  };



  return (
      <div className={styles.body}>
        <input type="text" value={email} name={'email'} placeholder={'email'} onChange={(e) => {setEmail(e.target.value)}}/>
        <input type="text" value={number} name={'number'} placeholder={'number'} onChange={(e) => {setNumber(e.target.value)}}/>
        <input type="text" value={description} name={'description'} placeholder={'description'} onChange={(e) => {setDescription(e.target.value)}}/>
        <button onClick={() => {
          editUser({accessToken, dto: {id, phone_number: number, email, description}});
          setDescription('');
          setNumber('');
          setEmail('');
        }
        }>Edit Info</button>
        <input key={inputKey2} type="file" onChange={handleFileChange}/>
        <button onClick={() => setAvatar()}>Set Avatar</button>
      </div>
  );
};

export default ProfileEdit;
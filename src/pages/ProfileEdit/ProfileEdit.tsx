import React, {useState} from 'react';
import {useAppSelector} from "../../hooks/redux";

const ProfileEdit = () => {
  const { accessToken, id } = useAppSelector(state => state.userReducer);
  const [email, setEmail] = useState('');
  const [number, setNumber] = useState('');
  const [description, setDescription] = useState('');
  return (
      <div>
        <input type="text" value={email} name={'email'} placeholder={'email'}/>
        <input type="text" value={number} name={'number'} placeholder={'number'}/>
        <input type="text" value={description} name={'description'} placeholder={'description'}/>
        <input type="file"/>
      </div>
  );
};

export default ProfileEdit;
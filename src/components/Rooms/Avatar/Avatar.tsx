import React from 'react';
import {chatAPI} from "../../../services/ChatServices";
import {IRoom} from "../../../interfaces/IChat";
import {useAppSelector} from "../../../hooks/redux";
import styles from './avatar.module.scss'
interface PropsType {
  room: IRoom | undefined
}

const Avatar = ({room}: PropsType) => {
  const {id, accessToken} = useAppSelector(state => state.userReducer)
  const userId = room && room.firstUserId === id ? room.secondUserId : room && room.firstUserId;
  const {data: user} = chatAPI.useGetUserByIdQuery({accessToken, id: userId})

  return (
    <img className={styles.avatar} src={user?.avatar_url} alt="avatart"/>
  );
};

export default Avatar;
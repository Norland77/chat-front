import React from 'react';
import {chatAPI} from "../../services/ChatServices";
import {useAppSelector} from "../../hooks/redux";
import styles from './avatar.module.scss'
import {IRoom} from "../../interfaces/IRoom";
interface PropsType {
  room: IRoom | undefined
  width: string;
  height: string;
}

const Avatar = ({room, height, width}: PropsType) => {
  const {id, accessToken} = useAppSelector(state => state.userReducer)
  const userId = room ? (room.firstUserId === id ? room.secondUserId : room.firstUserId) : undefined;
  const skip = !userId;
  const { data: user } = chatAPI.useGetUserByIdQuery(
    { accessToken, id: userId },
    { skip }
  );

  return (
    <>
      {
        room && room.isPersonal && user?.avatar_url ? <img style={{width: width, height: height}} className={styles.avatar} src={user?.avatar_url} alt="avatart"/> :
          room && room.isPersonal && !user?.avatar_url ? <div style={{width: width, height: height}} className={styles.avatarNone}>{user?.username[0]}</div> :
            room && !room.isPersonal && room?.avatar_url ? <img style={{width: width, height: height}} className={styles.avatar} src={room?.avatar_url} alt="avatart"/> :
              room && !room.isPersonal && !room?.avatar_url ? <div style={{width: width, height: height}} className={styles.avatarNone}>{room?.name[0]}</div> : <></>
      }
    </>

  );
};

export default Avatar;
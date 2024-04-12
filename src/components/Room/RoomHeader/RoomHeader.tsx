import React from 'react';
import styles from "../../../pages/Room/room.module.scss";
import {Link} from "react-router-dom";
import {IRoom} from "../../../interfaces/IChat";


interface PropsType {
  userCount: number
  room: IRoom | undefined
  id: string
  deleteRoomFunc: () => void
}

const RoomHeader = ({userCount, room, id, deleteRoomFunc} : PropsType) => {
  return (
    <div className={styles.room_header}>
      <p>Users in room: {userCount}</p>
      {
        room && room.ownerId === id && <Link onClick={() => deleteRoomFunc()} to={"/home"}>Delete Room</Link>
      }
    </div>
  );
};

export default RoomHeader;
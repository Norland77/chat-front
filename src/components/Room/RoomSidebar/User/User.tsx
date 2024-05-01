import React, {useCallback, useEffect, useMemo} from 'react';
import styles from "../room-sidebar.module.scss";
import {chatAPI} from "../../../../services/ChatServices";
import {useNavigate, useParams} from "react-router-dom";
import {useContextMenu} from "../../../../hooks/useContextMenu";
import {IUser} from "../../../../interfaces/IUser";
import {IRoom} from "../../../../interfaces/IRoom";
import SocketApi from "../../../../api/socket-api";

interface PropsType {
  username: string
  accessToken: string
  id: string
  user: IUser
  room: IRoom | undefined
}

const User = ({username, accessToken, id, user, room}: PropsType) => {
  const {data: rooms} = chatAPI.useFetchAllRoomsQuery(accessToken)
  const [createPersonalRoom, {data: roomCreated}] = chatAPI.useCreatePersonalRoomMutation();
  const [leaveRoom, {}] = chatAPI.useLeaveRoomMutation();
  const navigate = useNavigate();
  const params = useParams();
  const { setContextMenu } = useContextMenu()

  useEffect(() => {
    if (roomCreated)
      return navigate(`/home/room/${roomCreated && roomCreated.id}`);
  }, [roomCreated]);
  const createRoom = (username1: string, secondId: string) => {
    if (username1 === username) {
      return;
    }
    const name = `${username1},${username}`.split(',')
    const sortedFirstArr = name.sort();
    let isFind = false;
    rooms && rooms.map(room => {
      const secondName = room.name.split(',')
      const sortedSecondArr = secondName.sort();
      if (JSON.stringify(sortedFirstArr) === JSON.stringify(sortedSecondArr)) {
        isFind = true;
        return navigate(`/home/room/${room.id}`);
      }
    })

    if (isFind) {
      return
    } else {
      createPersonalRoom({token: accessToken, name: `${username1},${username}`, isPrivate: true, isPersonal: true, firstUserId: id, secondUserId: secondId})
    }
  }

  const kick = (id: string) => {
    leaveRoom({roomId: params.Id ? params.Id: "", userId: id, token: accessToken})
    SocketApi.socket?.emit('kickUser', { roomId: params.Id });
  }

  const AdminContextMenu = useMemo(() => [
    {
      name: 'show user info',
      onClick: () => {},
    },
    {
      name: 'write to user',
      onClick: () => createRoom(user.username, user.id),
    },
    {
      name: 'kick out',
      onClick: () => kick(user.id),
    }

  ], [])

  const CommonContextMenu = useMemo(() => [
    {
      name: 'show user info',
      onClick: () => {},
    },
    {
      name: 'write to user',
      onClick: () => createRoom(user.username, user.id),
    }
  ], [])

  const SelfContextMenu = useMemo(() => [
    {
      name: 'show user info',
      onClick: () => {},
    }
  ], [])

  const handleContextMenu = useCallback((event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    event.preventDefault();

    const { clientX, clientY } = event;
    if (room && room.ownerId === id && room.ownerId !== user.id) {
      setContextMenu(AdminContextMenu, [clientX, clientY]);
    } else if (id === user.id) {
      setContextMenu(SelfContextMenu, [clientX, clientY]);
    } else {
      setContextMenu(CommonContextMenu, [clientX, clientY]);
    }
  }, [setContextMenu, AdminContextMenu, CommonContextMenu, SelfContextMenu])

  return (
    <div className={styles.sidebar_users_user}
         onContextMenu={handleContextMenu}
    >
      <div onClick={() => createRoom(user.username, user.id)} key={user.id}>
        <img src={user.avatar_url} alt="avatar"/>
        <div>
          <span className={styles.name}>{user.username}</span>
          {room && room.ownerId === user.id &&
              <span className={styles.role}>Admin</span>}
        </div>
      </div>
    </div>
  );
};

export default User;
import React, {useEffect, useState} from 'react';
import styles from "../../../pages/Room/room.module.scss";
import {IRoom} from "../../../interfaces/IChat";
import {chatAPI} from "../../../services/ChatServices";
import {useNavigate, useParams} from "react-router-dom";
import SocketApi from "../../../api/socket-api";

interface PropsType {
  room: IRoom | undefined
  username: string
  accessToken: string
  id: string
  deleteRoomFunc: () => void
}

const RoomSidebar = ({room, username, accessToken, id, deleteRoomFunc}: PropsType) => {
  const [inviteLink, setInviteLink] = useState('');
  const [createInvite, {}] = chatAPI.useCreateInviteMutation();
  const [createPersonalRoom, {data: roomCreated}] = chatAPI.useCreatePersonalRoomMutation();
  const [leaveRoom, {}] = chatAPI.useLeaveRoomMutation();
  const {data: rooms} = chatAPI.useFetchAllRoomsQuery(accessToken)
  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (room && room.inviteLink) {
      setInviteLink(room.inviteLink);
    }

    return() => {
      setInviteLink('')
    }
  }, [room]);

  useEffect(() => {
    if (roomCreated)
      return navigate(`/home/room/${roomCreated && roomCreated.id}`);
  }, [roomCreated]);

  const generateLink = () => {
    let abc = "abcdefghijklmnopqrstuvwxyz1234567890";
    let hash = "";
    while (hash.length < 15) {
      hash += abc[Math.floor(Math.random() * abc.length)];
    }
    setInviteLink(`http://localhost:3000/${hash}`)
    createInvite({dto: {roomId: params.Id ? params.Id : "", token: hash, accept: true, inviteLink: `http://localhost:3000/${hash}`}, token: accessToken});
  }

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

  const leave = () => {
    leaveRoom({roomId: params.Id ? params.Id: "", userId: id, token: accessToken});

    return navigate('/home');
  }

  const kick = (id: string) => {
    leaveRoom({roomId: params.Id ? params.Id: "", userId: id, token: accessToken})
    SocketApi.socket?.emit('kickUser', { roomId: params.Id });
  }

  return (
    <div className={styles.sidebar}>
      {
        room && room.isPersonal ?
          <h2>{room && room.name.split(",")[0] === username ? room.name.split(",")[1] : room.name.split(",")[0]}</h2> :
          <h2>{room && room.name}</h2>
      }
      {
        room && !room.isPersonal && <div>
              <div className={styles.sidebar_invite}>
                  <input type="text" readOnly value={inviteLink}/>
                  <button style={{display: inviteLink !== '' ? "none" : "block"}}
                          onClick={() => generateLink()}>Generate invite link
                  </button>
              </div>
              <div className={styles.sidebar_users}>
                {room && room.users?.map(user => (
                  <div className={styles.sidebar_users_user}>
                    <div onClick={() => createRoom(user.username, user.id)} key={user.id}>
                      {user.username} {room && room.ownerId === user.id &&
                        <span>(Owner)</span>
                    }
                    </div>
                    {
                      room && room.ownerId === id && room.ownerId !== user.id &&
                        <button onClick={() => kick(user.id)}>kick out</button>
                    }
                  </div>

                ))}
              </div>
          </div>
      }
      {
        room && !room.isPersonal && room.ownerId !== id &&
          <button onClick={() => leave()}>Leave from Room</button>
      }
      {
        room && room.isPersonal && <button onClick={() => deleteRoomFunc()}>Delete chat</button>
      }
    </div>
  );
};

export default RoomSidebar;
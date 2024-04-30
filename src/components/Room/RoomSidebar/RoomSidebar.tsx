import React, {useEffect, useState} from 'react';
import styles from "./room-sidebar.module.scss";
import {chatAPI} from "../../../services/ChatServices";
import {useNavigate, useParams} from "react-router-dom";
import SocketApi from "../../../api/socket-api";
import ModalImage from "../../ModalImage/ModalImage";
import Avatar from "../../../UI/Avatar/Avatar";
import Button from "../../../UI/Button/Button";
import {IRoom} from "../../../interfaces/IRoom";

interface PropsType {
  room: IRoom | undefined
  username: string
  accessToken: string
  id: string
  deleteRoomFunc: () => void
}

const RoomSidebar = ({room, username, accessToken, id, deleteRoomFunc}: PropsType) => {
  const [inviteLink, setInviteLink] = useState('');
  const [isOpenImg, setIsOpenImg] = useState(false);
  const [imgName, setImgName] = useState('');
  const [createInvite, {}] = chatAPI.useCreateInviteMutation();
  const [createPersonalRoom, {data: roomCreated}] = chatAPI.useCreatePersonalRoomMutation();
  const [leaveRoom, {}] = chatAPI.useLeaveRoomMutation();
  const {data: rooms} = chatAPI.useFetchAllRoomsQuery(accessToken)
  const roomId = room?.id
  const {data: images} = chatAPI.useGetAllImagesByRoomQuery({roomId, accessToken})
  const params = useParams();
  const navigate = useNavigate();

  const userId = room && room.firstUserId === id ? room.secondUserId : room && room.firstUserId;

  const {data: user} = chatAPI.useGetUserByIdQuery({accessToken, id: userId})

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

  const kick = (id: string) => {
    leaveRoom({roomId: params.Id ? params.Id: "", userId: id, token: accessToken})
    SocketApi.socket?.emit('kickUser', { roomId: params.Id });
  }

  return (
    <div className={styles.sidebar}>
      {
        room && room.isPersonal ?
          <div className={styles.sidebar_userInfo}>
            <Avatar room={room} width={'100px'} height={'100px'} />
            <h2>{user?.username}</h2>
            <span>User Info</span>
            <div>
              <span>{user?.phone_number}</span>
              <span className={styles.sidebar_userInfo_subtitle}>Phone number</span>
            </div>
            <div>
              <span>{user?.email}</span>
              <span className={styles.sidebar_userInfo_subtitle}>Email</span>
            </div>
            <div>
              <span>{user?.description}</span>
              <span className={styles.sidebar_userInfo_subtitle}>Description</span>
            </div>
          </div> :
          <div className={styles.sidebar_userInfo}>
            {
              room?.avatar_url ? <img src={room?.avatar_url} alt="avatar"/> : <div className={styles.avatarNone}>{room?.name[0]}</div>
            }
            <h2>{room?.name}</h2>
            <span>Chat Info</span>
            <div>
              <span>Test desc</span>
              <span className={styles.sidebar_userInfo_subtitle}>Description</span>
            </div>
          </div>
      }
      {
        room && !room.isPersonal && <div>
              <div className={styles.sidebar_invite}>
                  <input type="text" readOnly value={inviteLink}/>
                {
                  room.ownerId === id &&
                    <div style={{display: inviteLink !== '' ? "none" : "flex", justifyContent: 'center'}}>
                        <Button text={'Generate invite link'}
                                onClick={generateLink}
                                width={'90%'}
                                font_size={'12px'}
                        />
                    </div>
                }
              </div>
              <div className={styles.sidebar_users}>
                  <h3>User list</h3>
                {room && room.users?.map(user => (
                  <div className={styles.sidebar_users_user}>
                    <div onClick={() => createRoom(user.username, user.id)} key={user.id}>
                      <img src={user.avatar_url} alt="avatar"/>
                      <div>
                        <span className={styles.name}>{user.username}</span>
                        {room && room.ownerId === user.id &&
                          <span className={styles.role}>Admin</span>}
                      </div>
                    </div>
                    {
                      room && room.ownerId === id && room.ownerId !== user.id &&
                        <span onClick={() => kick(user.id)}>kick out</span>
                    }
                  </div>

                ))}
              </div>
          </div>
      }
      <h3 style={{marginTop: '20px'}}>Images</h3>
      <div className={styles.image_grid}>
        {
          images && images.map(img => (
            <>
              <img onClick={() => {
                setIsOpenImg(true);
                setImgName(img.name);
              }} src={`${img.path}`} alt={`${img.name}`}/>
              <div onClick={() => {
                setIsOpenImg(false);
                setImgName('');
              }} style={isOpenImg && imgName === img.name ? {display: "flex"} : {}} className={styles.modal}>
                <ModalImage imageUrl={img.path} imageName={img.name} />
              </div>
            </>
          ))
        }
      </div>
    </div>
  );
};

export default RoomSidebar;
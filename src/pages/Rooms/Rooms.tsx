import React, { useState } from 'react';
import { chatAPI } from "../../services/ChatServices";
import styles from './rooms.module.scss';
import SocketApi from "../../api/socket-api";
import { useAppSelector } from "../../hooks/redux";
import { Link, useParams } from "react-router-dom";
import groupChat from '../../img/groupChat.svg';
import Avatar from "../../UI/Avatar/Avatar";

const Rooms = () => {
    const { accessToken, id, username } = useAppSelector(state => state.userReducer);
    const { data: rooms } = chatAPI.useFetchAllRoomsQuery(accessToken);
    const params = useParams();
    const [searchTerm, setSearchTerm] = useState('');

    const joinToRoom = (id: string) => {
        SocketApi.socket?.emit('joinRoom', id);
    };

    function formatTime(dateTime: Date): string {
        const date = new Date(dateTime);
        const now = new Date();

        const diffDays = Math.round(Math.abs(now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
        if (diffDays === 0) {
            const hours = date.getHours().toString().padStart(2, '0');
            const minutes = date.getMinutes().toString().padStart(2, '0');
            return `${hours}:${minutes}`;
        } else if (diffDays === 1) {
            const hours = date.getHours().toString().padStart(2, '0');
            const minutes = date.getMinutes().toString().padStart(2, '0');
            return `Yesterday - ${hours}:${minutes}`;
        } else {
            const day = date.getDate().toString().padStart(2, '0');
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const year = date.getFullYear().toString();
            return `${day}.${month}.${year}`;
        }
    }

    const filteredRooms = rooms?.filter(room => (
      room.users.find(user => user.id === id) || !room.isPrivate
    ) && (
      room.name.trim().toLowerCase().includes(searchTerm.trim().toLowerCase()) ||
      (room.isPersonal && room.name.split(",")[0].trim().toLowerCase().includes(searchTerm.trim().toLowerCase()))
    ));

    return (
      <div className={styles.body}>
          <div className={styles.search}>
              <input
                type="text"
                className={styles.searchInput}
                placeholder="Search Chats..."
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
          </div>
          {filteredRooms && filteredRooms?.length > 0 ? filteredRooms.map(room => (
            <div key={room.id} className={styles.roomBlock}>
                <Link to={`/home/room/${room.id}`} key={room.id} onClick={() => {
                    joinToRoom(room.id)
                }} className={`${room.id === params.Id && styles.active} ${styles.room}`}>
                    {
                        <Avatar height={'80%'} width={'20%'} room={room}/>
                    }
                    <div>
                        <div>
                            <div className={styles.room_name}>
                                <p>{room.name.split(",")[0] === username ? room.name.split(",")[1] : room.name.split(",")[0]}</p>
                                { !room.isPersonal && <img src={groupChat} alt="groupChat"/> }
                            </div>
                            <span>{room.messages.length > 0 && formatTime(room.messages[room.messages.length - 1].createdAt)}</span>
                        </div>
                        <div className={styles.room_msg}>
                            {
                              !room.isPersonal && <span>{room.messages.length > 0 && `${room.messages[room.messages.length - 1].username}:`}</span>
                            }
                            {
                                room.messages.length > 0 && room.messages[room.messages.length - 1].text !== '' && room.messages[room.messages.length - 1].files[0].path === '' ?
                                  <p>{ room.messages[room.messages.length - 1].text }</p>
                                   : room.messages.length > 0 && room.messages[room.messages.length - 1].text === '' ?
                                  <>
                                      {
                                          room.messages[room.messages.length - 1].files?.map(img => (
                                            <img key={img.id} src={img.path} alt={img.name} />
                                          ))
                                      }
                                  </> : room.messages.length > 0 && room.messages[room.messages.length - 1].text !== '' && room.messages[room.messages.length - 1].files.length > 0 ? <>
                                        {
                                            <>
                                                {
                                                    room.messages[room.messages.length - 1].files?.map(img => (
                                                      <img src={img.path} alt={img.name} />
                                                    ))
                                                }
                                                <p>{ room.messages[room.messages.length - 1].text }</p>
                                            </>

                                        }
                                    </> : <></>
                            }
                        </div>
                    </div>
                </Link>
            </div>
          )) : <>
              <h3 className={styles.notFound}>Not found</h3>
          </>}
      </div>
    );
};

export default Rooms;
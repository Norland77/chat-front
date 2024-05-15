import React, {useState} from 'react';
import styles from "./room-header.module.scss";
import {Link, useParams} from "react-router-dom";
import Avatar from "../../../UI/Avatar/Avatar";
import {useAppSelector} from "../../../hooks/redux";
import {chatAPI} from "../../../services/ChatServices";
import {IRoom} from "../../../interfaces/IRoom";
import {IUser} from "../../../interfaces/IUser";

interface PropsType {
  userCount: number
  room: IRoom | undefined
  id: string
  deleteRoomFunc: () => void
}

const RoomHeader = ({userCount, room, id, deleteRoomFunc} : PropsType) => {
  const { accessToken} = useAppSelector(state => state.userReducer)
  const userId = room ? (room.firstUserId === id ? room.secondUserId : room.firstUserId) : undefined;
  const skip = !userId;
  const { data: user } = chatAPI.useGetUserByIdQuery(
    { accessToken, id: userId },
    { skip }
  );
  const [show, setShow] = useState(false);
  const [leaveRoom, {}] = chatAPI.useLeaveRoomMutation();
  const params = useParams();

  const leave = () => {
    leaveRoom({roomId: params.Id ? params.Id: "", userId: id, token: accessToken});
  }

  return (
    <div className={styles.room_header}>
      <div>
        <Avatar width={'50px'} height={'50px'} room={room} />
        <div>
          <h3>{room?.isPersonal ? user?.username : room?.name}</h3>
          {
            room && room.isPersonal ? <>
            {
              userCount === 2 ? <p className={styles.online}>Online</p> : <p className={styles.offline}>Offline</p>
            }
              </> : <>
              <p className={styles.online}>Online: {userCount}</p>
            </>
          }
        </div>
      </div>
      <div className={styles.header_right}>
        {
          room && room.isPersonal && <>
                <div>
                    <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M30 22.3667V28.26C30.0002 28.682 29.8403 29.0883 29.5527 29.397C29.265 29.7057 28.8709 29.8938 28.45 29.9233C27.7217 29.9733 27.1267 30 26.6667 30C11.9383 30 0 18.0617 0 3.33333C0 2.87333 0.025 2.27833 0.0766667 1.55C0.106204 1.12907 0.294302 0.735018 0.603006 0.447348C0.91171 0.159678 1.31804 -0.000190722 1.74 4.27632e-07H7.63333C7.84007 -0.000208891 8.03949 0.0764317 8.19288 0.215034C8.34627 0.353636 8.44266 0.544305 8.46333 0.750001C8.50167 1.13333 8.53667 1.43833 8.57 1.67C8.90122 3.98154 9.58 6.22972 10.5833 8.33833C10.7417 8.67167 10.6383 9.07 10.3383 9.28333L6.74167 11.8533C8.94076 16.9774 13.0242 21.0609 18.1483 23.26L20.715 19.67C20.8199 19.5233 20.973 19.4181 21.1475 19.3728C21.322 19.3274 21.5069 19.3447 21.67 19.4217C23.7783 20.4232 26.0259 21.1003 28.3367 21.43C28.5683 21.4633 28.8733 21.4983 29.2533 21.5367C29.4587 21.5577 29.649 21.6543 29.7873 21.8076C29.9255 21.961 30.0002 22.1602 30 22.3667Z" fill="#A0A0A0"/>
                    </svg>
                </div>
                <div>
                    <svg width="34" height="24" viewBox="0 0 34 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" clipRule="evenodd" d="M5.33331 0.333344C4.00723 0.333344 2.73546 0.860128 1.79778 1.79781C0.860097 2.73549 0.333313 4.00726 0.333313 5.33334V18.6667C0.333313 19.9928 0.860097 21.2645 1.79778 22.2022C2.73546 23.1399 4.00723 23.6667 5.33331 23.6667H22C23.3261 23.6667 24.5978 23.1399 25.5355 22.2022C26.4732 21.2645 27 19.9928 27 18.6667V16.0233L30.8216 19.845C31.0547 20.078 31.3517 20.2367 31.6749 20.301C31.9982 20.3653 32.3332 20.3323 32.6377 20.2061C32.9422 20.08 33.2025 19.8665 33.3856 19.5924C33.5688 19.3184 33.6666 18.9963 33.6666 18.6667V5.33334C33.6666 5.00376 33.5688 4.6816 33.3856 4.40758C33.2025 4.13356 32.9422 3.92 32.6377 3.79388C32.3332 3.66776 31.9982 3.63476 31.6749 3.69904C31.3517 3.76332 31.0547 3.92199 30.8216 4.15501L27 7.97668V5.33334C27 4.00726 26.4732 2.73549 25.5355 1.79781C24.5978 0.860128 23.3261 0.333344 22 0.333344H5.33331Z" fill="#A0A0A0"/>
                    </svg>
                </div>
            </>
        }
        <div>
          <svg width="8" height="30" viewBox="0 0 8 30" fill="none" xmlns="http://www.w3.org/2000/svg" onClick={() => {
            setShow(!show);
          }}>
            <path d="M4.00002 0C2.16669 0 0.666687 1.5 0.666687 3.33333C0.666687 5.16667 2.16669 6.66667 4.00002 6.66667C5.83335 6.66667 7.33335 5.16667 7.33335 3.33333C7.33335 1.5 5.83335 0 4.00002 0ZM4.00002 23.3333C2.16669 23.3333 0.666687 24.8333 0.666687 26.6667C0.666687 28.5 2.16669 30 4.00002 30C5.83335 30 7.33335 28.5 7.33335 26.6667C7.33335 24.8333 5.83335 23.3333 4.00002 23.3333ZM4.00002 11.6667C2.16669 11.6667 0.666687 13.1667 0.666687 15C0.666687 16.8333 2.16669 18.3333 4.00002 18.3333C5.83335 18.3333 7.33335 16.8333 7.33335 15C7.33335 13.1667 5.83335 11.6667 4.00002 11.6667Z" fill="#A0A0A0"/>
          </svg>
          <div className={show ? `${styles.menu} ${styles.show}` : styles.menu}>
            {
              room && room.ownerId === id || room?.isPersonal ? <Link onClick={() => deleteRoomFunc()} to={"/home"}>Delete chat</Link> : <Link onClick={() => leave()} to={'/home'}>Leave</Link>
            }
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomHeader;
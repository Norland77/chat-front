import {chatAPI} from "../../services/ChatServices";
import {useAppSelector} from "../../hooks/redux";
import styles from './users-list-modal.module.scss'
import {useNavigate} from "react-router-dom";
import React, {Dispatch, SetStateAction, useEffect} from "react";

interface PropsType {
    isOpen: boolean
    setIsOpen: Dispatch<SetStateAction<boolean>>
}

const UsersListModal = ({isOpen, setIsOpen}: PropsType) => {
    const {accessToken, id, username} = useAppSelector(state => state.userReducer)
    const {data: users} = chatAPI.useGetAllUsersQuery({token: accessToken})
    const [createPersonalRoom, {data: room}] = chatAPI.useCreatePersonalRoomMutation();
    const {data: rooms} = chatAPI.useFetchAllRoomsQuery(accessToken)
    const navigate = useNavigate();
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

    useEffect(() => {
        if (room)
            return navigate(`/home/room/${room && room.id}`);
    }, [room]);

    const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
        if (event.target !== event.currentTarget) {
            event.stopPropagation();
        } else {
            setIsOpen(false);
        }
    };

    useEffect(() => {

    }, [users]);

    return (
      <div onClick={(e) => handleOverlayClick(e)} className={styles.overlay} style={ isOpen ? {display: "flex"} : {display: 'none'}}>
          <div className={styles.usersPage}>
              <h1>Users</h1>
              <div className={styles.body}>
                  {users && users.map(user => (
                    <div key={user.id} onClick={() => createRoom(user.username, user.id)} className={styles.body__card}>
                        {user.avatar_url ? <img src={user.avatar_url} alt="avatar"/> : <div></div>}
                        <span>{user.username} {user.username === username && '(You)'}</span>
                    </div>
                  ))}
              </div>
          </div>
      </div>
    );
};

export default UsersListModal;
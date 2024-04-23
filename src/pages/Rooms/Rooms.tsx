import {chatAPI} from "../../services/ChatServices";
import styles from './rooms.module.scss'
import SocketApi from "../../api/socket-api";
import {useAppSelector} from "../../hooks/redux";
import {Link, useParams} from "react-router-dom";
import groupChat from '../../img/groupChat.svg'
const Rooms = () => {

    const {accessToken, id, username} = useAppSelector(state => state.userReducer)
    const {data: rooms} = chatAPI.useFetchAllRoomsQuery(accessToken)
    const params = useParams();
    const joinToRoom = (id: string) => {
        SocketApi.socket?.emit('joinRoom', id);
    }

    function formatTime(dateTime: Date) {
        const date = new Date(dateTime);
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const seconds = date.getSeconds().toString().padStart(2, '0');
        return `${hours}:${minutes}:${seconds}`;
    }
    return (
        <div className={styles.body}>
            {rooms && rooms.map(room => (room.users.find(user => user.id === id) || !room.isPrivate) && (
                <div key={room.id} className={styles.roomBlock}>
                    <Link to={`/home/room/${room.id}`} key={room.id} onClick={() => {
                        joinToRoom(room.id)
                    }} className={`${room.id === params.Id && styles.active} ${styles.room}`}>
                        <div>
                            <div className={styles.room_name}>
                                <p>{room.name.split(",")[0] === username ? room.name.split(",")[1] : room.name.split(",")[0]}</p>
                                { !room.isPersonal && <img src={groupChat} alt="groupChat"/>}
                            </div>
                            <span>{room.messages.length > 0 && formatTime(room.messages[room.messages.length - 1].createdAt)}</span>
                        </div>
                        <div className={styles.room_msg}>
                            {
                                !room.isPersonal && <span>{room.messages.length > 0 && `${room.messages[room.messages.length - 1].username}:`}</span>
                            }
                            {
                              room.messages.length > 0 && room.messages[room.messages.length - 1].text !== '' ?
                                <p>{ room.messages[room.messages.length - 1].text }</p> : room.messages.length > 0 && room.messages[room.messages.length - 1].text === '' ?
                                <p>Files</p> : <></>
                            }
                        </div>
                    </Link>
                </div>
            ))}
        </div>
    );
};

export default Rooms;
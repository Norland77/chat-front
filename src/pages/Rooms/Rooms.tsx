import {useState} from 'react';
import {chatAPI} from "../../services/ChatServices";
import styles from './rooms.module.scss'
import SocketApi from "../../api/socket-api";
const Rooms = () => {
    const [text, setText] = useState('')
    const {data: rooms} = chatAPI.useFetchAllRoomsQuery(null)
    const [createRoom, {}] = chatAPI.useCreateRoomMutation();

    const joinToRoom = (id: string) => {
        SocketApi.socket?.emit('joinRoom', id);
    }

    return (
        <div className={styles.body}>
            {rooms && rooms.map(room => (
                <div key={room.id} onClick={() => {joinToRoom(room.id)}} className={styles.room}>
                    {room.name}
                </div>
            ))}
            <div>
                <input type="text" value={text} onChange={(e) => {
                    setText(e.target.value)
                }}/>
                <button onClick={() => createRoom({name: text})}>Create room</button>
            </div>
        </div>
    );
};

export default Rooms;
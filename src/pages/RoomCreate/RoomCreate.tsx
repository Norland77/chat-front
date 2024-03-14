import styles from './room-create.module.scss'
import {chatAPI} from "../../services/ChatServices";
import {useAppSelector} from "../../hooks/redux";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";

const RoomCreate = () => {
    const [text, setText] = useState('')
    const [isPrivate, setIsPrivate] = useState(false)
    const {accessToken, id} = useAppSelector(state => state.userReducer)
    const [createRoom, {data: createdRoom}] = chatAPI.useCreateRoomMutation();
    const navigate = useNavigate();
    const createRoomFunc = () => {
        createRoom({name: text, token: accessToken, ownerId: id, isPrivate: isPrivate});
        setText('')
    }

    useEffect(() => {
        if (createdRoom) {
            return navigate(`../room/${createdRoom.id}`);
        }
    }, [createdRoom]);

    return (
        <div className={styles.body}>
            <h1>Create Room</h1>
            <div className={styles.body_name}>
                <label htmlFor='name'>Name</label>
                <input name={'name'} id={'name'} type="text" value={text} onChange={(e) => {
                    setText(e.target.value)
                }}/>
            </div>
            <div className={styles.body_privat}>
                <input onChange={(e) => {setIsPrivate(e.target.checked)}} type="checkbox" id={'private'} name={'private'} value={'private'}/>
                <label htmlFor='private'>Private</label>
            </div>
            <button onClick={() => createRoomFunc()}>Create room</button>
        </div>
    );
};

export default RoomCreate;
import {chatAPI} from "../../services/ChatServices";
import {useAppSelector} from "../../hooks/redux";
import styles from './users-page.module.scss'
import {useNavigate} from "react-router-dom";
import {useEffect} from "react";

const UsersPage = () => {
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

    return (
        <div className={styles.usersPage}>
            <h1>Users</h1>
            <div className={styles.body}>
                {users && users.map(user => (
                    <div key={user.id} onClick={() => createRoom(user.username, user.id)} className={styles.body__card}>
                        {user.username} {user.username === username && '(You)'}
                    </div>
                ))}
            </div>
        </div>

    );
};

export default UsersPage;
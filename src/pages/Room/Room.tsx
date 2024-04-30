import React, { useEffect, useRef, useState } from 'react';
import { chatAPI } from "../../services/ChatServices";
import { useAppSelector } from "../../hooks/redux";
import { useNavigate, useParams} from "react-router-dom";
import SocketApi from "../../api/socket-api";
import styles from './room.module.scss';
import RoomHeader from "../../components/Room/RoomHeader/RoomHeader";
import RoomSidebar from "../../components/Room/RoomSidebar/RoomSidebar";
import RoomInput from "../../components/Room/RoomInput/RoomInput";
import RoomMessage from "../../components/Room/RoomMessage/RoomMessage";
import {IMessage} from "../../interfaces/IMessage";
import {IUser} from "../../interfaces/IUser";

const Room = () => {
    const {accessToken, id} = useAppSelector(state => state.userReducer);
    const params = useParams();
    const [deleteRoom, {}] = chatAPI.useDeleteRoomMutation();
    const [fetchAllMessage, {data: messages}] = chatAPI.useFetchAllMessagesMutation();
    const {data: room, isLoading, refetch} = chatAPI.useGetRoomQuery({
        id: params.Id ? params.Id : "",
        token: accessToken
    })
    const [currentMessages, setCurrentMessages] = useState<IMessage[]>([]);
    const {username,} = useAppSelector(state => state.userReducer);
    const [userCount, setUserCount] = useState(0);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [isEdit, setIsEdit] = useState(false);
    const [editMsg, setEditMsg] = useState('');
    const [editId, setEditId] = useState('')
    const navigate = useNavigate();
    const [refetchRoom, {}] = chatAPI.useRefetchRoomMutation();
    const [isUserExist, setIsUserExist] = useState(false);


    useEffect(() => {
        if (messages) {
            console.log(messages)
            setCurrentMessages(messages);
        }

    }, [messages]);
    const scrollToBottom = () => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight + 20;
        }
    };

    useEffect(() => {
        let user: IUser | undefined = undefined;
        user = room && room.users.find(user => user.id === id);

        if (!user && !isLoading && room && room.isPrivate) {
            return navigate('/home');
        }

        if (user) {
            setIsUserExist(true);
        }
    }, [room]);

    useEffect(() => {
        scrollToBottom();
    }, [currentMessages]);

    useEffect(() => {
        setTimeout(() => {
            SocketApi.socket?.emit('joinRoom', params.Id);
            fetchAllMessage({ id: params.Id, token: accessToken });
            SocketApi.socket?.emit('getUsersInRoom', { roomId: params.Id });
            SocketApi.socket?.on('chatToClient', message => {
                setCurrentMessages(prevMessages => [...prevMessages, message]);
                fetchAllMessage({ id: params.Id, token: accessToken });
                refetchRoom({token: accessToken, id: params.Id ? params.Id : ''});
            });

            SocketApi.socket?.on('chatToClientDelete', id => {
                setCurrentMessages(prevMessages => prevMessages.filter(message => message.id !== id));
                fetchAllMessage({ id: params.Id, token: accessToken });
                refetchRoom({token: accessToken, id: params.Id ? params.Id : ''});
            });

            SocketApi.socket?.on('kickedUser', () => {
                refetchRoom({token: accessToken, id: params.Id ? params.Id : ''});
            });

            SocketApi.socket?.on('userAdd', () => {
                refetchRoom({token: accessToken, id: params.Id ? params.Id : ''});
            });

            SocketApi.socket?.on('chatToClientUpdate', message => {
                setCurrentMessages(prevMessages => [...prevMessages, message]);
                fetchAllMessage({ id: params.Id, token: accessToken });
                refetchRoom({token: accessToken, id: params.Id ? params.Id : ''});
            });

            SocketApi.socket?.on('UsersInRoom', (count: number) => {
                setUserCount(count);
            });
        }, 1);

        return () => {
            setIsUserExist(false);
            SocketApi.socket?.emit('leaveRoom', params.Id);
            SocketApi.socket?.emit('getUsersInRoom', { roomId: params.Id });
        }
    }, [params.Id, accessToken, refetch]);

    const editMessage = (id: string, text: string) => {
        setIsEdit(true)
        setEditId(id);
        setEditMsg(text)
    }

    const deleteRoomFunc = () => {
        deleteRoom({id: params.Id ? params.Id : "", token: accessToken});
        return navigate('/home')
    };

    return (
        <div className={styles.body}>
            <div className={styles.room}>
                <RoomHeader userCount={userCount} room={room} id={id} deleteRoomFunc={deleteRoomFunc} />
                <div className={styles.room_body}>
                    <div className={styles.room_msgArea} ref={messagesEndRef}>
                        {currentMessages && currentMessages.map(message => (
                            <RoomMessage message={message} id={id} editMessage={editMessage} isUserExist={isUserExist}/>
                        ))}
                    </div>
                    <RoomInput
                      isUserExist={isUserExist}
                      id={id} username={username}
                      accessToken={accessToken}
                      setIsEdit={setIsEdit}
                      setEditId={setEditId}
                      editId={editId}
                      editMsg={editMsg}
                      isEdit={isEdit}
                      setEditMsg={setEditMsg}
                    />
                </div>
            </div>
            <RoomSidebar room={room} username={username} accessToken={accessToken} id={id} deleteRoomFunc={deleteRoomFunc} />
        </div>
    );
};

export default Room;
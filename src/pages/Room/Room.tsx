import React, { useEffect, useRef, useState } from 'react';
import { chatAPI } from "../../services/ChatServices";
import { useAppSelector } from "../../hooks/redux";
import {Link, useNavigate, useParams} from "react-router-dom";
import SocketApi from "../../api/socket-api";
import { IMessage, IUser} from "../../interfaces/IChat";
import styles from './room.module.scss';

const Room = () => {
    const {accessToken, id} = useAppSelector(state => state.userReducer);
    const params = useParams();
    const [text, setText] = useState('');
    const [fetchAllMessage, {data: messages}] = chatAPI.useFetchAllMessagesMutation();
    const [deleteRoom, {}] = chatAPI.useDeleteRoomMutation();
    const {data: room, isLoading, refetch} = chatAPI.useGetRoomQuery({
        id: params.Id ? params.Id : "",
        token: accessToken
    })
    const [currentMessages, setCurrentMessages] = useState<IMessage[]>([]);
    const {username,} = useAppSelector(state => state.userReducer);
    const [userCount, setUserCount] = useState(0);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [show, setShow] = useState(false);
    const [editMsg, setEditMsg] = useState('');
    const [isEdit, setIsEdit] = useState(false);
    const [editId, setEditId] = useState('')
    const [inviteLink, setInviteLink] = useState('');
    const [createInvite, {}] = chatAPI.useCreateInviteMutation();
    const [leaveRoom, {}] = chatAPI.useLeaveRoomMutation();
    const navigate = useNavigate();
    const [createPersonalRoom, {data: roomCreated}] = chatAPI.useCreatePersonalRoomMutation();
    const {data: rooms} = chatAPI.useFetchAllRoomsQuery(accessToken)
    const [refetchRoom, {}] = chatAPI.useRefetchRoomMutation();
    const [isUserExist, setIsUserExist] = useState(false);
    const [accept, {}] = chatAPI.useAcceptInviteMutation()
    const [inputKey, setInputKey] = useState(0);
    const [file, setFile] = useState<File>();


    useEffect(() => {
        if (messages) {
            console.log(messages)
            setCurrentMessages(messages);
        }

    }, [messages]);
    const scrollToBottom = () => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
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
        if (room && room.inviteLink) {
            setInviteLink(room.inviteLink);
        }
    }, [room]);

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
            setInviteLink('');
            setIsUserExist(false);
            SocketApi.socket?.emit('leaveRoom', params.Id);
            SocketApi.socket?.emit('getUsersInRoom', { roomId: params.Id });
        }
    }, [params.Id, accessToken, refetch]);


    const sendMessage = () => {
        if (file) {
            const chunkSize = 1024 * 1024;
            const fileSize = file.size;

            let offset = 0;
            SocketApi.socket?.emit('sendFileInfo', {name: file.name, type: file.type});
            while (offset < fileSize) {
                const chunk = file.slice(offset, offset + chunkSize);
                SocketApi.socket?.emit('uploadChunk', chunk);
                offset += chunkSize;
            }
        }
        SocketApi.socket?.emit('chatToServer', { text: text, roomId: params.Id, userId: id, username: username, createdAt: new Date() });
        setText('');
        setInputKey(inputKey+1)
    };

    const deleteRoomFunc = () => {
        deleteRoom({id: params.Id ? params.Id : "", token: accessToken});
        return navigate('/home')
    };

    const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            if (isEdit) {
                updateMessageFunc();
            } else {
                sendMessage();
            }
        }
    };

    function formatTime(dateTime: Date) {
        const date = new Date(dateTime);
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const seconds = date.getSeconds().toString().padStart(2, '0');
        return `${hours}:${minutes}:${seconds}`;
    }

    const deleteMessageFunc = (id: string, roomId: string) => {
        SocketApi.socket?.emit('chatToServerDelete', { id: id, roomId: roomId});
    }

    const updateMessageFunc = () => {
        SocketApi.socket?.emit('chatToServerUpdate', { id: editId, message: {text: editMsg, roomId: params.Id}});
        setIsEdit(false)
        setEditId('');
        setEditMsg('')
    }

    const editMessage = (id: string, text: string) => {
        setIsEdit(true)
        setEditId(id);
        setEditMsg(text)
    }

    const closeEdit = () => {
        setIsEdit(false)
        setEditId('');
        setEditMsg('')
    }

    const generateLink = () => {
        let abc = "abcdefghijklmnopqrstuvwxyz1234567890";
        let hash = "";
        while (hash.length < 15) {
            hash += abc[Math.floor(Math.random() * abc.length)];
        }
        setInviteLink(`http://localhost:3000/${hash}`)
        createInvite({dto: {roomId: params.Id ? params.Id : "", token: hash, accept: true, inviteLink: `http://localhost:3000/${hash}`}, token: accessToken});
    }

    const leave = () => {
        leaveRoom({roomId: params.Id ? params.Id: "", userId: id, token: accessToken});

        return navigate('/home');
    }

    const kick = (id: string) => {
        leaveRoom({roomId: params.Id ? params.Id: "", userId: id, token: accessToken})
        SocketApi.socket?.emit('kickUser', { roomId: params.Id });
    }

    const urlRegex = /(?:https?|ftp):\/\/[\n\S]+/g;


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
        if (roomCreated)
            return navigate(`/home/room/${roomCreated && roomCreated.id}`);
    }, [roomCreated]);

    const joinRoom = () => {
        accept({roomId: params.Id ? params.Id : '', token: accessToken, userId: id});
        refetchRoom({id: params.Id ? params.Id : '', token: accessToken});
    }

    const handleFileChange = (event: any) => {
        const file = event.target.files[0];
        console.log(event.target.files[0])
        setFile(file);
    };

    return (
        <div className={styles.body}>
            <div className={styles.room}>
                <div className={styles.room_header}>
                    <p>Users in room: {userCount}</p>
                    {
                       room && room.ownerId === id && <Link onClick={() => deleteRoomFunc()} to={"/home"}>Delete Room</Link>
                    }
                </div>
                <div className={styles.room_body}>
                    <div className={styles.room_msgArea} ref={messagesEndRef}>
                        {currentMessages && currentMessages.map(message => (
                            <div key={message.id}
                                 onClick={() => setShow(!show)}
                                 className={message.userId === id ? styles.room_body_right : styles.room_body_left}>
                                <span>{message.username}:</span>
                                <div dangerouslySetInnerHTML={{
                                    __html: message.text?.replace(urlRegex, (url) => (
                                        `<a href="${url}">${url}</a>`
                                    ))
                                }}/>
                                {message.files.map(file => (
                                    <>
                                        {
                                            file.mimetype.split('/')[0] === 'image' && <img src={`${file.path}`} alt={`${file.name}`}/>
                                        }
                                    </>
                                ))}
                                <div className={styles.room_body_msgDown}>
                                    <span
                                        className={styles.time}>{message.updatedAt === message.createdAt ? formatTime(message.createdAt) : `${formatTime(message.createdAt)} (edit at ${formatTime(message.updatedAt)})`}</span>
                                    {
                                        message.userId === id && isUserExist && <>
                                            <span onClick={() => deleteMessageFunc(message.id, message.roomId)}
                                                  className={styles.btn}>delete</span>
                                            <span onClick={() => editMessage(message.id, message.text)}
                                                  className={styles.btn}>edit</span>
                                        </>
                                    }
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className={styles.room_body_input}>
                        {
                            isUserExist ? <>
                                <input type="text" value={isEdit ? editMsg : text} onChange={isEdit ? (e) => {
                                    setEditMsg(e.target.value);
                                } : (e) => {
                                    setText(e.target.value);
                                }} onKeyPress={handleKeyPress}/>
                                <button onClick={isEdit ? () => updateMessageFunc() : () => sendMessage()}>{isEdit ? "Edit" : "Send"}</button>
                                <input type="file" onChange={handleFileChange} key={inputKey}/>
                            </> : <button onClick={() => joinRoom()} className={styles.join_button}>Join to Chat</button>
                        }
                        {
                            isEdit && <button onClick={() => closeEdit()}>X</button>
                        }
                    </div>
                </div>
            </div>
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
        </div>
    );
};

export default Room;

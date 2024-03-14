import React from 'react';
import {useNavigate, useParams} from "react-router-dom";
import {chatAPI} from "../../services/ChatServices";
import {useAppSelector} from "../../hooks/redux";
import SocketApi from "../../api/socket-api";

const InvitePage = () => {
    const params = useParams()
    const {accessToken, id} = useAppSelector(state => state.userReducer)
    const {data: room} = chatAPI.useGetInviteRoomQuery({tokenn: params.token ? params.token : "", token: accessToken})
    const [accept, {}] = chatAPI.useAcceptInviteMutation()
    const navigate = useNavigate()
    const acceptFunc = () => {
        accept({roomId: room?.roomId ? room.roomId : "", token: accessToken, userId: id})
        SocketApi.socket?.emit('userAddToChat', { roomId: room?.roomId});
        return navigate(`/home/room/${room?.roomId}`)
    }

    return (
        <div>
            {
                room && <div>
                    <h1>Invite to room: {room.room.name}</h1>
                    <button onClick={() => acceptFunc()}>Accept</button>
                </div>
            }
        </div>
    );
};

export default InvitePage;
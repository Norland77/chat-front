import {createSlice} from "@reduxjs/toolkit";
import {IMessage} from "../../interfaces/IChat";

interface ChatState {
    messages: IMessage[];
    isLoading: boolean;
    error: string;
}

const initialState: ChatState = {
    messages: [],
    isLoading: false,
    error: ''
}

export const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {

    }
})

export default chatSlice.reducer;
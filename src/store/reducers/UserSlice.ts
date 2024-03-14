import {createSlice, PayloadAction} from "@reduxjs/toolkit";

interface UserState {
    accessToken: string;
    username: string;
    id: string;
    isLoading: boolean;
    error: string;
}

const initialState: UserState = {
    accessToken: '',
    username: '',
    id: '',
    isLoading: false,
    error: ''
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setToken: (state, action: PayloadAction<string>) => {
            state.accessToken = action.payload
        },
        setName: (state, action: PayloadAction<string>) => {
            state.username = action.payload
        },
        setId: (state, action: PayloadAction<string>) => {
            state.id = action.payload
        },
    }
})

export const { setName, setToken, setId } = userSlice.actions;

export default userSlice.reducer;
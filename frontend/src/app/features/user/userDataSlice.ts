import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { AxiosInstance } from "axios";

interface Language {
    code: string;
    flag: string;
    id: number;
    name: string;
}

export interface UserDataState {
    languages: Language[];
    loading: boolean;
    error: string | null;
}

const initialState: UserDataState = {
    languages: [],
    loading: false,
    error: null,
};

export const getLanguagesAsync = createAsyncThunk("userData/getLanguages", async (axiosInstance: AxiosInstance) => {
    const response = await axiosInstance.get(`/api/language`);
    return response.data;
});

export const UserDataSlice = createSlice({
    name: "userData",
    initialState,
    reducers: {
        setLanguages: (state) => {
            state.languages = [{ code: "sl", name: "Slovenian", flag: "🇸🇮", id: 1 }];
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getLanguagesAsync.pending, (state) => {
                state.loading = false;
                state.error = null;
            })
            .addCase(getLanguagesAsync.fulfilled, (state, action) => {
                state.loading = false;
                state.languages = action.payload;
            })
            .addCase(getLanguagesAsync.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "Failed to fetch languages";
            });
    },
});

export const { setLanguages } = UserDataSlice.actions;
export default UserDataSlice.reducer;

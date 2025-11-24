import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { AxiosInstance } from "axios";

interface Language {
    code: string;
    flag: string;
    id: number;
    name: string;
}

interface Tag {
    tag_name: string;
    id: number;
    language: number;
}

export interface UserDataState {
    languages: Language[];
    loading: boolean;
    error: string | null;
    tags: Tag[];
}

const initialState: UserDataState = {
    languages: [],
    loading: false,
    error: null,
    tags: [],
};

export const getLanguagesAsync = createAsyncThunk("userData/getLanguages", async (axiosInstance: AxiosInstance) => {
    const response = await axiosInstance.get(`/api/language`);
    return response.data;
});

export const getTagsAsync = createAsyncThunk("userData/getTags", async (axiosInstance: AxiosInstance) => {
    const response = await axiosInstance.get(`/api/tag`);
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
            // languages cases
            .addCase(getLanguagesAsync.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getLanguagesAsync.fulfilled, (state, action) => {
                state.loading = false;
                state.languages = action.payload;
            })
            .addCase(getLanguagesAsync.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "Failed to fetch languages";
            })
            // tags cases
            .addCase(getTagsAsync.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getTagsAsync.fulfilled, (state, action) => {
                state.loading = false;
                state.tags = action.payload;
            })
            .addCase(getTagsAsync.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "Failed to fetch tags";
            });
    },
});

export const { setLanguages } = UserDataSlice.actions;
export default UserDataSlice.reducer;

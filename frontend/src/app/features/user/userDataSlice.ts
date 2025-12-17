import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { AxiosInstance } from "axios";

type Language = {
    code: string;
    flag: string;
    id: number;
    name: string;
};

type Tag = {
    tag_name: string;
    id: number;
    language: number;
};

type UserProfileData = {
    username: string;
    id: number;
    email: string;
    created_at: string;
    updated_at: string;
    fact_most_likes: number;
    fact_total_likes: number;
    tag_most_posted: string;
    follows: number[];
    description: string;
    profile_image: string;
};

export type UserDataState = {
    languages: Language[];
    loading: boolean;
    error: string | null;
    tags: Tag[];
    userProfile: UserProfileData | null;
};

const initialState: UserDataState = {
    languages: [],
    loading: false,
    error: null,
    tags: [],
    userProfile: null,
};

export const getLanguagesAsync = createAsyncThunk("userData/getLanguages", async (axiosInstance: AxiosInstance) => {
    const response = await axiosInstance.get(`/api/language`);
    return response.data;
});

export const getTagsAsync = createAsyncThunk("userData/getTags", async (axiosInstance: AxiosInstance) => {
    const response = await axiosInstance.get(`/api/tag`);
    return response.data;
});

export const getUserProfileAsync = createAsyncThunk(
    "userData/getUserProfile",
    async ({ axiosInstance, userID }: { axiosInstance: AxiosInstance; userID: number | undefined }) => {
        const response = await axiosInstance.get(`/api/profile/${userID}/`);
        return response.data;
    }
);

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
            })
            // userProfile cases
            .addCase(getUserProfileAsync.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getUserProfileAsync.fulfilled, (state, action) => {
                state.loading = false;
                state.userProfile = action.payload;
            })
            .addCase(getUserProfileAsync.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "Failed to fetch user profile";
            });
    },
});

export const { setLanguages } = UserDataSlice.actions;
export default UserDataSlice.reducer;

import type { RootState, AppDispatch } from "../app/store";
import { useDispatch, useSelector } from "react-redux";
import { setLanguages } from "../app/features/user/userDataSlice";
import { useAxios } from "../utils/useAxios";
import { getLanguagesAsync } from "../app/features/user/userDataSlice";

const TestPageMiddleScroll = () => {
    // const languages = useSelector((state: RootState) => state.userData.languages);
    // const dispatch = useDispatch();
    const axiosInstance = useAxios();
    const dispatch = useDispatch<AppDispatch>();
    const { languages, loading, error } = useSelector((state: RootState) => state.userData);

    return (
        <div className="flex flex-col">
            <span>Languages are: </span>
            {languages.map((language) => (
                <span key={language.id}>{`${language.flag} ${language.name}`}</span>
            ))}
            <button
                className="border border-black rounded-md p-2 cursor-pointer shadow-2xl w-1/3"
                type="button"
                onClick={() => dispatch(setLanguages())}
            >
                Set language to SI
            </button>
            <button
                className="border border-black rounded-md p-2 cursor-pointer shadow-2xl w-1/3"
                type="button"
                onClick={() => {
                    dispatch(getLanguagesAsync(axiosInstance));
                }}
            >
                Get Languages from api.
            </button>
        </div>
    );
};

export default TestPageMiddleScroll;

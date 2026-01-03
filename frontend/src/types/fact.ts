export type Fact = {
    id: number;
    username: string;
    profile: {
        id: number;
        profile_image: string;
        // user: string; // TODO user URL
    };
    content: string;
    source: string;
    tags: Tag[];
    created_at: string;
    visibility: "public" | "private" | "followers";
    upvotes: number;
    // TODO currently is returned only `language` id
    language: number;
    // language: {
    //     code: string;
    //     flag: string;
    //     name: string;
    // };
    is_upvoted: boolean;
};

export type Tag = {
    id: number;
    language: number;
    tag_name: string;
};

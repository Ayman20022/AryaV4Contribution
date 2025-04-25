import { UserEssentials } from "../user/UserEssentials";


export interface Post {
    id: string;
    postedBy: UserEssentials
    type: "POST" | "PROJECT";
    status: "DRAFT" | "PUBLIC" | "PRIVATE";
    isNetworkingOnly: boolean;
    commentsCount: number;
    agreeCount: number;
    disagreeCount: number;
    media: Media[];
    content: string;
    isAgreed: boolean;
    isDisagreed: boolean;
    link: string;
    createdAt: string;
    updatedAt: string;
}

export interface Media {
    id: string;
    type: "IMAGE" | "VIDEO";
    url: string;
    thumbnailUrl?: string; 
    altText?: string; 
}
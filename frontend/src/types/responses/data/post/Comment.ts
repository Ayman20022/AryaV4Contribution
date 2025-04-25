import { UserEssentials } from "../user/UserEssentials";

export interface Comment {
    id: string;
    comment: string;
    createdBy: UserEssentials;
    agreeCount: number;
    disagreeCount: number;
    replies: Comment[];
    createdAt: string;
    updatedAt: string;
}
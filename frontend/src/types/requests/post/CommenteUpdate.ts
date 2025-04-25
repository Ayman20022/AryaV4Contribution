export interface CommentCreate {
    comment: string;
    images?: File[];
    videos?: File[];
    oldImages?: string[];
    oldVideos?: string[];
}
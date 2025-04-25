export interface PostCreate {
    type: "POST" | "PROJECT";
    content: string;
    status: "DRAFT" | "PUBLIC" | "PRIVATE";
    neededContributors: string[];
    images: File[];
    videos: File[];
    isNetworkingOnly: boolean;
    link?: string;
}
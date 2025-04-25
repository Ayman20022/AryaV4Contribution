export interface PostUpdate {
    content: string;
    status: "DRAFT" | "PUBLIC" | "PRIVATE";
    neededContributors?: string[];
    images?: any[];
    videos?: any[];
    isNetworkingOnly?: boolean;
    oldImages?: string[]
    oldVideos?: string[];
    oldNeededContributors?: string[];
    link?: string;
}
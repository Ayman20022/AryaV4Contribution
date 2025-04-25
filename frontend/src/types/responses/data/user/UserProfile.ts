export interface UserProfile {
    id: string;
    firstName: string;
    lastName: string;
    username: string;
    bio: string;
    networking: number;
    networked: number;
    avatarUrl: string;
    isNetworking?: boolean;
    isNetworked?: boolean;
}
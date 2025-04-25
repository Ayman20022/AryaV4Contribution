export interface User {
    id: string;
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    bio: string;
    avatarUrl: string;
    networking: number;
    networked: number;
    preferences: string[];
    birthDate: string;
    balance: number;
    createdAt: string
}